import { api } from "./api";

export type AIFeature = 'word' | 'expression' | 'lecture';
export type AIOperation = 
  | 'generate' | 'examples' | 'codeSwitching' | 'types' | 'synonyms' | 'chat' | 'image'
  | 'text' | 'topic';
export type AIProvider = 'openai' | 'deepseek';

export interface AIConfig {
  _id?: string;
  userId?: string | null;
  feature: AIFeature;
  operation: AIOperation;
  provider: AIProvider;
  model?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIConfigResponse {
  success: boolean;
  message: string;
  data: {
    configs: AIConfig[];
    defaults: Record<AIFeature, Record<string, AIProvider>>;
  };
}

export interface AIConfigSingleResponse {
  success: boolean;
  message: string;
  data: {
    feature: AIFeature;
    operation: AIOperation;
    provider: AIProvider;
    default: AIProvider;
  };
}

export const aiConfigService = {
  // Obtener todas las configuraciones del usuario
  async getConfigs(): Promise<AIConfigResponse> {
    const res = await api.get("/api/ai-config");
    return res.data;
  },

  // Obtener una configuración específica
  async getConfig(feature: AIFeature, operation: AIOperation): Promise<AIConfigSingleResponse> {
    const res = await api.get(`/api/ai-config/${feature}/${operation}`);
    return res.data;
  },

  // Guardar/actualizar configuración
  async saveConfig(
    feature: AIFeature,
    operation: AIOperation,
    provider: AIProvider
  ): Promise<{ success: boolean; message: string; data: AIConfig }> {
    const res = await api.post("/api/ai-config", {
      feature,
      operation,
      provider,
    });
    return res.data;
  },

  // Eliminar configuración (restaurar default)
  async deleteConfig(
    feature: AIFeature,
    operation: AIOperation
  ): Promise<{ success: boolean; message: string; data: AIConfig }> {
    const res = await api.delete(`/api/ai-config/${feature}/${operation}`);
    return res.data;
  },

  // Obtener defaults del sistema
  async getDefaults(): Promise<{
    success: boolean;
    message: string;
    data: Record<AIFeature, Record<string, AIProvider>>;
  }> {
    const res = await api.get("/api/ai-config/defaults");
    return res.data;
  },
};
