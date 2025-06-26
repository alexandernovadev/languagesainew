# Lazy Loading en Rutas

## Descripción

Se ha implementado lazy loading en todas las rutas de la aplicación para mejorar el rendimiento y reducir el tiempo de carga inicial.

## Implementación

### 1. Configuración de Rutas Lazy

Las rutas lazy se configuran en `src/routes/lazyRoutes.ts`:

```typescript
import { lazy } from "react";

export const DashboardPage = lazy(() => import("../pages/DashboardPage"));
export const LecturesPage = lazy(() => import("../pages/lectures/LecturesPage"));
// ... más rutas
```

### 2. Componente de Carga

Se creó un componente `LoadingSpinner` reutilizable en `src/components/LoadingSpinner.tsx`:

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

### 3. Error Boundary Específico

Se implementó `LazyRouteErrorBoundary` para manejar errores específicos de carga de rutas:

```typescript
export class LazyRouteErrorBoundary extends Component<Props, State> {
  // Manejo de errores específicos para rutas lazy
}
```

### 4. Preloading Inteligente

Se implementó un sistema de preloading en `RoutePreloader` que carga las rutas más importantes después de 2 segundos en la página principal.

## Beneficios

### Rendimiento
- **Carga inicial más rápida**: Solo se cargan los componentes necesarios al inicio
- **Mejor experiencia de usuario**: Las rutas se cargan bajo demanda
- **Reducción del bundle inicial**: Menor tamaño del JavaScript inicial

### Mantenibilidad
- **Código organizado**: Las rutas lazy están centralizadas en un archivo
- **Fácil gestión**: Agregar nuevas rutas es simple
- **Error handling robusto**: Manejo específico de errores de carga

### UX Mejorada
- **Indicadores de carga**: Spinner elegante durante la carga
- **Preloading inteligente**: Las rutas importantes se precargan
- **Manejo de errores**: Mensajes claros cuando algo falla

## Estructura de Archivos

```
src/
├── routes/
│   ├── lazyRoutes.ts    # Configuración de rutas lazy
│   └── index.ts         # Re-exportaciones
├── components/
│   ├── LoadingSpinner.tsx           # Componente de carga
│   ├── LazyRouteErrorBoundary.tsx   # Error boundary específico
│   └── RoutePreloader.tsx           # Preloading inteligente
├── hooks/
│   └── useLazyRoute.ts              # Hook personalizado para lazy loading
└── App.tsx                          # Configuración principal
```

## Uso

### Agregar una Nueva Ruta Lazy

1. Agregar la importación en `src/routes/lazyRoutes.ts`:
```typescript
export const NewPage = lazy(() => import("../pages/NewPage"));
```

2. Importar y usar en `src/App.tsx`:
```typescript
import { NewPage } from "./routes";

<Route path="/new-page" element={<NewPage />} />
```

### Personalizar el Loading Spinner

```typescript
<LoadingSpinner size="lg" className="custom-class" />
```

### Configurar Preloading

Modificar `src/components/RoutePreloader.tsx` para agregar rutas al preloading:

```typescript
const importantRoutes = [
  () => LecturesPage,
  () => ExamsPage,
  () => NewPage, // Agregar nueva ruta
];
```

## Consideraciones

### Performance
- Las rutas se cargan solo cuando son necesarias
- El preloading se ejecuta después de un delay para no afectar la carga inicial
- Los errores de carga se manejan gracefully

### SEO
- El lazy loading no afecta el SEO ya que el contenido se renderiza normalmente
- Los motores de búsqueda pueden indexar todo el contenido

### Accesibilidad
- Los indicadores de carga son accesibles
- Los mensajes de error son claros y útiles
- Se mantiene la navegación por teclado

## Monitoreo

Para monitorear el rendimiento del lazy loading:

1. **Chrome DevTools**: Network tab para ver las cargas de chunks
2. **React DevTools**: Profiler para analizar el rendimiento
3. **Console**: Logs de errores de carga en `LazyRouteErrorBoundary`

## Futuras Mejoras

- [ ] Implementar retry automático en caso de fallo de carga
- [ ] Agregar métricas de rendimiento de carga
- [ ] Implementar prefetching basado en hover
- [ ] Optimizar el tamaño de los chunks 