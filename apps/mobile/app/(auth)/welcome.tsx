import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS, SHADOWS } from '@/utils/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Headline */}
          <Text style={styles.title}>
            Finally get your finances{'\n'}
            <Text style={styles.titleAccent}>handled</Text>
          </Text>

          {/* Subheadline */}
          <Text style={styles.subtitle}>
            Complete the financial tasks you keep putting off. Not another budgeting app—just the guidance you need.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem
            icon="check-circle"
            title="Tasks, not transactions"
            description="We focus on what needs to get done, not counting your spending"
          />
          <FeatureItem
            icon="user"
            title="Built for your life"
            description="Personalized to your situation—new job, divorce, new baby, we adjust"
          />
          <FeatureItem
            icon="heart"
            title="Judgment-free zone"
            description="No shame, just support and celebration when you finish"
          />
        </View>

        {/* CTA Buttons */}
        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Feather name="arrow-right" size={20} color={COLORS.cream} />
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Feather name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark.bg,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 42,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textDarkSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  features: {
    gap: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.dark.bgSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: `${COLORS.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.cream,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDarkSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    ...SHADOWS.glow,
  },
  primaryButtonText: {
    color: COLORS.cream,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  secondaryButtonText: {
    color: COLORS.textDarkSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
