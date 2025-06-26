# Exam Components - Refactorización

Este folder contiene todos los componentes relacionados con la generación y visualización de exámenes. La refactorización se ha realizado para mejorar la organización, eliminar código duplicado y aplicar principios DRY.

## Estructura del Folder

```
exam/
├── components/           # Sub-componentes reutilizables
│   ├── ExamFormField.tsx
│   └── QuestionTypeStats.tsx
├── constants/           # Constantes centralizadas
│   └── examConstants.ts
├── helpers/            # Utilidades y funciones helper
│   └── examUtils.ts
├── types/              # Tipos TypeScript centralizados
│   └── examTypes.ts
├── ExamConfigForm.tsx  # Formulario de configuración
├── ExamGenerationProgress.tsx
├── ExamOptionCard.tsx
├── ExamQuestionDisplay.tsx
├── ExamStats.tsx
├── ExamSummary.tsx
├── SuggestedTopics.tsx
├── index.ts           # Exportaciones centralizadas
└── README.md
```

## Componentes Principales

### ExamConfigForm
Formulario principal para configurar la generación de exámenes. Utiliza el componente `ExamFormField` para campos reutilizables.

### ExamQuestionDisplay
Muestra una pregunta individual con sus opciones y explicación.

### ExamSummary
Resumen completo del examen generado con estadísticas.

### ExamStats
Tarjetas de estadísticas del examen (total preguntas, tiempo estimado, etc.).

### ExamGenerationProgress
Indicador de progreso durante la generación del examen.

### SuggestedTopics
Panel lateral con temas sugeridos para el examen.

## Sub-componentes

### ExamFormField
Componente reutilizable para campos de formulario que soporta:
- Texto y textarea
- Números
- Select
- Slider
- Checkbox groups

### QuestionTypeStats
Componente para mostrar estadísticas de tipos de preguntas con gráficos.

## Helpers (examUtils.ts)

Funciones utilitarias centralizadas:

- **Question Type Helpers**: `getQuestionTypeLabel`, `getQuestionTypeColor`
- **Level Helpers**: `getLevelLabel`, `getLevelDescription`
- **Difficulty Helpers**: `getDifficultyLabel`, `getDifficultyDescription`
- **Language Helpers**: `getLanguageLabel`
- **Statistics Helpers**: `calculateQuestionTypeStats`, `calculateTagStats`
- **Validation Helpers**: `validateExamFilters`
- **Progress Helpers**: `getProgressMessage`, `getProgressColor`

## Constantes (examConstants.ts)

Datos estáticos centralizados:

- `LANGUAGE_OPTIONS`: Opciones de idioma
- `TOPIC_CATEGORIES`: Categorías de temas sugeridos
- `EXAM_GENERATION_TIPS`: Consejos para generar exámenes
- `QUESTION_TYPE_CHART_COLORS`: Colores para gráficos
- `DEFAULT_EXAM_CONFIG`: Configuración por defecto
- `EXAM_VALIDATION_LIMITS`: Límites de validación

## Tipos (examTypes.ts)

Interfaces TypeScript centralizadas para todos los componentes y utilidades.

## Beneficios de la Refactorización

1. **DRY (Don't Repeat Yourself)**: Eliminación de código duplicado
2. **Separación de Responsabilidades**: Lógica de negocio separada de presentación
3. **Reutilización**: Componentes y helpers reutilizables
4. **Mantenibilidad**: Código más fácil de mantener y actualizar
5. **Consistencia**: Comportamiento uniforme en toda la aplicación
6. **Type Safety**: Tipos TypeScript centralizados

## Uso

```typescript
import { 
  ExamConfigForm, 
  ExamSummary, 
  getQuestionTypeLabel,
  LANGUAGE_OPTIONS 
} from '@/components/exam';
```

## Migración

Los componentes mantienen la misma API pública, por lo que la migración es transparente para el código existente. Solo se han reorganizado internamente para mejorar la estructura. 