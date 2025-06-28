# 📚 Generador de Exámenes con IA

## 🎯 Descripción

El Generador de Exámenes es una funcionalidad avanzada que permite crear exámenes personalizados de inglés utilizando inteligencia artificial. Los exámenes se generan automáticamente basándose en parámetros específicos como nivel CEFR, tema, dificultad y tipos de preguntas.

## 🚀 Características Principales

### ✨ Generación Inteligente
- **IA Avanzada**: Utiliza modelos de lenguaje avanzados para generar preguntas contextuales
- **Personalización**: Configuración completa de parámetros del examen
- **Múltiples Tipos**: Soporte para 5 tipos diferentes de preguntas
- **Explicaciones Detalladas**: Cada pregunta incluye explicaciones con formato HTML colorido

### 📊 Tipos de Preguntas Soportados

1. **Opción Múltiple** - Preguntas con múltiples opciones de respuesta
2. **Completar Espacios** - Ejercicios de completar espacios en blanco
3. **Verdadero/Falso** - Preguntas de verdadero o falso
4. **Traducción** - Ejercicios de traducción
5. **Escritura** - Prompts de escritura libre

### 🎓 Niveles CEFR Soportados

- **A1** - Principiante
- **A2** - Elemental  
- **B1** - Intermedio
- **B2** - Intermedio Alto
- **C1** - Avanzado
- **C2** - Maestría

## 🛠️ Arquitectura Técnica

### Componentes Principales

```
src/
├── components/exam/
│   ├── ExamConfigForm.tsx      # Formulario de configuración
│   ├── ExamGenerationProgress.tsx  # Indicador de progreso
│   ├── ExamSummary.tsx         # Resumen del examen
│   ├── ExamQuestionDisplay.tsx # Visualización de preguntas
│   ├── SuggestedTopics.tsx     # Temas sugeridos
│   ├── ExamStats.tsx           # Estadísticas del examen
│   └── index.ts               # Exportaciones
├── hooks/
│   └── useExamGenerator.ts    # Hook personalizado
├── services/
│   └── examService.ts         # Servicio de API
└── pages/generator/exam/
    └── ExamGeneratorPage.tsx  # Página principal
```

### Flujo de Datos

1. **Configuración**: Usuario configura parámetros del examen
2. **Generación**: Se envía request al endpoint `/api/ai/generate-exam`
3. **Procesamiento**: IA genera preguntas con explicaciones
4. **Visualización**: Se muestran las preguntas con formato rico
5. **Acciones**: Usuario puede descargar, regenerar o revisar

## 📋 Parámetros de Configuración

### Obligatorios
- **topic**: Tema principal del examen (string, 1-200 caracteres)

### Opcionales
- **level**: Nivel CEFR (A1-C2, default: B1)
- **numberOfQuestions**: Número de preguntas (1-50, default: 10)
- **types**: Tipos de preguntas (array, default: multiple_choice, fill_blank, true_false)
- **difficulty**: Dificultad (1-5, default: 3)
- **userLang**: Idioma explicaciones (ISO 639-1, default: es)

## 🎨 Interfaz de Usuario

### Pestañas Principales

1. **Configuración**: Formulario completo de configuración
2. **Progreso**: Indicador de generación y resumen
3. **Preguntas**: Visualización detallada de todas las preguntas

### Características de UX

- **Temas Sugeridos**: Selección rápida de temas populares
- **Validación en Tiempo Real**: Validación de formularios
- **Indicadores de Progreso**: Feedback visual durante generación
- **Estadísticas Detalladas**: Análisis completo del examen generado
- **Formato Rico**: Explicaciones con HTML colorido y emojis

## 🔧 API Integration

### Endpoint
```
POST /api/ai/generate-exam
```

### Request Body
```json
{
  "topic": "gramática básica",
  "level": "B1",
  "numberOfQuestions": 15,
  "types": ["multiple_choice", "fill_blank", "true_false"],
  "difficulty": 3,
  "userLang": "es"
}
```

### Response Format
```json
{
  "questions": [
    {
      "text": "What is the correct form of the verb 'to be' for 'I'?",
      "type": "multiple_choice",
      "options": [
        { "value": "A", "label": "am", "isCorrect": true },
        { "value": "B", "label": "is", "isCorrect": false },
        { "value": "C", "label": "are", "isCorrect": false }
      ],
      "correctAnswers": ["A"],
      "explanation": "The correct form of 'to be' for first person singular is 'am'.",
      "tags": ["grammar", "present_tense"]
    }
  ]
}
```

## 🎯 Casos de Uso

### 1. Profesores
- Crear exámenes personalizados para sus clases
- Generar material de práctica específico
- Adaptar contenido al nivel de los estudiantes

### 2. Estudiantes
- Practicar temas específicos
- Prepararse para exámenes oficiales
- Mejorar habilidades particulares

### 3. Instituciones Educativas
- Generar bancos de preguntas
- Crear material de evaluación estandarizado
- Mantener consistencia en evaluaciones

## 🔮 Funcionalidades Futuras

### Planificadas
- [ ] Exportación a PDF
- [ ] Guardado de exámenes favoritos
- [ ] Compartir exámenes
- [ ] Modo de práctica interactiva
- [ ] Análisis de resultados
- [ ] Integración con LMS

### Mejoras Técnicas
- [ ] Caché de exámenes generados
- [ ] Generación en lote
- [ ] API de webhooks
- [ ] Métricas de uso

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de Generación**
   - Verificar conexión a internet
   - Revisar parámetros de configuración
   - Contactar soporte técnico

2. **Preguntas Repetitivas**
   - Cambiar el tema para mayor variedad
   - Ajustar el nivel de dificultad
   - Modificar tipos de preguntas

3. **Tiempo de Respuesta Lento**
   - Reducir número de preguntas
   - Simplificar el tema
   - Verificar carga del servidor
