// API Types matching backend Pydantic models

export interface ChatRequest {
  message: string;
  model?: string; //the ? after a property name makes that property optional.
  temperature?: number;
  max_tokens?: number;
  stream?: boolean; // 是否使用流式响应
}

export interface ChatResponse {
  response: string;
  model_used: string;
  tokens_used: number;
  timestamp: string;
}

export interface ApiError {
  error: string;
  detail?: string;
  timestamp: string;
}

export interface ApiStatus {
  api: string;
  llm_service: string;
  database: string;
  overall: string;
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

export interface ModelsResponse {
  models: ModelInfo[];
}

// 流式响应相关类型
export interface StreamChunk {
  type: 'start' | 'content' | 'end' | 'error';
  content?: string;
  model?: string;
  full_response?: string;
  model_used?: string;
  timestamp?: string;
  error?: string;
}

// 流式响应回调函数类型
export type StreamCallback = {
  onStart?: (data: StreamChunk) => void;
  onContent?: (data: StreamChunk) => void;
  onEnd?: (data: StreamChunk) => void;
  onError?: (data: StreamChunk) => void;
};
