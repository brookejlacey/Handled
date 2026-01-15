import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth';
import { LIFE_STAGE_OPTIONS, ONBOARDING_STEPS } from '@handled/shared';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

const GOALS = [
  { id: 'get_organized', label: 'Get organized', icon: 'folder' },
  { id: 'save_more', label: 'Save more money', icon: 'piggy-bank' },
  { id: 'reduce_debt', label: 'Reduce debt', icon: 'trending-down' },
  { id: 'protect_family', label: 'Protect my family', icon: 'shield' },
  { id: 'plan_retirement', label: 'Plan for retirement', icon: 'sunset' },
  { id: 'build_wealth', label: 'Build wealth', icon: 'trending-up' },
];

const PAIN_POINTS = [
  { id: 'dont_know_where_to_start', label: "I don't know where to start" },
  { id: 'overwhelmed', label: "I feel overwhelmed" },
  { id: 'no_time', label: "I don't have time" },
  { id: 'partner_disagreements', label: "My partner and I disagree about money" },
  { id: 'shame_embarrassment', label: "I'm embarrassed about what I don't know" },
  { id: 'lack_of_knowledge', label: "I lack financial knowledge" },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);

  const { completeOnboarding } = useAuthStore();

  const currentStep = ONBOARDING_STEPS[step];
  const totalSteps = ONBOARDING_STEPS.length;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep.id) {
      case 'welcome':
        return true;
      case 'life_stage':
        return selectedLifeStage !== null;
      case 'goals':
        return selectedGoals.length > 0;
      case 'pain_points':
        return selectedPainPoints.length > 0;
      case 'ready':
        return true;
      default:
        return true;
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const togglePainPoint = (pointId: string) => {
    setSelectedPainPoints((prev) =>
      prev.includes(pointId) ? prev.filter((p) => p !== pointId) : [...prev, pointId]
    );
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'welcome':
        return (
          <View style={styles.welcomeContent}>
            <Feather name="check-circle" size={80} color={COLORS.primary} />
            <Text style={styles.welcomeText}>
              We're going to help you build a simple system for staying on top of your financial life.
            </Text>
            <Text style={styles.welcomeSubtext}>
              No judgment. No complexity. Just progress.
            </Text>
          </View>
        );

      case 'life_stage':
        return (
          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {LIFE_STAGE_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedLifeStage === option.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedLifeStage(option.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                {selectedLifeStage === option.id && (
                  <Feather name="check" size={20} color={COLORS.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        );

      case 'goals':
        return (
          <View style={styles.gridContainer}>
            {GOALS.map((goal) => (
              <Pressable
                key={goal.id}
                style={[
                  styles.gridItem,
                  selectedGoals.includes(goal.id) && styles.gridItemSelected,
                ]}
                onPress={() => toggleGoal(goal.id)}
              >
                <Feather
                  name={goal.icon as keyof typeof Feather.glyphMap}
                  size={24}
                  color={selectedGoals.includes(goal.id) ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.gridItemLabel,
                    selectedGoals.includes(goal.id) && styles.gridItemLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </Pressable>
            ))}
          </View>
        );

      case 'pain_points':
        return (
          <View style={styles.optionsContainer}>
            {PAIN_POINTS.map((point) => (
              <Pressable
                key={point.id}
                style={[
                  styles.chipOption,
                  selectedPainPoints.includes(point.id) && styles.chipOptionSelected,
                ]}
                onPress={() => togglePainPoint(point.id)}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selectedPainPoints.includes(point.id) && styles.chipLabelSelected,
                  ]}
                >
                  {point.label}
                </Text>
              </Pressable>
            ))}
          </View>
        );

      case 'ready':
        return (
          <View style={styles.welcomeContent}>
            <Feather name="check-circle" size={80} color={COLORS.success} />
            <Text style={styles.welcomeText}>
              We've personalized your experience based on your answers.
            </Text>
            <Text style={styles.welcomeSubtext}>
              Let's start tackling your financial to-dos, one task at a time.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {step > 0 && (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </Pressable>
          )}
          <View style={styles.progressContainer}>
            {ONBOARDING_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= step && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
        </View>

        <View style={styles.stepContent}>{renderStepContent()}</View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
            onPress={handleNext}
            disabled={!canContinue()}
          >
            <Text style={styles.continueButtonText}>
              {step === totalSteps - 1 ? "Let's Go!" : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepHeader: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stepSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  stepContent: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  welcomeSubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  gridItem: {
    width: '47%',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  gridItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
  },
  gridItemLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  gridItemLabelSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  chipOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  chipOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
  },
  chipLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  chipLabelSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  footer: {
    paddingTop: SPACING.md,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
