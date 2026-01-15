export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Up to 5 active tasks',
      'Basic task templates',
      'Limited chat messages (10/month)',
    ],
    limits: {
      maxTasks: 5,
      maxChatMessages: 10,
      documentUploads: false,
      customTasks: false,
    },
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited tasks',
      'All task templates',
      'Unlimited AI chat',
      'Document upload & analysis',
      'Custom task creation',
      'Priority support',
    ],
    limits: {
      maxTasks: -1, // unlimited
      maxChatMessages: -1,
      documentUploads: true,
      customTasks: true,
    },
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    price: 79.0,
    interval: 'year',
    features: [
      'Everything in Monthly',
      'Save $40/year',
      'Early access to new features',
    ],
    limits: {
      maxTasks: -1,
      maxChatMessages: -1,
      documentUploads: true,
      customTasks: true,
    },
  },
} as const;

export const REVENUECAT_PRODUCT_IDS = {
  monthly: 'handled_monthly_999',
  annual: 'handled_annual_7900',
} as const;
