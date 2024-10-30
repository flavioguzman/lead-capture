import { supabase } from './supabase';
import type { EmailSubscriber } from './types';

export class SubscriberStorage {
  private leadMagnetId: string;

  constructor(leadMagnetId: string) {
    this.leadMagnetId = leadMagnetId;
  }

  async save(email: string): Promise<void> {
    const { error } = await supabase
      .from('subscribers')
      .insert({
        email,
        lead_magnet_id: this.leadMagnetId
      });

    if (error) throw error;
  }

  async findByEmail(email: string): Promise<EmailSubscriber | null> {
    const { data, error } = await supabase
      .from('subscribers')
      .select('email, created_at')
      .eq('email', email)
      .eq('lead_magnet_id', this.leadMagnetId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async getLeadMagnetInfo() {
    const { data, error } = await supabase
      .from('lead_magnets')
      .select('name, description, file_path')
      .eq('id', this.leadMagnetId)
      .single();

    if (error) throw error;
    return {
      title: data.name,
      description: data.description,
      file_path: data.file_path
    };
  }

  async getAll() {
    const { data, error } = await supabase
      .from('subscribers')
      .select(`
        email,
        created_at,
        lead_magnets (
          name
        )
      `)
      .eq('lead_magnet_id', this.leadMagnetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}