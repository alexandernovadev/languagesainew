// Servicio para consumir la API de logs
import { api } from './api';
import { getAuthHeaders } from '@/utils/services';

const BASE_URL = '/api/logs';

// 1. Obtener y filtrar logs
export async function getLogs(params: {
  level?: 'INFO' | 'ERROR' | 'UNKNOWN';
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  const url = `${BASE_URL}?${queryParams.toString()}`;
  return api.get(url, { headers: getAuthHeaders() });
}

// 2. Obtener estadísticas de logs
export async function getLogStatistics() {
  const url = `${BASE_URL}/statistics`;
  return api.get(url, { headers: getAuthHeaders() });
}

// 3. Exportar logs (json o csv)
export async function exportLogs(format: 'json' | 'csv' = 'json') {
  const url = `${BASE_URL}/export?format=${format}`;
  const responseType = format === 'csv' ? 'blob' : 'json';
  return api.get(url, {
    headers: getAuthHeaders(),
    responseType: responseType as any,
  });
}

// 4. Limpiar todos los logs
export async function clearLogs() {
  const url = `${BASE_URL}/clear`;
  return api.get(url, { headers: getAuthHeaders() });
} 