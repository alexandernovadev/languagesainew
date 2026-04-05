```markdown
# Frontend Architecture & Organization Issues

**Project:** LanguagesAI Frontend (Vite + React + TypeScript)  
**Version:** 6.0.1  
**Last Updated:** April 4, 2026

---

## 📊 Issue Summary

| Severity | Count | Category |
|----------|-------|----------|
| 🔴 CRITICAL | 1 | Architecture |
| 🟠 SERIOUS | 1 | Component Size |
| 🟡 MODERATE | 4 | Performance, Error Handling, UX |
| 🟢 LOW | 2 | Documentation, Config |

**Total Issues: 8 remaining**

---

## 🔴 CRITICAL ISSUES

### ISSUE #2: Monolithic Page Architecture [CRITICAL]

**Severity:** 🔴 **CRITICAL**  
**Component:** Pages folder  
**Files Affected:** 23 pages  
**Status:** ⏳ Not Started

#### Problem Description
Each page is a monolithic component containing:
- API calls (data fetching)
- State management (9-12 states per page)
- Component composition (100-300+ lines each)
- Event handlers mixed with rendering logic
- No separation of concerns

#### Example - ExpressionsPage.tsx
**Current structure:**
```
ExpressionsPage (all logic)
├── useExpressions() hook call
├── 9 useState declarations
├── Multiple handler functions (handleCreate, handleEdit, handleDelete, etc)
├── useEffect for API calls
├── Render 100+ lines of JSX
└── Inline error handling and loading states
```

**Should be:**
```
ExpressionsPage (container/orchestrator)
├── ExpressionsList (presentation)
├── ExpressionDialog (sub-component)
├── ExpressionFilters (sub-component)
├── ExpressionTable (sub-component)
└── Uses useExpressionUIStore for state
```

#### Impact
- ❌ Hard to understand single component
- ❌ Hard to test single component
- ❌ Difficult to reuse subcomponents
- ❌ High cognitive load for new developers
- ❌ Bundle size inflated (all loaded at once)

#### Solution
Break pages into smaller, composable components using Container/Presentational pattern:
- **Container**: Responsible for data, state, handlers
- **Presentational**: Pure UI components

#### Acceptance Criteria
- [ ] All pages broken into <150 line components
- [ ] Container/Presentational pattern implemented
- [ ] Each component has single responsibility
- [ ] Reusable components extracted to `shared/components`
- [ ] Props clearly documented with interfaces

---

## 🟠 SERIOUS ISSUES

### ISSUE #6: Large Components without Code Splitting [SERIOUS]

**Severity:** 🟠 **SERIOUS**  
**Component:** Pages & Components  
**Files:** Multiple pages  
**Status:** ⏳ Not Started

#### Problem Description
Pages import entire component trees at load time:
```typescript
// ExpressionsPage.tsx imports all of these
import { ExpressionTable } from "@/shared/components/tables/ExpressionTable";
import { ExpressionDialog } from "@/shared/components/dialogs/ExpressionDialog";
import { ExpressionFilters } from "@/shared/components/filters/ExpressionFilters";
// ... 10+ more imports

// If ExpressionDialog is 5KB and only 10% of users open it...
// We're loading 5KB unnecessarily for 90% of users
```

#### Impact
- ❌ Larger initial bundle (~300KB+ uncompressed)
- ❌ Slower page load
- ❌ Slower time-to-interactive (TTI)
- ❌ More memory usage

#### Solution
Implement lazy loading for heavy components:
```typescript
const ExpressionDialog = lazy(() => import('./ExpressionDialog'));

<Suspense fallback={<DialogSkeleton />}>
  <ExpressionDialog {...props} />
</Suspense>
```

#### Acceptance Criteria
- [ ] Identify components >10KB
- [ ] Implement lazy loading for these
- [ ] Bundle size reduced by 15-20%
- [ ] No performance regressions

---

## 🟡 MODERATE ISSUES

### ISSUE #9: Missing Error Boundary [MODERATE]

**Severity:** 🟡 **MODERATE**  
**Component:** Error Handling  
**File:** Entire app  
**Status:** ⏳ Not Started

#### Problem Description
No Error Boundary component exists. If any component throws:
- Entire app crashes to white screen
- User sees nothing (no fallback UI)
- No error logged (except browser console)

#### Solution
```typescript
// src/shared/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary', { error, errorInfo });
  }
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}
```

#### Acceptance Criteria
- [ ] ErrorBoundary component created
- [ ] User-friendly fallback UI shown
- [ ] Error recovery mechanism (retry button)

---

### ISSUE #10: Inconsistent Loading States [MODERATE]

**Severity:** 🟡 **MODERATE**  
**Component:** UI/UX  
**Files:** 23 pages  
**Status:** ⏳ Not Started

#### Problem Description
Each page handles loading/error states differently with duplicate code and inconsistent UX.

#### Solution
```typescript
// src/shared/components/PageLoader.tsx
<PageLoader isLoading={loading} error={error}>
  <div>{/* page content */}</div>
</PageLoader>
```

#### Acceptance Criteria
- [ ] PageLoader component created
- [ ] All pages use consistent loading UI
- [ ] Error states handled consistently
- [ ] Skeleton components standardized

---

### ISSUE #11: No Request Cancellation [MODERATE]

**Severity:** 🟡 **MODERATE**  
**Component:** Services  
**Files:** All services  
**Status:** ⏳ Not Started

#### Problem Description
HTTP requests are never cancelled when components unmount → memory leaks and race conditions.

#### Solution
```typescript
useEffect(() => {
  const controller = new AbortController();
  expressionService.getAll({ signal: controller.signal }).then(setExpressions);
  return () => controller.abort();
}, []);
```

#### Acceptance Criteria
- [ ] AbortController integrated in HttpClient
- [ ] All requests support cancellation
- [ ] useEffect cleanup properly cancels requests

---

### ISSUE #12: Missing Optimistic Updates [MODERATE]

**Severity:** 🟡 **MODERATE**  
**Component:** UX  
**Files:** Pages with forms  
**Status:** ⏳ Not Started

#### Problem Description
Operations show loading states instead of updating UI immediately, making the app feel slow on any network delay.

#### Solution
Update UI optimistically before the request resolves, rollback on error.

#### Acceptance Criteria
- [ ] Optimistic updates for CRUD operations
- [ ] Rollback on error works smoothly

---

## 🟢 LOW ISSUES

### ISSUE #13: Missing Development Documentation [LOW]

**Severity:** 🟢 **LOW**  
**Status:** ⏳ Not Started

#### Acceptance Criteria
- [ ] DEVELOPMENT.md created with architecture overview
- [ ] Guide: how to add a new page/service
- [ ] TypeScript best practices documented

---

### ISSUE #14: No Environment Configuration [LOW]

**Severity:** 🟢 **LOW**  
**Status:** ⏳ Not Started

#### Acceptance Criteria
- [ ] `.env.example` created and documented
- [ ] Environment variables validated at startup

---

## 📋 Implementation Priority

### Phase 1 (Next) - CRITICAL
- [ ] Break down monolithic pages (ISSUE #2)
- [ ] Implement Error Boundary (ISSUE #9)

### Phase 2 - SHOULD-FIX
- [ ] Code splitting for large components (ISSUE #6)
- [ ] Consistent loading states (ISSUE #10)
- [ ] Request cancellation (ISSUE #11)
- [ ] Optimistic updates (ISSUE #12)

### Phase 3 - OPTIONAL
- [ ] Development guide (ISSUE #13)
- [ ] Environment setup (ISSUE #14)

---

## ✅ COMPLETED

- **ISSUE #1** — Domain Zustand stores created (expressions, words, aiConfig, user)
- **ISSUE #4** — HttpClient base class created, all services refactored to extend it
- **ISSUE #5** — Type system consolidated in `src/types/api/` (requests/responses/errors)
- **ISSUE #7** — React.StrictMode re-enabled in main.tsx

---

**Created:** April 4, 2026  
**Last Updated:** April 4, 2026
```
