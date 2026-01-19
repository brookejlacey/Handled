import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hi there! I'm here to help you with any financial questions or tasks. No question is too basic - this is a judgment-free zone. What can I help you with today?",
    timestamp: new Date(),
  },
];

const SUGGESTED_QUESTIONS = [
  'What should I know about my credit score?',
  'How much should I have in savings?',
  'Should I pay off debt or save first?',
  'What insurance do I actually need?',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const { isAuthenticated } = useAuthStore();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Check authentication
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to chat with the AI assistant.',
        [{ text: 'OK' }]
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage(text.trim(), conversationId || undefined);

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: response.data.message.id,
          role: 'assistant',
          content: response.data.message.content,
          timestamp: new Date(response.data.message.createdAt),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setConversationId(response.data.conversationId);
      } else {
        // Handle API error
        const errorMessage: Message = {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: response.error || "I'm sorry, I couldn't process your message. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isAuthenticated, conversationId]);

  const startNewChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setConversationId(null);
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[styles.messageContainer, item.role === 'user' && styles.userMessageContainer]}
    >
      {item.role === 'assistant' && (
        <View style={styles.avatarContainer}>
          <Feather name="message-circle" size={16} color={COLORS.primary} />
        </View>
      )}
      <View
        style={[styles.messageBubble, item.role === 'user' && styles.userMessageBubble]}
      >
        <Text
          style={[styles.messageText, item.role === 'user' && styles.userMessageText]}
        >
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <View style={styles.headerButtons}>
          {messages.length > 1 && (
            <Pressable style={styles.newChatButton} onPress={startNewChat}>
              <Feather name="refresh-cw" size={18} color={COLORS.primary} />
            </Pressable>
          )}
          <Pressable style={styles.newChatButton}>
            <Feather name="edit" size={20} color={COLORS.primary} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={
            <>
              {isLoading && (
                <View style={styles.typingIndicator}>
                  <View style={styles.avatarContainer}>
                    <Feather name="message-circle" size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.typingText}>Thinking...</Text>
                  </View>
                </View>
              )}
              {messages.length === 1 && !isLoading && (
                <View style={styles.suggestedQuestions}>
                  <Text style={styles.suggestedTitle}>Try asking:</Text>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <Pressable
                      key={index}
                      style={styles.suggestedButton}
                      onPress={() => sendMessage(question)}
                    >
                      <Text style={styles.suggestedButtonText}>{question}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          }
        />

        <View style={styles.inputContainer}>
          <Pressable style={styles.attachButton}>
            <Feather name="paperclip" size={20} color={COLORS.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={COLORS.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <Pressable
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.textTertiary} />
            ) : (
              <Feather
                name="send"
                size={20}
                color={inputText.trim() ? COLORS.primary : COLORS.textTertiary}
              />
            )}
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          AI responses are for educational purposes. Consult a professional for major decisions.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    borderTopLeftRadius: BORDER_RADIUS.sm,
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.sm,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.textInverse,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    borderTopLeftRadius: BORDER_RADIUS.sm,
  },
  typingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  suggestedQuestions: {
    marginTop: SPACING.lg,
  },
  suggestedTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  suggestedButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestedButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
});
