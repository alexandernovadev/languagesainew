# Development Guide — LanguagesAI Frontend

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (domain + UI stores) |
| Routing | React Router v6 |
| HTTP | Axios via `HttpClient` base class |
| Forms | react-hook-form + zod |

## Project Structure

```
src/
├── pages/              # Route-level components (one file per page)
├── routes/             # Lazy-loaded page exports (lazyRoutes.ts)
├── services/           # API clients — one file per domain
│   └── api/HttpClient.ts  # Base class for all services
├── shared/
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Primitives (Button, Card, PageLoader, etc.)
│   │   ├── dialogs/    # Heavy dialogs (lazy-loaded at usage site)
│   │   ├── tables/     # Data tables per domain
│   │   └── filters/    # Filter modals per domain
│   └── hooks/          # Domain data hooks (useWords, useExpressions…)
├── lib/store/          # Zustand stores
│   ├── *-store.ts      # Domain state (words, expressions, lectures…)
│   └── index.ts        # Re-exports
├── types/              # TypeScript types
│   ├── models/         # Domain models (IWord, IExpression…)
│   └── api/            # Request/response shapes
└── utils/              # Pure utilities (no side effects)
```

## Adding a New Page

### 1. Create the service

```ts
// src/services/thingService.ts
import { HttpClient } from "./api/HttpClient";

class ThingService extends HttpClient {
  async getThings(page: number, limit: number, signal?: AbortSignal) {
    return this.get(`/api/things?page=${page}&limit=${limit}`, { signal });
  }
  async createThing(data: ThingCreate) { return this.post("/api/things", data); }
  async updateThing(id: string, data: ThingUpdate) { return this.put(`/api/things/${id}`, data); }
  async deleteThing(id: string) { return this.delete(`/api/things/${id}`); }
}

export const thingService = new ThingService();
```

### 2. Create the domain hook

```ts
// src/shared/hooks/useThings.ts
import { useState, useEffect, useCallback } from "react";
import { thingService } from "@/services/thingService";
import { isAbortError } from "@/utils/common/isAbortError";
import { toast } from "sonner";

export function useThings() {
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchThings = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await thingService.getThings(currentPage, 10, signal);
      if (signal?.aborted) return;
      setThings(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err: any) {
      if (isAbortError(err)) return;
      toast.error(err.message || "Error loading things");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [currentPage]);

  // Optimistic delete
  const deleteThing = async (id: string) => {
    const prev = things;
    setThings(curr => curr.filter(t => t._id !== id));
    setTotal(n => n - 1);
    try {
      await thingService.deleteThing(id);
      toast.success("Deleted");
      return true;
    } catch (err: any) {
      setThings(prev);
      setTotal(n => n + 1);
      toast.error(err.message || "Error deleting");
      return false;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchThings(controller.signal);
    return () => controller.abort();
  }, [fetchThings]);

  return { things, loading, total, totalPages, currentPage, deleteThing,
           goToPage: setCurrentPage };
}
```

### 3. Create a UI store (if the page has dialogs/modals)

```ts
// src/lib/store/things-store.ts
import { create } from "zustand";
import { IThing } from "@/types/models/Thing";

interface ThingsUIState {
  dialogOpen: boolean; setDialogOpen: (v: boolean) => void;
  selectedThing: IThing | null; setSelectedThing: (t: IThing | null) => void;
  deleteDialogOpen: boolean; setDeleteDialogOpen: (v: boolean) => void;
  thingToDelete: IThing | null; setThingToDelete: (t: IThing | null) => void;
  deleteLoading: boolean; setDeleteLoading: (v: boolean) => void;
}

export const useThingsUIStore = create<ThingsUIState>((set) => ({
  dialogOpen: false, setDialogOpen: (v) => set({ dialogOpen: v }),
  selectedThing: null, setSelectedThing: (t) => set({ selectedThing: t }),
  deleteDialogOpen: false, setDeleteDialogOpen: (v) => set({ deleteDialogOpen: v }),
  thingToDelete: null, setThingToDelete: (t) => set({ thingToDelete: t }),
  deleteLoading: false, setDeleteLoading: (v) => set({ deleteLoading: v }),
}));
```

Export it from `src/lib/store/index.ts`.

### 4. Create the page

```tsx
// src/pages/ThingsPage.tsx
import { lazy, Suspense, useRef, useCallback } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { TablePagination } from "@/shared/components/ui/table-pagination";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { useThings } from "@/shared/hooks/useThings";
import { useThingsUIStore } from "@/lib/store/things-store";

// Lazy-load heavy dialogs
const ThingDialog = lazy(() =>
  import("@/shared/components/dialogs/ThingDialog").then(m => ({ default: m.ThingDialog }))
);

export default function ThingsPage() {
  const { things, loading, total, totalPages, currentPage, deleteThing, goToPage } = useThings();
  const { dialogOpen, setDialogOpen, selectedThing, setSelectedThing,
          deleteDialogOpen, setDeleteDialogOpen, thingToDelete, setThingToDelete,
          deleteLoading, setDeleteLoading } = useThingsUIStore();

  const dialogMounted = useRef(false);

  const handleDeleteConfirm = useCallback(async () => {
    if (!thingToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteThing(thingToDelete._id);
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  }, [thingToDelete, deleteThing, setDeleteLoading, setDeleteDialogOpen]);

  return (
    <div className="space-y-4">
      <PageHeader title="Things" description="Manage things" />

      {/* Table, filters, etc. */}

      <TablePagination
        currentPage={currentPage} totalPages={totalPages}
        total={total} itemsCount={things.length}
        itemLabel="things" onPageChange={goToPage}
      />

      {(dialogMounted.current || (dialogMounted.current = dialogOpen, dialogOpen)) && (
        <Suspense fallback={null}>
          <ThingDialog open={dialogOpen} onOpenChange={setDialogOpen}
            thing={selectedThing} onSave={async () => {}} />
        </Suspense>
      )}

      <AlertDialogNova open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}
        title="Delete thing?" description="This cannot be undone."
        onConfirm={handleDeleteConfirm} loading={deleteLoading} />
    </div>
  );
}
```

### 5. Register the route

```ts
// src/routes/lazyRoutes.ts — add:
export const ThingsPage = lazy(() => import("../pages/ThingsPage"));
```

```tsx
// src/App.tsx — add inside <Routes>:
<Route path="/things" element={<ProtectedRoute><ThingsPage /></ProtectedRoute>} />
```

## Key Patterns

### Loading + Error states
Use `<PageLoader loading={loading} error={error} onRetry={reload}>` instead of manual `if (loading) return`.

### Dialogs
Always lazy-load dialogs with the mount-once pattern:
```tsx
const dialogMounted = useRef(false);
{(dialogMounted.current || (dialogMounted.current = open, open)) && (
  <Suspense fallback={null}><LazyDialog open={open} ... /></Suspense>
)}
```

### Error Boundary
`<ErrorBoundary>` wraps the entire app in `App.tsx`. For page-level boundaries, wrap individual routes.

### TypeScript — export type
Always use `import type` / `export type` for type-only imports to prevent esbuild runtime errors:
```ts
// services/myService.ts
import type { MyType } from "@/types/models/MyType";
export type { MyType };
```

## Setup

```bash
cp .env.example .env
# Fill in VITE_BACK_URL

npm install
npm run dev
```
