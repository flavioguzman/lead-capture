import type { APIRoute } from 'astro';
import { SubscriberStorage } from '../../lib/storage';

const siteId = import.meta.env.PUBLIC_SITE_ID;

export const GET: APIRoute = async () => {
  try {
    const storage = new SubscriberStorage(siteId);
    const subscribers = await storage.getAll();
    
    // Map to a safe response format
    const safeSubscribers = subscribers.map(sub => ({
      email: sub.email,
      timestamp: sub.timestamp,
      status: sub.status
    }));

    return new Response(
      JSON.stringify({
        success: true,
        subscribers: safeSubscribers
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch subscribers'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}