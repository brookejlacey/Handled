import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import prisma from '../../utils/db';
import { success, unauthorized, serverError } from '../../utils/response';

interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id: string;
    expiration_at_ms: number | null;
  };
  api_version: string;
}

const SUBSCRIPTION_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'CANCELLATION',
  'EXPIRATION',
  'BILLING_ISSUE',
  'SUBSCRIBER_ALIAS',
];

async function handleRevenueCatWebhook(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Verify webhook authenticity
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`;

    if (authHeader !== expectedAuth) {
      context.warn('Invalid RevenueCat webhook authorization');
      return unauthorized('Invalid authorization');
    }

    const body = (await request.json()) as RevenueCatEvent;
    const { event } = body;

    context.log(`Processing RevenueCat event: ${event.type} for user ${event.app_user_id}`);

    if (!SUBSCRIPTION_EVENTS.includes(event.type)) {
      return success({ message: 'Event type not processed' });
    }

    const userId = event.app_user_id;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      context.warn(`User not found for RevenueCat event: ${userId}`);
      return success({ message: 'User not found' });
    }

    // Determine subscription tier based on product ID
    let subscriptionTier: 'free' | 'monthly' | 'annual' = 'free';
    if (event.product_id?.includes('monthly')) {
      subscriptionTier = 'monthly';
    } else if (event.product_id?.includes('annual')) {
      subscriptionTier = 'annual';
    }

    // Update user based on event type
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier,
            subscriptionStatus: 'active',
          },
        });
        context.log(`Updated user ${userId} to ${subscriptionTier} subscription`);
        break;

      case 'CANCELLATION':
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'canceled',
          },
        });
        context.log(`User ${userId} subscription canceled`);
        break;

      case 'EXPIRATION':
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'free',
            subscriptionStatus: 'expired',
          },
        });
        context.log(`User ${userId} subscription expired`);
        break;

      case 'BILLING_ISSUE':
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'active', // Still active but has billing issue
          },
        });
        context.log(`User ${userId} has billing issue`);
        break;

      default:
        context.log(`Unhandled event type: ${event.type}`);
    }

    return success({ message: 'Webhook processed successfully' });
  } catch (err) {
    context.error('RevenueCat webhook error:', err);
    return serverError('Failed to process webhook');
  }
}

app.http('revenuecatWebhook', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'webhooks/revenuecat',
  handler: handleRevenueCatWebhook,
});
