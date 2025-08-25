import axios, { AxiosResponse } from 'axios';
import {
  ChatRequest,
  ChatResponse,
  ApiStatus,
  ModelsResponse,
  ApiError,
  StreamChunk,
  StreamCallback
} from '../types/api';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  /**
   * Send a chat message and get LLM response
   */
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await apiClient.post(
        `${API_PREFIX}/chat`,
        request
      );
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get available models
   */
  static async getModels(): Promise<ModelsResponse> {
    try {
      const response: AxiosResponse<ModelsResponse> = await apiClient.get(
        `${API_PREFIX}/models`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get API status
   */
  static async getStatus(): Promise<ApiStatus> {
    try {
      const response: AxiosResponse<ApiStatus> = await apiClient.get(
        `${API_PREFIX}/status`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Check if API is healthy
   */
  static async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Send a streaming chat message and handle Server-Sent Events
   */
  static async sendChatMessageStream(
    request: ChatRequest, 
    callbacks: StreamCallback
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const jsonData = line.slice(6).trim();
                if (jsonData) {
                  const data: StreamChunk = JSON.parse(jsonData);
                  
                  switch (data.type) {
                    case 'start':
                      callbacks.onStart?.(data);
                      break;
                    case 'content':
                      callbacks.onContent?.(data);
                      break;
                    case 'end':
                      callbacks.onEnd?.(data);
                      break;
                    case 'error':
                      callbacks.onError?.(data);
                      break;
                  }
                }
              } catch (parseError) {
                console.error('Failed to parse SSE data:', parseError, 'Line:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: any) {
      console.error('Streaming error:', error);
      callbacks.onError?.({
        type: 'error',
        error: error.message || 'Failed to establish streaming connection'
      });
    }
  }

  /**
   * Handle API errors consistently
   */
  private static handleApiError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = error.response.data;
      return new Error(apiError.error || `API Error: ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: Unable to connect to the server');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }
}
