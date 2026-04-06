# Dead Code Analysis — frontailanguages

> Generated: 2026-04-05. Each item is verified via grep — no false positives.

---

## 1. Hooks sin ningún importador (eliminar)

| Archivo | Notas |
|---------|-------|
| `src/shared/hooks/useAnimatedDots.ts` | Nunca importado |
| `src/shared/hooks/useLazyRoute.ts` | Nunca importado |
| `src/shared/hooks/useTextSelection.ts` | Nunca importado |
| `src/shared/hooks/useTopicGenerator.ts` | Nunca importado (arreglamos su TS error pero nadie lo usa) |

---

## 2. Componentes UI sin ningún importador (eliminar)

Todos en `src/shared/components/ui/`:

| Archivo |
|---------|
| `FileInputButton.tsx` |
| `LanguageSelect.tsx` |
| `LecturePagination.tsx` |
| `accordion.tsx` |
| `carousel.tsx` |
| `command.tsx` |
| `context-menu.tsx` |
| `drawer.tsx` |
| `grammar-topic-list.tsx` |
| `hover-card.tsx` |
| `input-otp.tsx` |
| `menubar.tsx` |
| `navigation-menu.tsx` |
| `resizable.tsx` |
| `toggle-group.tsx` |

---

## 3. Utilidades sin ningún consumidor (eliminar)

| Archivo | Símbolo |
|---------|---------|
| `src/utils/languageHelpers.ts` | Archivo entero — `getLanguageFlag()` duplica lo que ya tiene `src/utils/common/language.ts` |
| `src/utils/common/time/calculateReadingTime.ts` | `calculateReadingTime()` — exportado en barrel pero nadie lo importa |
| `src/utils/common/time/timeAgo.ts` | `timeAgo()` — exportado en barrel pero nadie lo importa |

---

## 4. Código duplicado (consolidar)

### `getAuthHeaders()`
Definida localmente y de forma idéntica en dos hooks:
- `src/shared/hooks/useLectureGenerator.ts` (líneas 9–23)
- `src/shared/hooks/useTopicGenerator.ts` (líneas 4–10)

Opciones: extraer a `src/utils/common/auth.ts` o, si `useTopicGenerator` también se borra (punto 1), queda solo en `useLectureGenerator`.

---

## 5. Imports sin usar

| Archivo | Import |
|---------|--------|
| `src/App.tsx` | `import React from "react"` — React no se usa en el archivo |

---

## Resumen

| Categoría | Cantidad |
|-----------|----------|
| Hooks a borrar | 4 |
| Componentes UI a borrar | 15 |
| Archivos de utilidad a borrar | 1 + 2 funciones |
| Duplicados a consolidar | 1 (`getAuthHeaders`) |
| Imports sobrantes | 1 |

**Total de archivos candidatos a eliminar: ~20**

---

## Notas

- `alert-dialog.tsx` sigue usándose en `AddExpressionQuickDialog` y `AddWordQuickDialog` — no borrar.
- Los archivos en `src/types/business/` con una sola línea son intencionales (arquitectura).
- `src/lib/store/users-store.ts` de 4 líneas es correcto (factory pattern).
