// 🌟 Ejemplos Prácticos del Efecto Shine de AI
// Copia y pega estos componentes en tu aplicación

import React from 'react';
import "../components/ui/ImageUploaderCard.css";

// ========================================
// 🎯 COMPONENTE BÁSICO CON LOADING
// ========================================

interface LoadingContainerProps {
  loading: boolean;
  children: React.ReactNode;
  subtle?: boolean;
  className?: string;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  loading,
  children,
  subtle = false,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={subtle ? "ai-generating-border-subtle" : "ai-generating-border"}>
        <div className="inner-content">
          <div className={className}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

// ========================================
// 🖼️ GENERADOR DE IMÁGENES
// ========================================

interface ImageGeneratorProps {
  loading: boolean;
  imageUrl?: string;
  alt: string;
  onGenerate: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  loading,
  imageUrl,
  alt,
  onGenerate
}) => {
  return (
    <LoadingContainer loading={loading} className="p-4">
      <div className="text-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full max-w-md rounded-lg border border-zinc-700"
          />
        ) : (
          <div className="w-full max-w-md h-48 rounded-lg bg-zinc-800/50 border border-zinc-700 flex items-center justify-center">
            <div className="text-center text-zinc-500">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-xs">Sin imagen</div>
            </div>
          </div>
        )}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
        >
          {loading ? "Generando..." : "Generar Imagen"}
        </button>
      </div>
    </LoadingContainer>
  );
};

// ========================================
// 💬 GENERADOR DE TEXTO
// ========================================

interface TextGeneratorProps {
  loading: boolean;
  content?: string;
  placeholder: string;
  onGenerate: () => void;
}

export const TextGenerator: React.FC<TextGeneratorProps> = ({
  loading,
  content,
  placeholder,
  onGenerate
}) => {
  return (
    <LoadingContainer loading={loading} className="p-4">
      <div className="space-y-3">
        {content ? (
          <p className="text-zinc-300 leading-relaxed">{content}</p>
        ) : (
          <p className="text-zinc-500 italic">{placeholder}</p>
        )}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg"
        >
          {loading ? "Generando..." : "Generar Texto"}
        </button>
      </div>
    </LoadingContainer>
  );
};

// ========================================
// 🔗 LISTA DE ELEMENTOS
// ========================================

interface ListGeneratorProps {
  loading: boolean;
  items?: string[];
  title: string;
  onGenerate: () => void;
  subtle?: boolean;
}

export const ListGenerator: React.FC<ListGeneratorProps> = ({
  loading,
  items,
  title,
  onGenerate,
  subtle = true
}) => {
  return (
    <LoadingContainer loading={loading} subtle={subtle} className="p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
          {title}
        </h3>
        {items && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <p key={index} className="text-sm text-zinc-300 leading-relaxed">
                • {item}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 italic">Sin {title.toLowerCase()}</p>
        )}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-sm"
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    </LoadingContainer>
  );
};

// ========================================
// 🎨 CARD CON EFECTO PERSONALIZADO
// ========================================

interface AICardProps {
  loading: boolean;
  title: string;
  icon: string;
  children: React.ReactNode;
  subtle?: boolean;
  onRefresh?: () => void;
}

export const AICard: React.FC<AICardProps> = ({
  loading,
  title,
  icon,
  children,
  subtle = false,
  onRefresh
}) => {
  return (
    <LoadingContainer loading={loading} subtle={subtle} className="rounded-lg border border-zinc-800 bg-zinc-900/40">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="h-6 w-6 p-0 bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 rounded transition-all duration-300"
            >
              🔄
            </button>
          )}
        </div>
        {children}
      </div>
    </LoadingContainer>
  );
};

// ========================================
// 📱 USO EN COMPONENTES EXISTENTES
// ========================================

// Ejemplo de cómo usar en un componente existente:
export const ExampleUsage = () => {
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const handleGenerate = async () => {
    setLoading(true);
    // Simular llamada a AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    setContent("Contenido generado por AI...");
    setLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Generador de imágenes */}
      <ImageGenerator
        loading={loading}
        imageUrl={content ? "https://example.com/image.jpg" : undefined}
        alt="Imagen generada"
        onGenerate={handleGenerate}
      />

      {/* Generador de texto */}
      <TextGenerator
        loading={loading}
        content={content}
        placeholder="El texto aparecerá aquí..."
        onGenerate={handleGenerate}
      />

      {/* Lista de elementos */}
      <ListGenerator
        loading={loading}
        items={content ? ["Elemento 1", "Elemento 2"] : undefined}
        title="Elementos"
        onGenerate={handleGenerate}
        subtle={true}
      />

      {/* Card personalizado */}
      <AICard
        loading={loading}
        title="Contenido Personalizado"
        icon="✨"
        subtle={false}
        onRefresh={handleGenerate}
      >
        <p className="text-zinc-300">Contenido del card...</p>
      </AICard>
    </div>
  );
};

// ========================================
// 🎯 HOOK PERSONALIZADO
// ========================================

export const useAILoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const withLoading = React.useCallback(async (fn: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await fn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, withLoading };
};

// ========================================
// 📋 COMPONENTE DE ESTADO
// ========================================

interface AIStatusProps {
  loading: boolean;
  status: 'idle' | 'generating' | 'success' | 'error';
  message?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ loading, status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'generating': return '🤖';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏸️';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'generating': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${getStatusColor()}`}>
      <span className="text-lg">{getStatusIcon()}</span>
      <span className="text-sm">
        {loading ? 'Generando...' : message || status}
      </span>
    </div>
  );
};

export default {
  LoadingContainer,
  ImageGenerator,
  TextGenerator,
  ListGenerator,
  AICard,
  ExampleUsage,
  useAILoading,
  AIStatus
};
