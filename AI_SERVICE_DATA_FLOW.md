# 🔄 Flujo de Datos del AI Service - LanguageAI

## 📊 Flujo de Datos Principal

### 1. Flujo Completo de Generación de Contenido

```mermaid
flowchart TD
    subgraph "Frontend Layer"
        A[Usuario interactúa] --> B[Formulario de entrada]
        B --> C[Validación del cliente]
        C --> D[Request HTTP]
    end
    
    subgraph "API Gateway"
        D --> E[Middleware de Auth]
        E --> F[Rate Limiting]
        F --> G[Validación de entrada]
    end
    
    subgraph "Controller Layer"
        G --> H[Controller específico]
        H --> I[Logging de operación]
        I --> J[Validación de datos]
    end
    
    subgraph "Service Layer"
        J --> K[AI Service específico]
        K --> L[Construir prompt]
        L --> M[Llamar OpenAI API]
    end
    
    subgraph "AI Processing"
        M --> N[OpenAI procesa]
        N --> O[Validar respuesta]
        O --> P[Parsear JSON/Stream]
    end
    
    subgraph "Data Persistence"
        P --> Q[Validar estructura]
        Q --> R[Guardar en MongoDB]
        R --> S[Actualizar relaciones]
    end
    
    subgraph "Response"
        S --> T[Formatear respuesta]
        T --> U[Logging de éxito]
        U --> V[Retornar al cliente]
    end
    
    style A fill:#e1f5fe
    style V fill:#c8e6c9
```

---

## 🧠 Arquitectura de Prompts del AI Service

### 2. Estructura de Prompts del Sistema

```mermaid
graph TB
    subgraph "Prompt Templates"
        A[System Prompt Base]
        B[Context Specific]
        C[User Input]
        D[Constraints & Rules]
    end
    
    subgraph "Prompt Assembly"
        E[Template Engine]
        F[Variable Injection]
        G[Context Building]
        H[Validation Rules]
    end
    
    subgraph "AI Model Selection"
        I[GPT-4o-2024-08-06]
        J[GPT-4o-mini]
        K[DALL-E 3]
        L[Whisper TTS]
    end
    
    subgraph "Response Processing"
        M[JSON Parsing]
        N[Stream Processing]
        O[Error Handling]
        P[Validation]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    F --> G
    G --> H
    
    H --> I
    H --> J
    H --> K
    H --> L
    
    I --> M
    J --> M
    K --> N
    L --> P
    
    M --> O
    N --> O
    P --> O
```

---

## 🔄 Flujo de Streaming y Respuestas en Tiempo Real

### 3. Sistema de Streaming del Chat

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI
    participant DB as MongoDB
    
    U->>F: Escribe mensaje
    F->>B: POST /generate-text (stream)
    
    B->>DB: Obtener historial del chat
    DB-->>B: Historial de mensajes
    
    B->>B: Construir prompt con contexto
    B->>AI: Llamar OpenAI con stream=true
    
    loop Streaming de respuesta
        AI-->>B: Chunk de respuesta
        B-->>F: Chunk de respuesta
        F-->>U: Mostrar chunk en tiempo real
    end
    
    B->>DB: Guardar mensaje completo
    DB-->>B: Confirmación
    B-->>F: Finalizar stream
    F-->>U: Mensaje completo guardado
```

---

## 📝 Flujo de Generación de Exámenes Detallado

### 4. Pipeline de Generación de Exámenes

```mermaid
flowchart TD
    subgraph "Input Validation"
        A[Parámetros del usuario] --> B{Validar nivel CEFR}
        B -->|Válido| C{Validar tipos de preguntas}
        B -->|Inválido| D[Error: Nivel no soportado]
        
        C -->|Válido| E{Validar número de preguntas}
        C -->|Inválido| F[Error: Tipos no permitidos]
        
        E -->|Válido| G{Validar tópicos de gramática}
        E -->|Inválido| H[Error: Número inválido]
        
        G -->|Válido| I[Continuar generación]
        G -->|Inválido| J[Error: Tópicos inválidos]
    end
    
    subgraph "Prompt Generation"
        I --> K[Construir prompt del sistema]
        K --> L[Inyectar parámetros]
        L --> M[Agregar restricciones]
        M --> N[Configurar formato de salida]
    end
    
    subgraph "AI Generation"
        N --> O[Llamar OpenAI GPT-4o-mini]
        O --> P{¿Respuesta válida?}
        P -->|Sí| Q[Parsear JSON]
        P -->|No| R[Reintentar o fallar]
    end
    
    subgraph "Validation & Processing"
        Q --> S[Validar estructura JSON]
        S --> T{¿Estructura válida?}
        T -->|Sí| U[Validar preguntas individuales]
        T -->|No| V[Error: Estructura inválida]
        
        U --> W{¿Preguntas válidas?}
        W -->|Sí| X[Guardar en base de datos]
        W -->|No| Y[Error: Preguntas inválidas]
    end
    
    subgraph "Response"
        X --> Z[Retornar examen generado]
        D --> AA[Error response]
        F --> AA
        H --> AA
        J --> AA
        V --> AA
        Y --> AA
    end
    
    style A fill:#e1f5fe
    style Z fill:#c8e6c9
    style AA fill:#ffcdd2
```

---

## 🖼️ Flujo de Generación de Imágenes

### 5. Pipeline de Generación de Imágenes

```mermaid
flowchart TD
    subgraph "Image Request"
        A[Usuario solicita imagen] --> B[Seleccionar tipo de entidad]
        B --> C[Word/Lecture/Expression]
        C --> D[Construir prompt visual]
    end
    
    subgraph "AI Image Generation"
        D --> E[Llamar DALL-E API]
        E --> F{¿Imagen generada?}
        F -->|Sí| G[Convertir a base64]
        F -->|No| H[Error: Fallo en generación]
    end
    
    subgraph "Image Processing"
        G --> I[Validar formato de imagen]
        I --> J[Optimizar tamaño]
        J --> K[Preparar para upload]
    end
    
    subgraph "Cloud Storage"
        K --> L[Upload a Cloudinary]
        L --> M{¿Upload exitoso?}
        M -->|Sí| N[Obtener URL pública]
        M -->|No| O[Error: Fallo en upload]
    end
    
    subgraph "Database Update"
        N --> P[Actualizar entidad en MongoDB]
        P --> Q{¿Actualización exitosa?}
        Q -->|Sí| R[Retornar nueva imagen]
        Q -->|No| S[Error: Fallo en DB]
    end
    
    subgraph "Cleanup"
        R --> T[Eliminar imagen anterior si existe]
        T --> U[Confirmar operación]
        
        H --> V[Error response]
        O --> V
        S --> V
    end
    
    style A fill:#e1f5fe
    style U fill:#c8e6c9
    style V fill:#ffcdd2
```

---

## 🔊 Flujo de Generación de Audio

### 6. Pipeline de Text-to-Speech

```mermaid
flowchart TD
    subgraph "Audio Request"
        A[Usuario ingresa texto] --> B[Validar longitud del texto]
        B --> C[Seleccionar voz]
        C --> D[Configurar parámetros de audio]
    end
    
    subgraph "AI Audio Generation"
        D --> E[Llamar OpenAI TTS API]
        E --> F{¿Audio generado?}
        F -->|Sí| G[Obtener archivo de audio]
        F -->|No| H[Error: Fallo en generación]
    end
    
    subgraph "Audio Processing"
        G --> I[Convertir a formato compatible]
        I --> J[Optimizar calidad]
        J --> K[Generar subtítulos]
    end
    
    subgraph "Storage & Response"
        K --> L[Almacenar en servidor]
        L --> M[Generar URL de acceso]
        M --> N[Retornar audio + subtítulos]
        
        H --> O[Error response]
    end
    
    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style O fill:#ffcdd2
```

---

## 🔄 Flujo de Traducción

### 7. Pipeline de Traducción

```mermaid
flowchart TD
    subgraph "Translation Request"
        A[Usuario ingresa texto] --> B[Detectar idioma origen]
        B --> C[Identificar contexto]
        C --> D[Configurar idioma destino]
    end
    
    subgraph "AI Translation"
        D --> E[Construir prompt de traducción]
        E --> F[Llamar OpenAI con contexto]
        F --> G{¿Traducción exitosa?}
        G -->|Sí| H[Procesar respuesta]
        G -->|No| I[Error: Fallo en traducción]
    end
    
    subgraph "Response Processing"
        H --> J[Formatear traducción]
        J --> K[Agregar contexto cultural]
        K --> L[Retornar traducción]
        
        I --> M[Error response]
    end
    
    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style M fill:#ffcdd2
```

---

## 🗄️ Flujo de Persistencia de Datos

### 8. Pipeline de Base de Datos

```mermaid
flowchart TD
    subgraph "Data Validation"
        A[Datos del AI Service] --> B[Validar esquema]
        B --> C[Sanitizar contenido]
        C --> D[Validar relaciones]
    end
    
    subgraph "Database Operations"
        D --> E{¿Operación de escritura?}
        E -->|Sí| F[Preparar transacción]
        E -->|No| G[Consulta de lectura]
        
        F --> H[Ejecutar operación]
        H --> I{¿Operación exitosa?}
        I -->|Sí| J[Confirmar transacción]
        I -->|No| K[Rollback]
        
        G --> L[Ejecutar query]
        L --> M[Formatear resultados]
    end
    
    subgraph "Response & Logging"
        J --> N[Logging de éxito]
        N --> O[Retornar respuesta]
        
        K --> P[Logging de error]
        P --> Q[Retornar error]
        
        M --> R[Formatear respuesta]
        R --> S[Retornar datos]
    end
    
    style A fill:#e1f5fe
    style O fill:#c8e6c9
    style S fill:#c8e6c9
    style Q fill:#ffcdd2
```

---

## 🔐 Flujo de Seguridad y Autenticación

### 9. Pipeline de Seguridad

```mermaid
flowchart TD
    subgraph "Request Authentication"
        A[HTTP Request] --> B{¿Tiene Authorization header?}
        B -->|No| C[401 Unauthorized]
        B -->|Sí| D[Extraer token JWT]
    end
    
    subgraph "Token Validation"
        D --> E[Verificar firma JWT]
        E --> F{¿Firma válida?}
        F -->|No| G[401 Unauthorized]
        F -->|Sí| H[Decodificar payload]
    end
    
    subgraph "User Verification"
        H --> I[Verificar expiración]
        I --> J{¿Token expirado?}
        J -->|Sí| K[401 Token expired]
        J -->|No| L[Verificar usuario en DB]
    end
    
    subgraph "Authorization"
        L --> M{¿Usuario existe?}
        M -->|No| N[401 User not found]
        M -->|Sí| O[Verificar permisos]
        
        O --> P{¿Tiene permisos?}
        P -->|No| Q[403 Forbidden]
        P -->|Sí| R[Continuar a endpoint]
    end
    
    subgraph "Response"
        R --> S[Ejecutar lógica del endpoint]
        C --> T[Error response]
        G --> T
        K --> T
        N --> T
        Q --> T
    end
    
    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style T fill:#ffcdd2
```

---

## 📊 Flujo de Logging y Monitoreo

### 10. Pipeline de Logging

```mermaid
flowchart TD
    subgraph "Operation Start"
        A[Inicio de operación] --> B[Generar operationId único]
        B --> C[Crear contexto de logging]
        C --> D[Log de inicio con timestamp]
    end
    
    subgraph "Request Logging"
        D --> E[Log de request details]
        E --> F[Log de headers relevantes]
        F --> G[Log de body/params]
    end
    
    subgraph "Processing Logging"
        G --> H[Log de validaciones]
        H --> I[Log de llamadas a servicios]
        I --> J[Log de respuestas de AI]
    end
    
    subgraph "Response Logging"
        J --> K[Log de resultado final]
        K --> L[Log de métricas de performance]
        L --> M[Log de éxito/error]
    end
    
    subgraph "Error Handling"
        M --> N{¿Operación exitosa?}
        N -->|Sí| O[Log de éxito con métricas]
        N -->|No| P[Log de error con stack trace]
        
        O --> Q[Finalizar logging]
        P --> R[Log de contexto de error]
        R --> Q
    end
    
    style A fill:#e1f5fe
    style Q fill:#c8e6c9
```

---

## 🚀 Flujo de Optimización y Caching

### 11. Pipeline de Caching

```mermaid
flowchart TD
    subgraph "Cache Check"
        A[Request entrante] --> B[Generar cache key]
        B --> C{¿Existe en cache?}
        C -->|Sí| D[Retornar desde cache]
        C -->|No| E[Continuar procesamiento]
    end
    
    subgraph "AI Processing"
        E --> F[Llamar AI Service]
        F --> G[Procesar respuesta]
        G --> H[Validar resultado]
    end
    
    subgraph "Cache Storage"
        H --> I{¿Resultado válido?}
        I -->|Sí| J[Almacenar en cache]
        I -->|No| K[Retornar error]
        
        J --> L[Configurar TTL]
        L --> M[Confirmar almacenamiento]
    end
    
    subgraph "Response"
        M --> N[Retornar resultado]
        D --> N
        K --> O[Error response]
    end
    
    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style O fill:#ffcdd2
```

---

## 📈 Métricas y KPIs del Sistema

### 12. Dashboard de Métricas

```mermaid
graph TB
    subgraph "Performance Metrics"
        A[Latencia promedio]
        B[Throughput por segundo]
        C[Tasa de éxito de requests]
        D[Tiempo de respuesta AI]
    end
    
    subgraph "Quality Metrics"
        E[Precisión de generación]
        F[Relevancia de contenido]
        G[Satisfacción del usuario]
        H[Tasa de errores]
    end
    
    subgraph "Usage Metrics"
        I[Usuarios activos]
        J[Contenido generado]
        K[Interacciones de chat]
        L[Exámenes creados]
    end
    
    subgraph "AI Service Metrics"
        M[Tokens consumidos]
        N[Costos por operación]
        O[Tasa de fallos de API]
        P[Calidad de respuestas]
    end
    
    subgraph "Infrastructure Metrics"
        Q[Uso de CPU/Memoria]
        R[Espacio en disco]
        S[Conectividad de red]
        T[Estado de servicios]
    end
```

---

## 🔧 Configuración del Sistema

### 13. Variables de Entorno y Configuración

```mermaid
graph TD
    subgraph "Environment Variables"
        A[OPENAI_API_KEY]
        B[CLOUDINARY_URL]
        C[MONGODB_URI]
        D[JWT_SECRET]
        E[RATE_LIMIT_WINDOW]
        F[RATE_LIMIT_MAX]
    end
    
    subgraph "AI Configuration"
        G[Model Selection]
        H[Temperature Settings]
        I[Max Tokens]
        J[Response Format]
    end
    
    subgraph "Security Configuration"
        K[CORS Settings]
        L[Rate Limiting]
        M[JWT Expiration]
        N[Password Policies]
    end
    
    subgraph "Database Configuration"
        O[Connection Pool]
        P[Indexes]
        Q[Backup Settings]
        R[Monitoring]
    end
    
    A --> G
    B --> H
    C --> O
    D --> M
    E --> L
    F --> L
```

---

## 🎯 Resumen de Flujos Clave

1. **Generación de Contenido**: Input → Validación → AI Service → Validación → Persistencia → Response
2. **Chat Streaming**: Mensaje → Contexto → AI Stream → Frontend Stream → Persistencia
3. **Generación de Exámenes**: Parámetros → Prompt → AI → Validación JSON → Estructura → DB
4. **Imágenes**: Solicitud → Prompt → DALL-E → Base64 → Cloudinary → DB Update
5. **Audio**: Texto → TTS → Audio → Almacenamiento → URL Response
6. **Traducción**: Texto → Contexto → AI → Respuesta → Formateo
7. **Seguridad**: Request → JWT → Validación → Permisos → Endpoint
8. **Logging**: Inicio → Contexto → Procesamiento → Resultado → Métricas
9. **Caching**: Check → AI → Store → Response
10. **Métricas**: Performance → Calidad → Uso → AI → Infraestructura

---

## 🔮 Optimizaciones Futuras

- **Cache Distribuido**: Implementar Redis para cache compartido entre instancias
- **Queue System**: Colas para procesamiento asíncrono de tareas pesadas
- **Load Balancing**: Distribución de carga entre múltiples instancias del AI service
- **Circuit Breaker**: Patrón para manejar fallos de servicios externos
- **Retry Logic**: Lógica de reintento inteligente para fallos temporales
- **Compression**: Compresión de respuestas para mejorar performance
- **CDN**: Distribución de contenido estático para mejor velocidad
- **Monitoring**: Sistema de alertas y dashboards en tiempo real
