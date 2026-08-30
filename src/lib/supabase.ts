import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tfygcpiozlysvvivfrxt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeWdjcGlvemx5c3Z2aXZmcnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDc2MjAsImV4cCI6MjA4MTAyMzYyMH0.jVXK4mbm-pIoJSLKXo81J5-ri6hDiZiQvKjvIgHTSbI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
