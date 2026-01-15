export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  attachments: ChatAttachment[];
  metadata: MessageMetadata | null;
  createdAt: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatAttachment {
  id: string;
  messageId: string;
  type: AttachmentType;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  analysisResult: DocumentAnalysis | null;
}

export type AttachmentType = 'image' | 'pdf' | 'document';

export interface DocumentAnalysis {
  documentType: DocumentType;
  extractedData: Record<string, unknown>;
  summary: string;
  actionItems: string[];
  confidence: number;
}

export type DocumentType =
  | 'bank_statement'
  | 'credit_card_statement'
  | 'tax_document'
  | 'insurance_policy'
  | 'investment_statement'
  | 'bill'
  | 'receipt'
  | 'contract'
  | 'unknown';

export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export type ConversationContext =
  | 'general'
  | 'task_help'
  | 'document_review'
  | 'financial_question'
  | 'emotional_support';

export interface MessageMetadata {
  taskId?: string;
  documentId?: string;
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  type: 'create_task' | 'schedule_reminder' | 'save_document' | 'external_link';
  label: string;
  payload: Record<string, unknown>;
}
