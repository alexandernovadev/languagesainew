# AI Loading Animation

## Descripción
Animación de carga elegante para operaciones de AI que muestra un borde con gradiente animado alrededor de las secciones mientras se procesan datos.

## Características
- Borde con gradiente verde-azul que se mueve continuamente
- Animación suave de 4 segundos
- Indicador visual claro pero no intrusivo
- Compatible con todas las secciones de la aplicación

## Implementación

### 1. CSS (globals.css)
```css
/* Animación de gradiente para bordes */
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 4s ease infinite;
}
```

### 2. Componente React Reutilizable
```tsx
import { AILoadingContainer, useAILoading } from '@/components/common';

// Uso básico
<AILoadingContainer loading={isLoading}>
  <h3>Contenido de la sección</h3>
  <p>Este contenido se mostrará con borde animado cuando loading=true</p>
</AILoadingContainer>

// Con hook personalizado
const [loading, setLoading, withLoading] = useAILoading();

const handleGenerate = withLoading(async () => {
  await generateAIContent();
});
```

### 3. Variantes Disponibles
```tsx
// Sección (por defecto)
<AILoadingContainer loading={loading} variant="section">
  {/* Contenido */}
</AILoadingContainer>

// Tarjeta
<AILoadingContainer loading={loading} variant="card">
  {/* Contenido */}
</AILoadingContainer>

// Botón
<AILoadingContainer loading={loading} variant="button">
  {/* Contenido */}
</AILoadingContainer>
```

## Uso

### Ejemplo Básico
```tsx
<SectionContainer loading={isLoading}>
  <h3>Contenido de la sección</h3>
  <p>Este contenido se mostrará con borde animado cuando loading=true</p>
</SectionContainer>
```

### Ejemplo con AI Operations
```tsx
// En WordDetailsCard.tsx
<SectionContainer loading={actionLoading.updateImage}>
  <SectionHeader
    title="Imagen"
    icon="🖼️"
    onRefresh={handleRefreshImage}
    loading={actionLoading.updateImage}
  />
  <div className="relative flex justify-center">
    {/* Contenido de la imagen */}
  </div>
</SectionContainer>
```

## Casos de Uso

### 1. Generación de Contenido AI
- Actualización de imágenes
- Generación de ejemplos
- Creación de sinónimos
- Procesamiento de code-switching

### 2. Operaciones de Datos
- Importación de palabras
- Actualización de niveles
- Sincronización de datos

### 3. Operaciones de Usuario
- Generación de exámenes
- Creación de lecciones
- Procesamiento de estadísticas

## Personalización

### Cambiar Colores
```tsx
// Gradiente verde-azul (actual)
bg-gradient-to-r from-green-500 via-blue-500 to-green-500

// Gradiente púrpura-azul
bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500

// Gradiente naranja-rojo
bg-gradient-to-r from-orange-500 via-red-500 to-orange-500
```

### Cambiar Velocidad
```css
/* Más lento (6 segundos) */
.animate-gradient-x {
  animation: gradient-x 6s ease infinite;
}

/* Más rápido (2 segundos) */
.animate-gradient-x {
  animation: gradient-x 2s ease infinite;
}
```

### Cambiar Grosor del Borde
```tsx
// Borde más grueso
<div className="relative p-[3px] rounded-lg ...">

// Borde más delgado
<div className="relative p-[1px] rounded-lg ...">
```

## Estados de Loading

### Estados Disponibles
- `actionLoading.updateImage` - Actualización de imágenes
- `actionLoading.updateExamples` - Actualización de ejemplos
- `actionLoading.updateSynonyms` - Actualización de sinónimos
- `actionLoading.updateCodeSwitching` - Actualización de code-switching
- `actionLoading.updateTypes` - Actualización de tipos
- `actionLoading.updateLevel` - Actualización de nivel

### Ejemplo de Múltiples Estados
```tsx
<SectionContainer loading={actionLoading.updateImage || actionLoading.updateExamples}>
  <SectionHeader
    title="Contenido"
    onRefresh={handleRefresh}
    loading={actionLoading.updateImage || actionLoading.updateExamples}
  />
  {/* Contenido */}
</SectionContainer>
```

## Mejores Prácticas

### 1. Consistencia
- Usar siempre el mismo componente `SectionContainer`
- Mantener los mismos colores en toda la aplicación
- Aplicar la misma velocidad de animación

### 2. Feedback Visual
- Combinar con iconos de refresh
- Mostrar mensajes de estado cuando sea apropiado
- Usar toast notifications para confirmaciones

### 3. Accesibilidad
- La animación no debe ser demasiado rápida
- Proporcionar texto alternativo para lectores de pantalla
- Mantener contraste adecuado

## Troubleshooting

### La animación no se muestra
1. Verificar que `loading={true}`
2. Confirmar que el CSS está cargado
3. Revisar que no hay conflictos de z-index

### La animación es muy rápida/lenta
1. Ajustar la duración en `globals.css`
2. Verificar que no hay múltiples definiciones de la animación

### El gradiente no se ve bien
1. Verificar los colores del gradiente
2. Ajustar la opacidad del fondo
3. Confirmar que el contraste es adecuado

## Extensión para Otras Páginas

### Para Nuevas Páginas
1. Importar el componente `SectionContainer`
2. Usar el mismo patrón de loading states
3. Mantener la consistencia visual

### Para Componentes Existentes
1. Reemplazar contenedores simples con `SectionContainer`
2. Agregar estados de loading apropiados
3. Actualizar la UI para mostrar el estado de carga

## Ejemplo Completo
```tsx
import { SectionContainer } from '@/components/common/SectionContainer';

function MyAIPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      // Operación de AI
      await generateAIContent();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <SectionContainer loading={isGenerating}>
        <h3>Contenido Generado por AI</h3>
        <p>Este contenido se actualizará con la animación de carga</p>
      </SectionContainer>
    </div>
  );
}
``` 