// API client for interacting with Next.js API routes
// All endpoints use cookies for authentication via Supabase

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
  _count?: { messages: number };
}

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  category: string;
  mimeType: string;
  size: number;
  analysisStatus: string;
  analysis?: unknown;
  createdAt: string;
  updatedAt: string;
  url?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for Supabase auth
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // User endpoints
  async getMe(): Promise<{
    id: string;
    email: string;
    displayName?: string;
    subscriptionTier: string;
    subscriptionStatus: string;
    hasCompletedOnboarding: boolean;
  }> {
    return this.request('/api/user/me');
  }

  // Task endpoints
  async getTasks(params?: PaginationParams & { status?: string; category?: string }): Promise<{
    tasks: Task[];
    pagination: { page: number; pageSize: number; total: number };
  }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);

    const query = searchParams.toString();
    return this.request(`/api/tasks${query ? `?${query}` : ''}`);
  }

  async getTask(id: string): Promise<Task> {
    return this.request(`/api/tasks/${id}`);
  }

  async createTask(data: {
    title: string;
    description?: string;
    category: string;
    priority?: string;
    dueDate?: string;
  }): Promise<Task> {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: Partial<{
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    dueDate: string;
  }>): Promise<Task> {
    return this.request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat endpoints
  async getConversations(): Promise<{
    conversations: Conversation[];
  }> {
    return this.request('/api/chat');
  }

  async getConversation(id: string): Promise<{
    conversation: Conversation;
    messages: ChatMessage[];
  }> {
    return this.request(`/api/chat/${id}`);
  }

  async sendMessage(data: {
    message: string;
    conversationId?: string;
    stream?: boolean;
  }): Promise<{
    data: {
      conversationId: string;
      message: ChatMessage;
    };
  }> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async sendMessageStream(data: {
    message: string;
    conversationId?: string;
  }): Promise<Response> {
    // Returns a streaming response for SSE
    return fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, stream: true }),
      credentials: 'include',
    });
  }

  async deleteConversation(id: string): Promise<void> {
    return this.request(`/api/chat/${id}`, {
      method: 'DELETE',
    });
  }

  async submitFeedback(data: {
    messageId: string;
    rating: 'HELPFUL' | 'NOT_HELPFUL';
    comment?: string;
  }): Promise<{
    feedback: {
      id: string;
      messageId: string;
      rating: string;
      comment?: string | null;
    };
  }> {
    return this.request('/api/chat/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Document endpoints
  async getDocuments(): Promise<{
    documents: Document[];
  }> {
    return this.request('/api/documents');
  }

  async getDocument(id: string): Promise<Document> {
    return this.request(`/api/documents/${id}`);
  }

  async uploadDocument(file: File, category?: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);

    const response = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async analyzeDocument(id: string): Promise<Document> {
    return this.request(`/api/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ analyze: true }),
    });
  }

  async deleteDocument(id: string): Promise<void> {
    return this.request(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Onboarding endpoints
  async getOnboardingStatus(): Promise<{
    completed: boolean;
    data?: {
      lifeStage: string;
      goals: string[];
      painPoints: string[];
    };
  }> {
    return this.request('/api/onboarding');
  }

  async saveOnboarding(data: {
    lifeStage: string;
    goals: string[];
    painPoints: string[];
  }): Promise<{ success: boolean; tasksGenerated: number }> {
    return this.request('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI endpoints
  async getPersonalizedTip(): Promise<{ data: { tip: string } }> {
    return this.request('/api/ai/tip');
  }
}

export const api = new ApiClient();
export default api;
