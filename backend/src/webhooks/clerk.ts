import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import prisma from '../services/prisma';

export const handleClerkWebhook = async (payload: any, headers: any) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  console.log('🔍 Webhook received with headers:', Object.keys(headers));
  
  if (!webhookSecret) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not set');
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // Create new Webhook instance with your secret
  const wh = new Webhook(webhookSecret);
  
  try {
    console.log('🔐 Verifying webhook signature...');
    const evt = wh.verify(payload, headers) as WebhookEvent;
    
    console.log(`✅ Verified webhook of type: ${evt.type}`);
    console.log('📦 Event data:', JSON.stringify(evt.data, null, 2));
    
    switch (evt.type) {
      case 'user.created':
        console.log('👤 Creating user in database...');
        const userData = {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address || '',
          name: [evt.data.first_name, evt.data.last_name].filter(Boolean).join(' ') || 'User',
        };
        console.log('📝 User data:', userData);
        
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`✅ User created with ID: ${user.id}`);
        break;
        
      case 'user.updated':
        console.log('👤 Updating user in database...');
        const updatedUser = await prisma.user.update({
          where: { clerkId: evt.data.id },
          data: {
            email: evt.data.email_addresses[0]?.email_address || '',
            name: [evt.data.first_name, evt.data.last_name].filter(Boolean).join(' ') || 'User',
          }
        });
        console.log(`✅ User updated: ${updatedUser.id}`);
        break;
        
      case 'user.deleted':
        console.log('👤 Deleting user from database...');
        await prisma.user.delete({
          where: { clerkId: evt.data.id }
        });
        console.log(`✅ User deleted: ${evt.data.id}`);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${evt.type}`);
    }
    
    return { success: true };
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    throw err;
  }
};