import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// In development, use proxy to avoid CORS issues
// In production, use the direct Supabase URL
const isDevelopment = import.meta.env.DEV
const clientUrl = isDevelopment 
  ? `${window.location.origin}/supabase` 
  : supabaseUrl

// Custom fetch function that routes through proxy in development
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Convert input to string URL
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  
  // If in development and the URL is the Supabase URL, route through proxy
  if (isDevelopment && url.startsWith(supabaseUrl)) {
    const proxiedUrl = url.replace(supabaseUrl, `${window.location.origin}/supabase`)
    return fetch(proxiedUrl, init)
  }
  return fetch(input, init)
}

export const supabase = createClient(clientUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    fetch: customFetch
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      client_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone: string | null
          company: string | null
          language: string
          notifications: string
          currency: string
          default_origin: string | null
          preferred_transporters: string
          insurance_level: string
          profile_picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          phone?: string | null
          company?: string | null
          language?: string
          notifications?: string
          currency?: string
          default_origin?: string | null
          preferred_transporters?: string
          insurance_level?: string
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          company?: string | null
          language?: string
          notifications?: string
          currency?: string
          default_origin?: string | null
          preferred_transporters?: string
          insurance_level?: string
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
