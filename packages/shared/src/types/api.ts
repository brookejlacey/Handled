export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SUBSCRIPTION_REQUIRED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

// Task API types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  category: string;
  priority?: string;
  dueDate?: string;
  recurrence?: {
    frequency: string;
    interval: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
  };
  estimatedMinutes?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  notes?: string;
}

// Chat API types
export interface SendMessageRequest {
  conversationId?: string;
  content: string;
  attachmentIds?: string[];
  context?: string;
}

export interface SendMessageResponse {
  message: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
  };
  conversationId: string;
}
