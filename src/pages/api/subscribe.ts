import type { APIRoute } from 'astro';
import { SubscriberStorage } from '../../lib/storage';
import { sendLeadMagnetEmail } from '../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, leadMagnetId } = await request.json();

    if (!email || !leadMagnetId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields'
        }),
        { status: 400 }
      );
    }

    const storage = new SubscriberStorage(leadMagnetId);

    // Check if email already exists for this lead magnet
    const existingSubscriber = await storage.findByEmail(email);
    
    if (!existingSubscriber) {
      // Save new subscriber
      await storage.save(email);
    }

    // Get the lead magnet info
    const leadMagnet = await storage.getLeadMagnetInfo();

    // Send email asynchronously
    sendLeadMagnetEmail(email, leadMagnet.title, leadMagnet.file_path).catch(error => {
      console.error('Email sending failed:', error);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for subscribing! Check your email for the download link.',
        downloadUrl: leadMagnet.file_path
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      }),
      { status: 500 }
    );
  }
}