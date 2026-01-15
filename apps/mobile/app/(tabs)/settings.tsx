import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>Free Plan</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionBadgeText}>Current</Text>
            </View>
          </View>
          <Text style={styles.subscriptionDescription}>
            Upgrade to unlock unlimited tasks, AI chat, and document analysis.
          </Text>
          <Pressable style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingsRow
            icon="bell"
            title="Push Notifications"
            subtitle="Get reminded about upcoming tasks"
            trailing={<Switch value={true} onValueChange={() => {}} />}
          />
          <SettingsRow
            icon="clock"
            title="Reminder Time"
            subtitle="9:00 AM"
            onPress={() => {}}
          />
          <SettingsRow
            icon="calendar"
            title="Reminder Days"
            subtitle="Mon, Wed, Fri"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingsRow
            icon="moon"
            title="Dark Mode"
            subtitle="Match system settings"
            onPress={() => {}}
          />
          <SettingsRow
            icon="globe"
            title="Language"
            subtitle="English"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsRow icon="help-circle" title="Help Center" onPress={() => {}} />
          <SettingsRow icon="message-square" title="Send Feedback" onPress={() => {}} />
          <SettingsRow icon="star" title="Rate the App" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <SettingsRow icon="file-text" title="Privacy Policy" onPress={() => {}} />
          <SettingsRow icon="file-text" title="Terms of Service" onPress={() => {}} />
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.settingsRow} onPress={onPress}>
      <View style={styles.settingsRowIcon}>
        <Feather name={icon} size={20} color={COLORS.textSecondary} />
      </View>
      <View style={styles.settingsRowContent}>
        <Text style={styles.settingsRowTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>}
      </View>
      {trailing || (onPress && <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  subscriptionCard: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    marginBottom: SPACING.lg,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subscriptionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  subscriptionBadge: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  subscriptionBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.textInverse,
  },
  subscriptionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  settingsRowIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingsRowContent: {
    flex: 1,
  },
  settingsRowTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  settingsRowSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.error,
  },
  versionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
