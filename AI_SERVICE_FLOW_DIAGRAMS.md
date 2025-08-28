# 🔄 Diagramas de Flujo - AI Service LanguageAI

## 📋 Resumen Ejecutivo

El sistema LanguageAI utiliza múltiples servicios de IA para generar contenido educativo, incluyendo:
- **Generación de palabras y expresiones** con definiciones, ejemplos y traducciones
- **Chat interactivo** para aprendizaje de idiomas
- **Generación de exámenes** personalizados por nivel CEFR
- **Generación de imágenes** para contenido visual
- **Generación de audio** para pronunciación
- **Traducción en tiempo real**

---

## 🏗️ Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        UI[Interfaz de Usuario]
        Chat[Componentes de Chat]
        Forms[Formularios de Generación]
        Admin[Panel de Administración]
    end
    
    subgraph "Backend (Node.js + Express)"
        Routes[Rutas API]
        Controllers[Controladores]
        Services[Servicios de IA]
        Middleware[Middleware de Auth]
    end
    
    subgraph "Servicios de IA"
        OpenAI[OpenAI API]
        DALL-E[Generación de Imágenes]
        TTS[Text-to-Speech]
    end
    
    subgraph "Base de Datos"
        MongoDB[(MongoDB)]
        Words[(Colección Words)]
        Expressions[(Colección Expressions)]
        Exams[(Colección Exams)]
        Users[(Colección Users)]
    end
    
    subgraph "Almacenamiento"
        Cloudinary[Cloudinary]
        Audio[Archivos de Audio]
        Images[Imágenes Generadas]
    end
    
    UI --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> OpenAI
    Services --> DALL-E
    Services --> TTS
    Controllers --> MongoDB
    Services --> Cloudinary
```

---

## 🔄 Flujo Principal de Generación de Contenido

### 1. Generación de Palabras (Words)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI
    participant DB as MongoDB
    participant C as Cloudinary
    
    U->>F: Ingresa palabra nueva
    F->>B: POST /api/generate/generate-wordJson
    B->>AI: Genera definición, ejemplos, tipo
    AI-->>B: JSON con datos de la palabra
    B->>DB: Guarda palabra en MongoDB
    B->>C: Genera y sube imagen (opcional)
    B-->>F: Respuesta con palabra creada
    F-->>U: Muestra palabra generada
```

### 2. Generación de Expresiones

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI
    participant DB as MongoDB
    
    U->>F: Ingresa expresión nueva
    F->>B: POST /api/generate/generate-wordJson
    B->>AI: Genera definición, ejemplos, contexto
    Note over AI: Incluye traducción al español
    AI-->>B: JSON con datos de la expresión
    B->>DB: Guarda expresión en MongoDB
    B-->>F: Respuesta con expresión creada
    F-->>U: Muestra expresión generada
```

---

## 💬 Flujo del Sistema de Chat

### 3. Chat con Palabras/Expresiones

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI
    participant DB as MongoDB
    
    U->>F: Escribe mensaje en chat
    F->>B: POST /api/generate/generate-text (stream)
    B->>DB: Obtiene historial del chat
    B->>AI: Genera respuesta contextualizada
    Note over AI: Incluye historial y contexto
    AI-->>B: Stream de respuesta
    B-->>F: Stream de respuesta
    F-->>U: Muestra respuesta en tiempo real
    B->>DB: Guarda mensaje en historial
```

---

## 📝 Flujo de Generación de Exámenes

### 4. Generación de Exámenes Personalizados

```mermaid
flowchart TD
    A[Usuario selecciona opciones] --> B{Validar parámetros}
    B -->|Válidos| C[Generar prompt del sistema]
    B -->|Inválidos| D[Error de validación]
    
    C --> E[Crear prompt con nivel CEFR]
    E --> F[Incluir tópicos de gramática]
    F --> G[Configurar tipos de preguntas]
    G --> H[Llamar a OpenAI GPT-4o-mini]
    
    H --> I{Respuesta válida?}
    I -->|Sí| J[Parsear JSON de preguntas]
    I -->|No| K[Reintentar o error]
    
    J --> L[Validar estructura de preguntas]
    L --> M{Validación exitosa?}
    M -->|Sí| N[Guardar examen en DB]
    M -->|No| O[Error de validación]
    
    N --> P[Retornar examen generado]
    
    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style D fill:#ffcdd2
    style O fill:#ffcdd2
```

### 5. Detalles del Prompt de Examen

```mermaid
graph LR
    subgraph "Prompt del Sistema"
        A[Contexto del nivel CEFR]
        B[Tipos de preguntas permitidas]
        C[Tópicos de gramática]
        D[Restricciones de formato]
        E[Instrucciones de validación]
    end
    
    subgraph "Validaciones"
        F[Unicidad de respuestas]
        G[Formato JSON correcto]
        H[Número exacto de preguntas]
        I[Distribución de tipos]
    end
    
    subgraph "Salida"
        J[Título del examen]
        K[Slug URL-friendly]
        L[Array de preguntas]
        M[Explicaciones HTML]
    end
```

---

## 🖼️ Flujo de Generación de Imágenes

### 6. Generación y Almacenamiento de Imágenes

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as DALL-E
    participant C as Cloudinary
    participant DB as MongoDB
    
    U->>F: Solicita generar imagen
    F->>B: POST /api/generate/generate-image-*
    B->>AI: Genera imagen con prompt
    AI-->>B: Imagen en base64
    B->>C: Sube imagen a Cloudinary
    C-->>B: URL de la imagen
    B->>DB: Actualiza entidad con nueva imagen
    B-->>F: Respuesta con URL actualizada
    F-->>U: Muestra nueva imagen
```

---

## 🔊 Flujo de Generación de Audio

### 7. Text-to-Speech

```mermaid
flowchart TD
    A[Usuario ingresa texto] --> B[Validar texto]
    B --> C[Seleccionar voz]
    C --> D[Generar audio con OpenAI TTS]
    D --> E[Convertir a formato compatible]
    E --> F[Almacenar en servidor]
    F --> G[Retornar URL del audio]
    
    style A fill:#e1f5fe
    style G fill:#c8e6c9
```

---

## 🔄 Flujo de Traducción

### 8. Traducción en Tiempo Real

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI
    participant DB as MongoDB
    
    U->>F: Escribe texto para traducir
    F->>B: POST /api/generate/translate (stream)
    B->>AI: Traduce texto con contexto
    AI-->>B: Stream de traducción
    B-->>F: Stream de traducción
    F-->>U: Muestra traducción en tiempo real
    B->>DB: Opcional: guardar en historial
```

---

## 🗄️ Estructura de Base de Datos

### 9. Modelos de Datos

```mermaid
erDiagram
    USER {
        string _id
        string email
        string password
        string role
        date createdAt
        date updatedAt
    }
    
    WORD {
        string _id
        string word
        string definition
        array examples
        array type
        string IPA
        number seen
        string img
        string level
        array sinonyms
        array codeSwitching
        string language
        object spanish
        array chat
        date lastReviewed
        date nextReview
        number reviewCount
        number difficulty
        number interval
        number easeFactor
    }
    
    EXPRESSION {
        string _id
        string expression
        string definition
        array examples
        array type
        string context
        string difficulty
        string img
        string language
        object spanish
        array chat
    }
    
    EXAM {
        string _id
        string title
        string examSlug
        array questions
        string level
        string topic
        array grammarTopics
        number difficulty
        string userLang
        date createdAt
    }
    
    QUESTION {
        string _id
        string text
        string type
        array options
        array correctAnswers
        array tags
        string explanation
        string examId
    }
    
    USER ||--o{ EXAM : creates
    EXAM ||--o{ QUESTION : contains
    USER ||--o{ WORD : studies
    USER ||--o{ EXPRESSION : studies
```

---

## 🔐 Flujo de Autenticación y Autorización

### 10. Middleware de Seguridad

```mermaid
flowchart TD
    A[Request HTTP] --> B{¿Tiene token?}
    B -->|No| C[401 Unauthorized]
    B -->|Sí| D[Validar token JWT]
    D --> E{¿Token válido?}
    E -->|No| F[401 Unauthorized]
    E -->|Sí| G{¿Usuario existe?}
    G -->|No| H[401 Unauthorized]
    G -->|Sí| I[Agregar user a req]
    I --> J[Continuar a controlador]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style C fill:#ffcdd2
    style F fill:#ffcdd2
    style H fill:#ffcdd2
```

---

## 📊 Flujo de Logging y Monitoreo

### 11. Sistema de Logging Estructurado

```mermaid
flowchart TD
    A[Operación inicia] --> B[Generar operationId]
    B --> C[Log inicio con contexto]
    C --> D[Validar input]
    D --> E{¿Validación exitosa?}
    E -->|No| F[Log warning + error]
    E -->|Sí| G[Ejecutar operación]
    G --> H{¿Operación exitosa?}
    H -->|No| I[Log error con stack]
    H -->|Sí| J[Log éxito con métricas]
    
    J --> K[Retornar respuesta]
    I --> L[Retornar error]
    F --> L
    
    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style L fill:#ffcdd2
```

---

## 🚀 Optimizaciones y Mejores Prácticas

### 12. Estrategias de Rendimiento

```mermaid
graph LR
    subgraph "Caching"
        A[Cache de palabras frecuentes]
        B[Cache de expresiones populares]
        C[Cache de exámenes por nivel]
    end
    
    subgraph "Rate Limiting"
        D[Límite por IP]
        E[Límite por usuario]
        F[Límite por endpoint]
    end
    
    subgraph "Streaming"
        G[Respuestas en tiempo real]
        H[Chat streaming]
        I[Generación progresiva]
    end
    
    subgraph "Validación"
        J[Validación de entrada]
        K[Validación de salida AI]
        L[Sanitización de datos]
    end
```

---

## 🔧 Configuración y Variables de Entorno

### 13. Configuración del Sistema

```mermaid
graph TD
    A[Variables de Entorno] --> B[OpenAI API Key]
    A --> C[Cloudinary Config]
    A --> D[MongoDB URI]
    A --> E[JWT Secret]
    A --> F[Rate Limit Config]
    
    B --> G[Servicios de IA]
    C --> H[Almacenamiento de imágenes]
    D --> I[Conexión a base de datos]
    E --> J[Autenticación JWT]
    F --> K[Límites de API]
```

---

## 📈 Métricas y Monitoreo

### 14. KPIs del Sistema

```mermaid
graph LR
    subgraph "Rendimiento"
        A[Latencia de respuesta]
        B[Throughput de requests]
        C[Tasa de éxito de IA]
    end
    
    subgraph "Calidad"
        D[Precisión de generación]
        E[Relevancia de contenido]
        F[Satisfacción del usuario]
    end
    
    subgraph "Uso"
        G[Usuarios activos]
        H[Contenido generado]
        I[Interacciones de chat]
    end
```

---

## 🎯 Puntos Clave del Sistema

1. **Arquitectura Modular**: Separación clara entre controladores, servicios y rutas
2. **Streaming en Tiempo Real**: Chat y generación de contenido con respuesta inmediata
3. **Validación Robusta**: Múltiples capas de validación para entrada y salida
4. **Logging Estructurado**: Sistema completo de monitoreo y debugging
5. **Manejo de Errores**: Gestión consistente de errores con códigos específicos
6. **Seguridad**: Autenticación JWT y validación de permisos
7. **Escalabilidad**: Diseño preparado para crecimiento y optimización
8. **Integración AI**: Múltiples servicios de OpenAI para diferentes funcionalidades

---

## 🔮 Futuras Mejoras

- **Cache Inteligente**: Implementar Redis para cache distribuido
- **Microservicios**: Separar servicios de IA en contenedores independientes
- **ML Pipeline**: Pipeline de machine learning para mejorar calidad de contenido
- **Analytics Avanzado**: Métricas detalladas de uso y aprendizaje
- **A/B Testing**: Sistema para probar diferentes prompts y configuraciones
- **Backup Automático**: Sistema de respaldo automático de contenido generado
