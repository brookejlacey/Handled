'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  Send,
  Paperclip,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  MessageSquare,
  FileText,
  HelpCircle,
  Heart,
} from 'lucide-react';

// Local UI message type (simpler than shared ChatMessage)
interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: HelpCircle, text: "What should I focus on first?", category: "Getting Started" },
  { icon: FileText, text: "Can you review my credit report?", category: "Documents" },
  { icon: MessageSquare, text: "How much should I save for emergencies?", category: "Savings" },
  { icon: Heart, text: "I feel overwhelmed by my finances", category: "Support" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        message: text,
        conversationId: conversationId || undefined,
      });

      const assistantMessage: UIMessage = {
        id: response.data.message.id,
        role: 'assistant',
        content: response.data.message.content,
        createdAt: new Date(response.data.message.createdAt),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: UIMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your message. Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Money Mentor</h1>
          <p className="text-text-secondary">Your personal financial guide</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([]);
              setConversationId(null);
            }}
          >
            <RefreshCw className="w-4 h-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Hi {firstName}, how can I help?
            </h2>
            <p className="text-text-secondary text-center max-w-md mb-8">
              Ask me anything about your finances. I can help with budgeting, saving, debt, investing, and more. No judgment, just guidance.
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-3 p-4 bg-surface-muted rounded-xl hover:bg-surface-cream transition-colors text-left group"
                >
                  <div className="w-10 h-10 bg-surface-white rounded-lg flex items-center justify-center group-hover:bg-brand-green-lighter transition-colors">
                    <prompt.icon className="w-5 h-5 text-text-muted group-hover:text-brand-green transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{prompt.text}</p>
                    <p className="text-xs text-text-muted">{prompt.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages List
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={handleCopy}
                isCopied={copiedId === message.id}
                userName={user?.displayName || 'You'}
              />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-surface-muted rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your finances..."
                className="w-full px-4 py-3 bg-surface-muted border-0 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-text-muted text-center mt-3">
            AI responses are for educational purposes. Always consult a professional for major financial decisions.
          </p>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  isCopied,
  userName,
}: {
  message: UIMessage;
  onCopy: (text: string, id: string) => void;
  isCopied: boolean;
  userName: string;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-brand-green-lighter' : 'bg-brand-green'
        )}
      >
        {isUser ? (
          <span className="text-brand-green font-medium text-sm">{userName.charAt(0)}</span>
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={cn('max-w-[80%] group', isUser && 'text-right')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-brand-green text-white rounded-tr-none'
              : 'bg-surface-muted text-text-primary rounded-tl-none'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCopy(message.content, message.id)}
              className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors"
              title="Copy"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-brand-green" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
            </button>
            <button
              className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors"
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4 text-text-muted" />
            </button>
            <button
              className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors"
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
