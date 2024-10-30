export interface EmailSubscriber {
  email: string;
  created_at: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}