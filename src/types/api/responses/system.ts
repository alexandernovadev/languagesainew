/**
 * System Response Types
 */

export interface SystemInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  cpus: number;
  memory: {
    total: string;
    free: string;
  };
}

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime?: number;
}
