import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { TASK_CATEGORIES } from '@handled/shared';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

type FilterType = 'all' | 'due_soon' | 'completed';

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Check your credit score',
    category: 'credit_score',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Review monthly subscriptions',
    category: 'bills_subscriptions',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'low',
  },
  {
    id: '3',
    title: 'Update emergency contact info',
    category: 'beneficiaries',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Review insurance coverage',
    category: 'insurance',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
    priority: 'high',
  },
];

export default function TasksScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTasks = MOCK_TASKS.filter((task) => {
    switch (activeFilter) {
      case 'due_soon':
        return task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return `Due ${date.toLocaleDateString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Pressable style={styles.addButton}>
          <Feather name="plus" size={24} color={COLORS.textInverse} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        <FilterChip
          label="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <FilterChip
          label="Due Soon"
          isActive={activeFilter === 'due_soon'}
          onPress={() => setActiveFilter('due_soon')}
        />
        <FilterChip
          label="Completed"
          isActive={activeFilter === 'completed'}
          onPress={() => setActiveFilter('completed')}
        />
      </View>

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No tasks here</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'completed'
                ? "You haven't completed any tasks yet"
                : 'All caught up! Great work.'}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const categoryInfo = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
            return (
              <Pressable key={task.id} style={styles.taskCard}>
                <Pressable
                  style={[
                    styles.checkbox,
                    task.status === 'completed' && styles.checkboxCompleted,
                  ]}
                >
                  {task.status === 'completed' && (
                    <Feather name="check" size={14} color={COLORS.textInverse} />
                  )}
                </Pressable>
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.status === 'completed' && styles.taskTitleCompleted,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '20' }]}>
                      <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                        {categoryInfo.label}
                      </Text>
                    </View>
                    {task.status !== 'completed' && (
                      <Text
                        style={[
                          styles.dueText,
                          task.dueDate < new Date() && styles.dueTextOverdue,
                        ]}
                      >
                        {formatDueDate(task.dueDate)}
                      </Text>
                    )}
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
    </Pressable>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.textInverse,
    fontWeight: '500',
  },
  taskList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
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
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  dueText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  dueTextOverdue: {
    color: COLORS.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
