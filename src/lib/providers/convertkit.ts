import type { EmailProvider } from '../types';

export class ConvertKitProvider implements EmailProvider {
  private apiKey: string;
  private formId: string;

  constructor(apiKey: string, formId: string) {
    this.apiKey = apiKey;
    this.formId = formId;
  }

  name = 'convertkit';

  async subscribe(email: string): Promise<boolean> {
    if (!this.apiKey || !this.formId || 
        this.apiKey === 'your-api-key' || 
        this.formId === 'your-form-id') {
      console.error('ConvertKit credentials not configured');
      throw new Error('ConvertKit credentials not configured');
    }

    try {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${this.formId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: this.apiKey,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`ConvertKit API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('ConvertKit subscription error:', error);
      throw error;
    }
  }
}