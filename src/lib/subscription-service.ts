import type { EmailProvider, SubscriptionResponse } from './types';
import { SubscriberStorage } from './storage';

export class SubscriptionService {
  private providers: EmailProvider[];
  private storage: SubscriberStorage;

  constructor(providers: EmailProvider[], storage: SubscriberStorage) {
    this.providers = providers;
    this.storage = storage;
  }

  async subscribe(email: string): Promise<SubscriptionResponse> {
    try {
      // Check if email already exists
      const existingSubscriber = await this.storage.findByEmail(email);
      if (existingSubscriber) {
        return {
          success: true,
          message: 'Welcome back! Here is your download link.',
          downloadUrl: '/assets/prescriber-guide.pdf'
        };
      }

      const timestamp = new Date().toISOString();
      let providerSuccess = false;

      // Try external providers if available
      if (this.providers.length > 0) {
        for (const provider of this.providers) {
          try {
            providerSuccess = await provider.subscribe(email);
            if (providerSuccess) break;
          } catch (error) {
            console.warn(`Provider ${provider.name} failed:`, error);
          }
        }
      }

      // Save subscriber locally regardless of provider status
      await this.storage.save({
        email,
        timestamp,
        provider: providerSuccess ? 'convertkit' : 'local',
        status: 'subscribed'
      });
      
      return {
        success: true,
        message: 'Successfully subscribed! Your download is ready.',
        downloadUrl: '/assets/prescriber-guide.pdf'
      };
    } catch (error) {
      console.error('Subscription error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}