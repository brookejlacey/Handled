import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS, SHADOWS } from '@/utils/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Example progress data
  const completedTasks = 5;
  const totalTasks = 8;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'there'}</Text>
          </View>
          <Pressable style={styles.profileButton}>
            <Feather name="user" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIconContainer}>
              <Feather name="check-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSubtitle}>
                {completedTasks} of {totalTasks} tasks completed
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressEncouragement}>
            {progressPercent >= 50
              ? "You're making great progress! Keep it up."
              : "Small wins add up. You've got this!"}
          </Text>
        </View>

        {/* Due Soon Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Due Soon</Text>
            <Pressable onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          <TaskPreviewCard
            title="Review life insurance coverage"
            category="Insurance"
            dueText="Due in 3 days"
            priority="medium"
            icon="shield"
          />
          <TaskPreviewCard
            title="Check FSA deadline"
            category="Benefits"
            dueText="Due in 5 days"
            priority="low"
            icon="clock"
          />
          <TaskPreviewCard
            title="Update retirement beneficiaries"
            category="Retirement"
            dueText="Due in 7 days"
            priority="medium"
            icon="users"
          />
        </View>

        {/* Quick Actions */}
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

        {/* Completed Recently */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Recently</Text>
          <View style={styles.completedList}>
            <CompletedTaskItem title="Check credit score" daysAgo={2} />
            <CompletedTaskItem title="Review monthly subscriptions" daysAgo={4} />
            <CompletedTaskItem title="Set up emergency fund auto-transfer" daysAgo={6} />
          </View>
        </View>

        {/* Tip Card */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Feather name="info" size={20} color={COLORS.info} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Did you know?</Text>
              <Text style={styles.tipText}>
                Checking your credit score doesn&apos;t hurt your credit. You can check it as often as
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
          <View style={styles.taskDot} />
          <Text style={[styles.taskDue, { color: priorityColors[priority] }]}>{dueText}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
    </Pressable>
  );
}

function CompletedTaskItem({ title, daysAgo }: { title: string; daysAgo: number }) {
  return (
    <View style={styles.completedItem}>
      <View style={styles.completedCheck}>
        <Feather name="check" size={14} color={COLORS.surface} />
      </View>
      <Text style={styles.completedTitle}>{title}</Text>
      <Text style={styles.completedDays}>{daysAgo}d ago</Text>
    </View>
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
    fontWeight: FONT_WEIGHTS.bold,
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
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.soft,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  progressIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    flex: 1,
  },
  progressTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  progressSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressEncouragement: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
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
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  taskCategory: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  taskDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
  },
  taskDue: {
    fontSize: FONT_SIZES.xs,
  },
  completedList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  completedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTitle: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedDays: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
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
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: `${COLORS.info}15`,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.info}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
