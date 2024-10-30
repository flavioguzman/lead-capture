export interface Database {
  public: {
    Tables: {
      lead_magnets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          domain: string | null;
          file_path: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lead_magnets']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['lead_magnets']['Row']>;
      };
      subscribers: {
        Row: {
          id: number;
          email: string;
          lead_magnet_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['subscribers']['Row']>;
      };
    };
  };
}