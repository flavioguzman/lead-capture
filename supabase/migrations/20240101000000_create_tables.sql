-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.subscribers;
DROP TABLE IF EXISTS public.lead_magnets;

-- Create lead_magnets table
CREATE TABLE public.lead_magnets (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    domain text,
    file_path text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscribers table
CREATE TABLE public.subscribers (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email text NOT NULL,
    lead_magnet_id text REFERENCES lead_magnets(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(email, lead_magnet_id)
);

-- Enable RLS
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert to subscribers"
    ON public.subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow read access to subscribers"
    ON public.subscribers FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to lead_magnets"
    ON public.lead_magnets FOR SELECT
    USING (true);

-- Insert initial lead magnets
INSERT INTO public.lead_magnets (id, name, description, file_path)
VALUES 
    ('1', 'Complete Guide to Medication A', 'Essential prescribing information for Medication A', '/assets/guide-1.pdf'),
    ('2', 'Complete Guide to Medication B', 'Essential prescribing information for Medication B', '/assets/guide-2.pdf')
ON CONFLICT (id) DO NOTHING;