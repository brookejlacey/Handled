import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'there'}</Text>
          </View>
          <Pressable style={styles.profileButton}>
            <Feather name="user" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>This Week</Text>
            <Text style={styles.progressSubtitle}>2 of 5 tasks completed</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
          <Text style={styles.progressEncouragement}>
            You're making great progress! Keep it up.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Due Soon</Text>
            <Pressable onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          <TaskPreviewCard
            title="Check your credit score"
            category="Credit Score"
            dueText="Due in 3 days"
            priority="medium"
            icon="credit-card"
          />
          <TaskPreviewCard
            title="Review monthly subscriptions"
            category="Bills & Subscriptions"
            dueText="Due in 5 days"
            priority="low"
            icon="repeat"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickActionButton
              icon="message-circle"
              label="Ask a question"
              onPress={() => router.push('/(tabs)/chat')}
            />
            <QuickActionButton
              icon="plus-circle"
              label="Add a task"
              onPress={() => {}}
            />
            <QuickActionButton
              icon="upload"
              label="Upload document"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Tip</Text>
          <View style={styles.tipCard}>
            <Feather name="lightbulb" size={24} color={COLORS.warning} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Did you know?</Text>
              <Text style={styles.tipText}>
                Checking your credit score doesn't hurt your credit. You can check it as often as
                you like without any impact.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskPreviewCard({
  title,
  category,
  dueText,
  priority,
  icon,
}: {
  title: string;
  category: string;
  dueText: string;
  priority: 'low' | 'medium' | 'high';
  icon: keyof typeof Feather.glyphMap;
}) {
  const priorityColors = {
    low: COLORS.textTertiary,
    medium: COLORS.warning,
    high: COLORS.error,
  };

  return (
    <Pressable style={styles.taskCard}>
      <View style={styles.taskIconContainer}>
        <Feather name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{title}</Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskCategory}>{category}</Text>
          <Text style={[styles.taskDue, { color: priorityColors[priority] }]}>{dueText}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
    </Pressable>
  );
}

function QuickActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickActionButton} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <Feather name={icon} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressCard: {
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressEncouragement: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
  },
  section: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  taskCategory: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  taskDue: {
    fontSize: FONT_SIZES.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
