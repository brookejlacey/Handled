import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://handled-peach.vercel.app';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
  promptTokens?: number;
  completionTokens?: number;
}

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface SendMessageResponse {
  conversationId: string;
  message: ChatMessage;
}

interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  limit: number;
  offset: number;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

// Chat API
export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<ApiResponse<SendMessageResponse>> {
  return apiRequest<SendMessageResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationId,
      stream: false, // Mobile doesn't support streaming yet
    }),
  });
}

export async function getConversations(
  limit = 20,
  offset = 0
): Promise<ApiResponse<ConversationsResponse>> {
  return apiRequest<ConversationsResponse>(
    `/api/chat?limit=${limit}&offset=${offset}`
  );
}

export async function getConversation(
  conversationId: string
): Promise<ApiResponse<{ conversation: Conversation }>> {
  return apiRequest<{ conversation: Conversation }>(
    `/api/chat/${conversationId}`
  );
}

// Tasks API
export async function getTasks(params?: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<{ tasks: unknown[]; total: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return apiRequest(`/api/tasks${query ? `?${query}` : ''}`);
}

// User API
export async function getCurrentUser(): Promise<ApiResponse<{ user: unknown }>> {
  return apiRequest('/api/user/me');
}

// AI Tips API
export async function getPersonalizedTip(): Promise<ApiResponse<{ tip: string }>> {
  return apiRequest('/api/ai/tip');
}

export default {
  sendMessage,
  getConversations,
  getConversation,
  getTasks,
  getCurrentUser,
  getPersonalizedTip,
};
