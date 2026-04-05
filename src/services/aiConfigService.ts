import { HttpClient } from "./api/HttpClient";
import {
  AIFeature,
  AIOperation,
  AIProvider,
  AIConfig,
  AIConfigResponse,
  AIConfigSingleResponse,
} from "@/types/api";

/**
 * AI Configuration Service
 * Manages AI provider configurations for different features and operations
 */
class AIConfigService extends HttpClient {
  constructor() {
    super();
  }

  /**
   * Get all user configurations
   */
  async getConfigs(): Promise<any> {
    return this.get("/api/ai-config");
  }

  /**
   * Get specific configuration for feature + operation
   */
  async getConfig(
    feature: AIFeature,
    operation: AIOperation
  ): Promise<any> {
    return this.get(`/api/ai-config/${feature}/${operation}`);
  }

  /**
   * Save/update configuration
   */
  async saveConfig(
    feature: AIFeature,
    operation: AIOperation,
    provider: AIProvider
  ): Promise<any> {
    return this.post("/api/ai-config", {
      feature,
      operation,
      provider,
    });
  }

  /**
   * Delete configuration (restore default)
   */
  async deleteConfig(
    feature: AIFeature,
    operation: AIOperation
  ): Promise<any> {
    return this.delete(`/api/ai-config/${feature}/${operation}`);
  }

  /**
   * Get system defaults
   */
  async getDefaults(): Promise<any> {
    return this.get("/api/ai-config/defaults");
  }
}

export const aiConfigService = new AIConfigService();

// Re-export types for backward compatibility
export { AIFeature, AIOperation, AIProvider, AIConfig };

