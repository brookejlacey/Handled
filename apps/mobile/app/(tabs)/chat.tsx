import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

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
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getSimulatedResponse = (question: string): string => {
    // Simple simulated responses for demo purposes
    if (question.toLowerCase().includes('credit score')) {
      return "Great question! Your credit score is a number between 300-850 that represents your creditworthiness. Here's what you should know:\n\n• 670-739 is considered \"good\"\n• 740-799 is \"very good\"\n• 800+ is \"excellent\"\n\nI'd recommend checking your score quarterly - it's free and doesn't hurt your credit. Would you like me to add a reminder to check your credit score?";
    }
    if (question.toLowerCase().includes('savings')) {
      return "A good rule of thumb is to have 3-6 months of essential expenses saved in an emergency fund. This should cover:\n\n• Rent/mortgage\n• Utilities\n• Food\n• Insurance\n• Minimum debt payments\n\nStart with a goal of $1,000, then build from there. Even $50/month adds up! Want me to help you calculate your target amount?";
    }
    return "That's a great question. I'd be happy to help you think through this. Could you tell me a bit more about your specific situation? For example, what prompted this question?";
  };

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
        <Pressable style={styles.newChatButton}>
          <Feather name="edit" size={20} color={COLORS.primary} />
        </Pressable>
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
              {isTyping && (
                <View style={styles.typingIndicator}>
                  <View style={styles.avatarContainer}>
                    <Feather name="message-circle" size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.typingBubble}>
                    <Text style={styles.typingText}>Typing...</Text>
                  </View>
                </View>
              )}
              {messages.length === 1 && (
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
          />
          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Feather
              name="send"
              size={20}
              color={inputText.trim() ? COLORS.primary : COLORS.textTertiary}
            />
          </Pressable>
        </View>
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
});
