import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/backend';
import prisma from '../services/prisma';

export const handleClerkWebhook = async (payload: any, headers: any) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const wh = new Webhook(webhookSecret);

  const svixHeaders = {
    "svix-id": headers["svix-id"],
    "svix-timestamp": headers["svix-timestamp"],
    "svix-signature": headers["svix-signature"],
  };

  try {
    const evt = wh.verify(payload, svixHeaders) as WebhookEvent;

    console.log("Webhook verified:", evt.type);

    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;

      case "user.updated":
        await handleUserUpdated(evt.data);
        break;

      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
    }

    return { success: true };
  } catch (err) {
    console.error("Webhook verification failed:", err);
    throw err;
  }
};

async function handleUserCreated(data: any) {
  try {
    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address || `user_${data.id}@placeholder.com`, // Fallback email
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User',
      avatarUrl: data.image_url || null,
    };

    console.log('Creating user:', userData);

    const user = await prisma.user.create({
      data: userData
    });

  } catch (error: any) {
    if (error.code === 'P2002') {
      await handleUserUpdated(data);
    } else {
      console.error('Failed to create user:', error);
      throw error;
    }
  }
}

async function handleUserUpdated(data: any) {
  try {
    const userData = {
      email: data.email_addresses[0]?.email_address || '',
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User',
      avatarUrl: data.image_url || '',
    };

    console.log('Updating user:', userData);

    const user = await prisma.user.update({
      where: { clerkId: data.id },
      data: userData
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

async function handleUserDeleted(data: any) {
  try {
    console.log(`Deleting user: ${data.id}`);

    await prisma.user.delete({
      where: { clerkId: data.id }
    });

  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}