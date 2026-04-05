# Frontend Issues — Claude Analysis

**Project:** LanguagesAI Frontend (Vite + React 19 + TypeScript)  
**Version:** 6.0.1  
**Analyzed:** April 5, 2026  
**Overall Score:** 7.5/10

---

## Summary

| Severity | Count | Category |
|---|---|---|
| 🔴 CRITICAL | 0 | — |
| 🟠 SERIOUS | 1 | Performance |
| 🟡 MODERATE | 5 | Consistency, Code Quality |
| 🟢 LOW | 3 | DX, Build, Patterns |

**Total Issues: 12**

---

## 🔴 CRITICAL

### ISSUE #1: Token Refresh Logic Duplicated

**Severity:** 🔴 CRITICAL  
**Files:** `src/services/api.ts` (lines 14–52) + `src/services/api/HttpClient.ts` (lines 131–187)  
**Status:** ✅ Completed

#### Problem
Two completely separate token refresh implementations exist side by side. They read the token from different sources and have divergent logic. A bug fix in one won't be applied to the other.

- `api.ts` refresh: standalone function, reads token from raw localStorage JSON parse
- `HttpClient.ts` refresh: class method, correctly reads from Zustand store

#### Impact
- ❌ Bug in one implementation won't exist in the other — silent divergence
- ❌ Maintenance nightmare: two places to change the same logic
- ❌ Race condition possible if both run simultaneously

#### Solution
Remove token refresh entirely from `api.ts`. Migrate the `api` axios instance to use `HttpClient`, or at minimum share the refresh logic from a single source.

#### Acceptance Criteria
- [ ] Single token refresh implementation
- [ ] Both API clients read token from the same source (Zustand store)
- [ ] No token refresh logic in `api.ts`

---

### ISSUE #2: Token Read from Raw localStorage (XSS Vulnerability)

**Severity:** 🔴 CRITICAL  
**File:** `src/services/api.ts` lines 70–72  
**Status:** ✅ Completed

#### Problem
```ts
// CURRENT — VULNERABLE
const token = localStorage.getItem("user-storage")
  ? JSON.parse(localStorage.getItem("user-storage") || "{}")?.state?.token
  : null;
```
Directly parses Zustand's persisted JSON from localStorage. Any injected script can read this. `HttpClient.ts` correctly uses `useUserStore.getState().token` — `api.ts` should do the same.

#### Impact
- ❌ XSS vulnerability: any injected script reads the access token
- ❌ Tightly coupled to Zustand's internal persist format (breaks if format changes)
- ❌ Inconsistency with `HttpClient.ts` which reads from the store correctly

#### Solution
```ts
// REPLACE WITH:
import { useUserStore } from "@/lib/store/user-store";
const token = useUserStore.getState().token;
```

#### Acceptance Criteria
- [ ] `api.ts` reads token from Zustand store, not raw localStorage
- [ ] No direct JSON parse of localStorage for tokens

---

## 🟠 SERIOUS

### ISSUE #3: PronunciationGuidePage is a 67KB Monolith

**Severity:** 🟠 SERIOUS  
**File:** `src/pages/PronunciationGuidePage.tsx` (~67,000 bytes)  
**Status:** ⏳ Not Started

#### Problem
The largest file in the project by far. Contains inline section data, helper functions (`getIPABadgeColor`, etc.), and all JSX in a single component. Impossible to maintain or test independently.

#### Impact
- ❌ Single file for entire pronunciation guide — impossible to split lazily
- ❌ Inline data arrays bloat the component
- ❌ Helper functions untestable in isolation

#### Solution
- Extract data to `src/data/pronunciation.ts`
- Extract helpers to `src/utils/pronunciation/`
- Split into section components: `IPAChart`, `VowelsSection`, `ConsonantsSection`, `PronunciationSidebar`
- Page becomes an orchestrator of ~80 lines

#### Acceptance Criteria
- [ ] Page file under 150 lines
- [ ] Data extracted to `/src/data/`
- [ ] Helper functions extracted to `/src/utils/`
- [ ] Section components independently renderable

---

### ISSUE #4: Mixed HTTP Client Patterns (HttpClient vs plain api)

**Severity:** 🟠 SERIOUS  
**Files:** `src/services/wordService.ts`, `src/services/expressionService.ts`, `src/services/lectureService.ts`  
**Status:** ✅ Completed

#### Problem
Two parallel HTTP patterns coexist:
- `wordService` extends `HttpClient` (class-based, correct pattern)
- `expressionService`, `lectureService`, `userService` use the plain `api` axios instance directly

This means ISSUE #1 (token duplication) exists precisely because services don't use a single client.

#### Impact
- ❌ Error handling is inconsistent between service types
- ❌ Logging behavior differs
- ❌ Token refresh path differs
- ❌ New developers can't tell which pattern to follow

#### Solution
Migrate all services to extend `HttpClient`. Remove reliance on the legacy `api.ts` instance.

#### Acceptance Criteria
- [ ] All services extend `HttpClient`
- [ ] `api.ts` instance no longer used for domain services
- [ ] Consistent error handling across all services

---

## 🟡 MODERATE

### ISSUE #5: UI Stores are 95% Duplicate Code

**Severity:** 🟡 MODERATE  
**Files:** `src/lib/store/words-store.ts`, `expressions-store.ts`, `lectures-store.ts`, `users-store.ts`, `exams-store.ts`  
**Status:** ⏳ Not Started

#### Problem
Every CRUD UI store has the same shape: `dialogOpen`, `selectedItem`, `deleteDialogOpen`, `itemToDelete`, `searchTerm`, `deleteLoading`. The only difference is the type of item.

#### Solution
```ts
// src/lib/store/createCRUDUIStore.ts
export function createCRUDUIStore<T>() {
  return create<CRUDUIState<T>>(devtools((set) => ({
    dialogOpen: false, setDialogOpen: (v) => set({ dialogOpen: v }),
    selectedItem: null, setSelectedItem: (item) => set({ selectedItem: item }),
    deleteDialogOpen: false, setDeleteDialogOpen: (v) => set({ deleteDialogOpen: v }),
    itemToDelete: null, setItemToDelete: (item) => set({ itemToDelete: item }),
    searchTerm: "", setSearchTerm: (v) => set({ searchTerm: v }),
    deleteLoading: false, setDeleteLoading: (v) => set({ deleteLoading: v }),
  })));
}
```

#### Acceptance Criteria
- [ ] `createCRUDUIStore` factory function created
- [ ] All 5 UI stores use it
- [ ] ~400 lines of duplication eliminated

---

### ISSUE #6: Inconsistent Hook Patterns Across Domains

**Severity:** 🟡 MODERATE  
**Files:** `src/shared/hooks/useWords.ts`, `useExams.ts`, `useLectures.ts`, `useExpressions.ts`  
**Status:** ⏳ Not Started

#### Problem

| Hook | Filter Support | URL Sync | Optimistic | Pagination |
|---|---|---|---|---|
| `useWords` | ✅ Full | ✅ | ✅ | ✅ |
| `useExpressions` | ✅ Full | ❌ | ✅ | ✅ |
| `useLectures` | ✅ Partial | ✅ | ✅ | ✅ |
| `useUsers` | ✅ Partial | ❌ | ✅ | ✅ |
| `useExams` | ❌ None | ❌ | ❌ | ✅ |

`useExams` is also missing filter support and optimistic updates entirely.

#### Acceptance Criteria
- [ ] All hooks expose the same contract (same return shape)
- [ ] `useExams` gets filter support and optimistic updates
- [ ] URL sync standardized (either all pages or none)

---

### ISSUE #7: Hacky Dialog Mount Tracking Pattern

**Severity:** 🟡 MODERATE  
**Files:** `src/pages/WordsPage.tsx`, `ExpressionsPage.tsx`, `LecturesPage.tsx`, `UsersPage.tsx`  
**Status:** ⏳ Not Started

#### Problem
```tsx
// CURRENT — sets ref during conditional render (side effect in render)
const dialogMounted = useRef(false);
{(dialogMounted.current || (dialogMounted.current = dialogOpen, dialogOpen)) && (
  <Suspense fallback={null}><LazyDialog /></Suspense>
)}
```
This mutates a ref as a side effect of evaluating a JSX expression — undefined behavior in Strict Mode and Concurrent Mode.

#### Solution
```tsx
// Since lazy() already defers the import, just render when open:
{dialogOpen && (
  <Suspense fallback={null}><LazyDialog open={dialogOpen} ... /></Suspense>
)}
// The lazy chunk loads on first open. No ref needed.
```

#### Acceptance Criteria
- [ ] `dialogMounted` refs removed from all 4 pages
- [ ] Dialogs render conditionally on `open` state
- [ ] Lazy loading still works correctly

---

### ISSUE #8: ProtectedRoute Doesn't Validate Token Freshness

**Severity:** 🟡 MODERATE  
**File:** `src/shared/components/ProtectedRoute.tsx`  
**Status:** ⏳ Not Started

#### Problem
Only checks `isAuthenticated` boolean from the store. If the token is expired but the store hasn't been cleared yet, users access protected routes with a stale token. All API calls will 401 and the token refresh will trigger on the first request — but the initial render may show data briefly or fail silently.

#### Solution
Decode the JWT expiry on mount, trigger refresh proactively if within X seconds of expiry, block render until validation completes.

#### Acceptance Criteria
- [ ] Token expiry checked on protected route mount
- [ ] Proactive refresh triggered before expiry
- [ ] No flash of protected content with expired token

---

### ISSUE #9: Selector Memoization Missing in Stores

**Severity:** 🟡 MODERATE  
**Files:** `src/lib/store/words-store.ts` (and others with selector hooks)  
**Status:** ⏳ Not Started

#### Problem
```ts
// Creates new object on every render — triggers unnecessary re-renders
export const useWordsDialogs = () =>
  useWordsUIStore((state) => ({
    dialogOpen: state.dialogOpen,
    setDialogOpen: state.setDialogOpen,
    ...
  }));
```
Zustand selectors that return new objects cause re-renders even when values haven't changed.

#### Solution
```ts
import { useShallow } from "zustand/react/shallow";

export const useWordsDialogs = () =>
  useWordsUIStore(useShallow((state) => ({
    dialogOpen: state.dialogOpen,
    setDialogOpen: state.setDialogOpen,
    ...
  })));
```

#### Acceptance Criteria
- [ ] All object-returning selectors use `useShallow`
- [ ] No unnecessary re-renders from store selectors

---

## 🟢 LOW

### ISSUE #10: Vite Build Not Optimized for Chunk Grouping

**Severity:** 🟢 LOW  
**File:** `vite.config.ts`  
**Status:** ⏳ Not Started

#### Problem
No `manualChunks` configuration. Vite splits by dynamic import (pages), but heavy vendor libs like Radix UI, recharts, react-hook-form end up scattered across chunks.

#### Solution
```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "vendor-radix": ["@radix-ui/react-dialog", "@radix-ui/react-select", ...],
        "vendor-charts": ["recharts"],
        "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
        "vendor-editor": ["@uiw/react-md-editor"], // if used
      }
    }
  },
  chunkSizeWarningLimit: 800,
}
```

#### Acceptance Criteria
- [ ] `manualChunks` configured for heavy vendors
- [ ] No chunk over 800KB uncompressed
- [ ] Build analysis tooling added (`rollup-plugin-visualizer`)

---

### ISSUE #11: `useWords` Initial Load Logic is Overly Complex

**Severity:** 🟢 LOW  
**File:** `src/shared/hooks/useWords.ts` lines 79–81, 170–194  
**Status:** ⏳ Not Started

#### Problem
Two refs (`hasInitialLoad`, `initialFiltersSet`) plus a 50ms `setTimeout` to coordinate between `useFilterUrlSync` and `fetchWords`. This is fragile — the timing assumption can break.

```ts
// 50ms timeout is a race condition waiting to happen
const timeoutId = setTimeout(() => {
  hasInitialLoad.current = true;
  fetchWords(controller.signal);
}, 50);
```

#### Solution
`useFilterUrlSync` should signal when it has finished syncing. A callback or a `ready` flag returned by the hook would remove the need for timing hacks.

#### Acceptance Criteria
- [ ] No `setTimeout` in `useWords` for initial load
- [ ] `useFilterUrlSync` exposes a `ready` state (already does — `isReady`)
- [ ] `useWords` uses `isReady` from the parent page, not internal timing

---

### ISSUE #12: Package Versions Not Pinned

**Severity:** 🟢 LOW  
**File:** `package.json`  
**Status:** ⏳ Not Started

#### Problem
```json
"zustand": "latest",
"immer": "latest",
"recharts": "latest"
```
Using `latest` for production dependencies means any `npm install` on a new machine can pull in a breaking version.

#### Solution
Run `npm install` once on the canonical version, then pin using exact semver in `package.json`. Use `package-lock.json` (already present) but `latest` bypasses it on fresh installs in some CI configs.

#### Acceptance Criteria
- [ ] All dependencies pinned to exact or caret version
- [ ] No `"latest"` in `package.json`

---

## Implementation Priority

### Phase 1 — Security & Stability
- [ ] ISSUE #1 — Token refresh duplication
- [ ] ISSUE #2 — Token read from localStorage
- [ ] ISSUE #4 — Unified HTTP client

### Phase 2 — Architecture
- [ ] ISSUE #3 — PronunciationGuidePage split
- [ ] ISSUE #5 — UI store factory
- [ ] ISSUE #6 — Hook pattern consistency + useExams

### Phase 3 — Code Quality
- [ ] ISSUE #7 — Dialog mount tracking
- [ ] ISSUE #8 — ProtectedRoute token validation
- [ ] ISSUE #9 — Selector memoization with useShallow

### Phase 4 — Polish
- [ ] ISSUE #10 — Vite chunk config
- [ ] ISSUE #11 — useWords initial load simplification
- [ ] ISSUE #12 — Pin package versions

---

## What's Already Good (Don't Touch)

- Route-level lazy loading (`src/routes/lazyRoutes.ts`) — solid
- `HttpClient` abstract class — well designed, keep as the standard
- `ErrorBoundary` — correct implementation
- `PageLoader` component — consistent loading/error states
- `isAbortError` + AbortController in hooks — proper cleanup
- Optimistic updates in words/expressions/lectures/users hooks
- Zustand store per feature — good separation
- TypeScript strict mode + path aliases
- `DEVELOPMENT.md` — good onboarding doc

---

**Created:** April 5, 2026  
**Last Updated:** April 5, 2026
