export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      enquiries: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          sector: string | null
          message: string
          status: 'unread' | 'read'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          sector?: string | null
          message: string
          status?: 'unread' | 'read'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          sector?: string | null
          message?: string
          status?: 'unread' | 'read'
        }
      }
      subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          title: string
          category: string
          excerpt: string
          content: string
          image_url: string | null
          slug: string
          published_at: string | null
          status: 'draft' | 'published'
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          category: string
          excerpt: string
          content: string
          image_url?: string | null
          slug: string
          published_at?: string | null
          status?: 'draft' | 'published'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          category?: string
          excerpt?: string
          content?: string
          image_url?: string | null
          slug?: string
          published_at?: string | null
          status?: 'draft' | 'published'
        }
      }
      portfolio: {
        Row: {
          id: string
          created_at: string
          title: string
          category: string
          description: string
          image_url: string
          link: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          category: string
          description: string
          image_url: string
          link?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          category?: string
          description?: string
          image_url?: string
          link?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          client_name: string
          role: string
          company: string
          review_text: string
          photo_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_name: string
          role: string
          company: string
          review_text: string
          photo_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_name?: string
          role?: string
          company?: string
          review_text?: string
          photo_url?: string | null
        }
      }
      visitor_logs: {
        Row: {
          id: string
          created_at: string
          ip_address: string
          country: string | null
          city: string | null
          region: string | null
          isp: string | null
          asn: string | null
          device_type: string | null
          visit_count: number
          last_seen: string
          is_returning: boolean
          path_history: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          ip_address: string
          country?: string | null
          city?: string | null
          region?: string | null
          isp?: string | null
          asn?: string | null
          device_type?: string | null
          visit_count?: number
          last_seen?: string
          is_returning?: boolean
          path_history?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          ip_address?: string
          country?: string | null
          city?: string | null
          region?: string | null
          isp?: string | null
          asn?: string | null
          device_type?: string | null
          visit_count?: number
          last_seen?: string
          is_returning?: boolean
          path_history?: string[]
        }
      }
    }
  }
}
