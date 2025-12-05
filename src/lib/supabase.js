import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hivanwqxlcxnzbbxcpnu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdmFud3F4bGN4bnpiYnhjcG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTY4OTYsImV4cCI6MjA4MDA3Mjg5Nn0.9m8KVaLTD4iq0e6aG0NWl9lq2yJnC4I-y8H16YHJ8UE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);