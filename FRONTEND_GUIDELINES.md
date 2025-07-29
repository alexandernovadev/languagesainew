# Frontend Guidelines - LanguageAI

## 🎨 Design System

### 1. Dark Theme Only
- **NO LIGHT THEME EXISTS** in this app
- Always use dark colors: `bg-background`, `text-foreground`, `border-border`
- Avoid light colors like `bg-white`, `text-black`

### 2. Component Variants Only
- **NEVER create custom classes** for badges or buttons
- **ALWAYS use variants** from Shadcn UI:
  ```tsx
  // ✅ CORRECT
  <Badge variant="secondary">Success</Badge>
  <Button variant="outline" size="sm">Click me</Button>
  
  // ❌ WRONG
  <Badge className="bg-green-500 text-white">Success</Badge>
  ```

### 3. Modal & Alert Components
- **ALWAYS use NOVA components**:
  ```tsx
  import { ModalNova } from "@/components/ui/modal-nova";
  <ModalNova open={isOpen} onOpenChange={setIsOpen} title="Title">
    Content
  </ModalNova>
  ```

## 🔧 Error Handling & API

### 4. Try-Catch Pattern
- **ALWAYS use global error handling**:
  ```tsx
  import { useResultHandler } from "@/hooks/useResultHandler";
  
  export function MyComponent() {
    const { handleApiResult } = useResultHandler();
    
    const handleAction = async () => {
      try {
        const result = await apiCall();
        toast.success("Success message", {
          action: { label: <Eye className="h-4 w-4" />, onClick: () => handleApiResult({ success: true, data: result }, "Context") },
          cancel: { label: <X className="h-4 w-4" />, onClick: () => toast.dismiss() }
        });
      } catch (error) {
        handleApiResult(error, "Context");
      }
    };
  }
  ```

### 5. API Services
- **ALWAYS use `/api` prefix** and **write in English**:
  ```tsx
  // ✅ CORRECT
  export const userService = {
    getUsers: () => api.get('/users'),
    createUser: (data: UserData) => api.post('/users', data),
    updateUser: (id: string, data: UserData) => api.put(`/users/${id}`, data)
  };
  ```

## 📁 Code Organization

### 6. DRY Principle & Structure
- **ALWAYS separate concerns** and **AVOID long files**
- **Organize imports properly**:
  ```tsx
  // React & Hooks
  import { useState, useEffect } from "react";
  
  // UI Components
  import { Button } from "@/components/ui/button";
  
  // Icons
  import { Eye, X } from "lucide-react";
  
  // Services & Utils
  import { useResultHandler } from "@/hooks/useResultHandler";
  ```

### 7. Component Structure
```tsx
export function MyComponent() {
  // 1. Hooks
  const { handleApiResult } = useResultHandler();
  const [loading, setLoading] = useState(false);
  
  // 2. Event handlers
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await apiCall();
      toast.success("Success", {
        action: { label: <Eye className="h-4 w-4" />, onClick: () => handleApiResult({ success: true, data: result }, "Context") },
        cancel: { label: <X className="h-4 w-4" />, onClick: () => toast.dismiss() }
      });
    } catch (error) {
      handleApiResult(error, "Context");
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Render
  return <Button onClick={handleSubmit} disabled={loading}>Submit</Button>;
}
```

## 📋 Checklist for New Components

- [ ] Dark theme only (no light colors)
- [ ] Use component variants (no custom classes)
- [ ] Use NOVA modals/alerts
- [ ] Implement try-catch with handleApiResult
- [ ] Use `/api` prefix in services
- [ ] Write in English for API/services
- [ ] Organize code properly (DRY)
- [ ] Keep files focused and not too long
- [ ] Use proper import organization
- [ ] Implement success toast with Eye/X buttons

## 🔗 Related Files

- `src/contexts/ResultContext.tsx` - Global error/success modal
- `src/hooks/useResultHandler.ts` - Error handling hook
- `src/components/ui/modal-nova.tsx` - Modal component
- `src/services/api.ts` - API service base

---

**Remember:** Always read this file before making changes! 🚀 