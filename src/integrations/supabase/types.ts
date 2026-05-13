export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          rank: Database["public"]["Enums"]["admin_rank"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rank?: Database["public"]["Enums"]["admin_rank"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rank?: Database["public"]["Enums"]["admin_rank"]
          user_id?: string
        }
        Relationships: []
      }
      ambassador_applications: {
        Row: {
          created_at: string
          id: string
          motivation: string | null
          program_id: string | null
          social_handle: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          motivation?: string | null
          program_id?: string | null
          social_handle?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          motivation?: string | null
          program_id?: string | null
          social_handle?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ambassador_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassador_programs: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          perks: string[] | null
          requirements: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          perks?: string[] | null
          requirements?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          perks?: string[] | null
          requirements?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_programs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_bookings: {
        Row: {
          artist_id: string | null
          created_at: string
          event_id: string | null
          id: string
          offered_amount: number | null
          status: string
        }
        Insert: {
          artist_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          offered_amount?: number | null
          status?: string
        }
        Update: {
          artist_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          offered_amount?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_bookings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_profiles: {
        Row: {
          base_price: number | null
          bio: string | null
          created_at: string
          genre: string | null
          id: string
          name: string
          portfolio_url: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          base_price?: number | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          name: string
          portfolio_url?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          base_price?: number | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          name?: string
          portfolio_url?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: []
      }
      blacklisted_users: {
        Row: {
          created_at: string
          created_by: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          reason?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      broadcast_messages: {
        Row: {
          active: boolean
          created_at: string
          created_by: string
          id: string
          message: string
          severity: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by: string
          id?: string
          message: string
          severity?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          severity?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          event_id: string
          id: string
          issue_date: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          event_id: string
          id?: string
          issue_date?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          event_id?: string
          id?: string
          issue_date?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          region_cluster: string | null
          state: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          region_cluster?: string | null
          state: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          region_cluster?: string | null
          state?: string
        }
        Relationships: []
      }
      college_members: {
        Row: {
          college_id: string | null
          created_at: string
          id: string
          is_approved: boolean
          role: Database["public"]["Enums"]["college_internal_role"]
          user_id: string | null
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          role?: Database["public"]["Enums"]["college_internal_role"]
          user_id?: string | null
        }
        Update: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          role?: Database["public"]["Enums"]["college_internal_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "college_members_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_members_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
          {
            foreignKeyName: "college_members_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      colleges: {
        Row: {
          approved_by: string | null
          city: string | null
          created_at: string
          domain: string | null
          fests: number
          id: string
          metadata: Json | null
          name: string
          rejection_reason: string | null
          slug: string | null
          status: Database["public"]["Enums"]["college_status"]
        }
        Insert: {
          approved_by?: string | null
          city?: string | null
          created_at?: string
          domain?: string | null
          fests?: number
          id?: string
          metadata?: Json | null
          name: string
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["college_status"]
        }
        Update: {
          approved_by?: string | null
          city?: string | null
          created_at?: string
          domain?: string | null
          fests?: number
          id?: string
          metadata?: Json | null
          name?: string
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["college_status"]
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_name: string
          created_at: string
          id: string
          industry: string | null
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_name: string
          created_at?: string
          id?: string
          industry?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      competition_votes: {
        Row: {
          candidate_name: string
          created_at: string
          event_id: string | null
          id: string
          voter_id: string | null
        }
        Insert: {
          candidate_name: string
          created_at?: string
          event_id?: string | null
          id?: string
          voter_id?: string | null
        }
        Update: {
          candidate_name?: string
          created_at?: string
          event_id?: string | null
          id?: string
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_memories: {
        Row: {
          event_id: string | null
          id: string
          metadata: Json
          minted_at: string
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          metadata: Json
          minted_at?: string
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          metadata?: Json
          minted_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_memories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_budgets: {
        Row: {
          allocated_amount: number
          category: string
          created_at: string
          currency: string
          event_id: string
          id: string
          spent_amount: number
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          category: string
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          spent_amount?: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          category?: string
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          spent_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_chat_messages: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_chat_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_expenses: {
        Row: {
          amount: number
          budget_id: string
          created_at: string
          description: string
          id: string
          invoice_url: string | null
          status: string
          vendor_name: string | null
        }
        Insert: {
          amount: number
          budget_id: string
          created_at?: string
          description: string
          id?: string
          invoice_url?: string | null
          status?: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          budget_id?: string
          created_at?: string
          description?: string
          id?: string
          invoice_url?: string | null
          status?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_expenses_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "event_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees: number
          category: string
          city: string
          college_id: string | null
          college_name: string
          cover: string
          created_at: string
          date: string
          description: string
          external_id: string | null
          id: string
          is_featured: boolean
          is_government_partnered: boolean | null
          is_promoted: boolean
          organizer: string
          organizer_user_id: string | null
          pass_settings: Json | null
          price_from: number
          status: string
          tags: string[] | null
          team_members: Json | null
          time: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          attendees?: number
          category: string
          city: string
          college_id?: string | null
          college_name: string
          cover?: string
          created_at?: string
          date: string
          description?: string
          external_id?: string | null
          id?: string
          is_featured?: boolean
          is_government_partnered?: boolean | null
          is_promoted?: boolean
          organizer?: string
          organizer_user_id?: string | null
          pass_settings?: Json | null
          price_from?: number
          status?: string
          tags?: string[] | null
          team_members?: Json | null
          time?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          attendees?: number
          category?: string
          city?: string
          college_id?: string | null
          college_name?: string
          cover?: string
          created_at?: string
          date?: string
          description?: string
          external_id?: string | null
          id?: string
          is_featured?: boolean
          is_government_partnered?: boolean | null
          is_promoted?: boolean
          organizer?: string
          organizer_user_id?: string | null
          pass_settings?: Json | null
          price_from?: number
          status?: string
          tags?: string[] | null
          team_members?: Json | null
          time?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          channel: string
          college_id: string
          created_at: string
          id: string
          message_content: string
          scheduled_at: string | null
          status: string
          target_segment: string
          title: string
        }
        Insert: {
          channel: string
          college_id: string
          created_at?: string
          id?: string
          message_content: string
          scheduled_at?: string | null
          status?: string
          target_segment: string
          title: string
        }
        Update: {
          channel?: string
          college_id?: string
          created_at?: string
          id?: string
          message_content?: string
          scheduled_at?: string | null
          status?: string
          target_segment?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaigns_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean | null
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          shipping_address: string | null
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          shipping_address?: string | null
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          shipping_address?: string | null
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_brands: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          bank_reference: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          organizer_user_id: string
          processed_at: string | null
          status: string
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          organizer_user_id: string
          processed_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          organizer_user_id?: string
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      platform_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      razorpay_orders: {
        Row: {
          amount_paise: number
          coins_to_credit: number
          created_at: string
          credited_at: string | null
          currency: string
          id: string
          notes: Json | null
          paid_at: string | null
          purpose: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: Database["public"]["Enums"]["razorpay_order_status"]
          user_id: string
        }
        Insert: {
          amount_paise: number
          coins_to_credit: number
          created_at?: string
          credited_at?: string | null
          currency?: string
          id?: string
          notes?: Json | null
          paid_at?: string | null
          purpose?: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["razorpay_order_status"]
          user_id: string
        }
        Update: {
          amount_paise?: number
          coins_to_credit?: number
          created_at?: string
          credited_at?: string | null
          currency?: string
          id?: string
          notes?: Json | null
          paid_at?: string | null
          purpose?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["razorpay_order_status"]
          user_id?: string
        }
        Relationships: []
      }
      recent_activity: {
        Row: {
          created_at: string
          description: string
          event_id: string | null
          id: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_activity_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_booth_visits: {
        Row: {
          booth_coords_x: number | null
          booth_coords_y: number | null
          booth_id: string | null
          created_at: string
          event_id: string
          id: string
          sponsor_user_id: string
          student_user_id: string
        }
        Insert: {
          booth_coords_x?: number | null
          booth_coords_y?: number | null
          booth_id?: string | null
          created_at?: string
          event_id: string
          id?: string
          sponsor_user_id: string
          student_user_id: string
        }
        Update: {
          booth_coords_x?: number | null
          booth_coords_y?: number | null
          booth_id?: string | null
          created_at?: string
          event_id?: string
          id?: string
          sponsor_user_id?: string
          student_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_booth_visits_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_proposals: {
        Row: {
          amount: number
          company_user_id: string
          created_at: string
          event_id: string
          id: string
          message: string
          status: string
          tier: string
        }
        Insert: {
          amount?: number
          company_user_id: string
          created_at?: string
          event_id: string
          id?: string
          message?: string
          status?: string
          tier: string
        }
        Update: {
          amount?: number
          company_user_id?: string
          created_at?: string
          event_id?: string
          id?: string
          message?: string
          status?: string
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_proposals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          college_id: string | null
          created_at: string
          full_name: string | null
          id: string
          interests: string[] | null
          is_public: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_public?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_rules: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean | null
          percentage: number
          state: string | null
          tax_type: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          percentage: number
          state?: string | null
          tax_type: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          percentage?: number
          state?: string | null
          tax_type?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          name: string
          organization: string
          rating: number | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name: string
          organization: string
          rating?: number | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name?: string
          organization?: string
          rating?: number | null
          role?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          code: string
          created_at: string
          event_id: string
          id: string
          scanned_at: string | null
          tier: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          event_id: string
          id?: string
          scanned_at?: string | null
          tier?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          event_id?: string
          id?: string
          scanned_at?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      university_api_keys: {
        Row: {
          api_key_hash: string
          college_id: string
          created_at: string
          id: string
          label: string
          last_used_at: string | null
          scopes: string[] | null
        }
        Insert: {
          api_key_hash: string
          college_id: string
          created_at?: string
          id?: string
          label: string
          last_used_at?: string | null
          scopes?: string[] | null
        }
        Update: {
          api_key_hash?: string
          college_id?: string
          created_at?: string
          id?: string
          label?: string
          last_used_at?: string | null
          scopes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "university_api_keys_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_api_keys_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_payouts: {
        Row: {
          amount: number
          created_at: string
          event_id: string
          id: string
          scheduled_at: string | null
          status: string
          tax_amount: number | null
          vendor_id_number: string | null
          vendor_name: string
        }
        Insert: {
          amount: number
          created_at?: string
          event_id: string
          id?: string
          scheduled_at?: string | null
          status?: string
          tax_amount?: number | null
          vendor_id_number?: string | null
          vendor_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string
          id?: string
          scheduled_at?: string | null
          status?: string
          tax_amount?: number | null
          vendor_id_number?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payouts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteers: {
        Row: {
          created_at: string
          event_id: string
          id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount_coins: number
          balance_after: number
          counterparty_user_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          type: Database["public"]["Enums"]["wallet_tx_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount_coins: number
          balance_after: number
          counterparty_user_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          type: Database["public"]["Enums"]["wallet_tx_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount_coins?: number
          balance_after?: number
          counterparty_user_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          type?: Database["public"]["Enums"]["wallet_tx_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_coins: number
          created_at: string
          held_coins: number
          id: string
          lifetime_credited: number
          lifetime_debited: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_coins?: number
          created_at?: string
          held_coins?: number
          id?: string
          lifetime_credited?: number
          lifetime_debited?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_coins?: number
          created_at?: string
          held_coins?: number
          id?: string
          lifetime_credited?: number
          lifetime_debited?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          college_id: string
          created_at: string
          events: string[]
          id: string
          is_active: boolean | null
          secret: string
          url: string
        }
        Insert: {
          college_id: string
          created_at?: string
          events: string[]
          id?: string
          is_active?: boolean | null
          secret: string
          url: string
        }
        Update: {
          college_id?: string
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean | null
          secret?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhooks_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "institutional_analytics"
            referencedColumns: ["college_id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          amount_coins: number
          amount_inr_paise: number
          bank_account_name: string
          bank_account_number: string
          bank_ifsc: string
          created_at: string
          id: string
          notes: string | null
          payout_reference: string | null
          processed_at: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["withdrawal_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_coins: number
          amount_inr_paise: number
          bank_account_name: string
          bank_account_number: string
          bank_ifsc: string
          created_at?: string
          id?: string
          notes?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_coins?: number
          amount_inr_paise?: number
          bank_account_name?: string
          bank_account_number?: string
          bank_ifsc?: string
          created_at?: string
          id?: string
          notes?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      institutional_analytics: {
        Row: {
          active_subscriptions: number | null
          college_id: string | null
          college_name: string | null
          total_events: number | null
          total_footfall: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_college_admin: {
        Args: { _college_id: string; _user_id: string }
        Returns: boolean
      }
      is_college_member: {
        Args: { _college_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      log_activity: {
        Args: {
          _description: string
          _event_id?: string
          _metadata?: Json
          _title: string
          _type: string
          _user_id?: string
        }
        Returns: string
      }
      wallet_credit: {
        Args: {
          _amount_coins: number
          _counterparty?: string
          _description?: string
          _metadata?: Json
          _reference_id?: string
          _reference_type?: string
          _type: Database["public"]["Enums"]["wallet_tx_type"]
          _user_id: string
        }
        Returns: string
      }
      wallet_debit: {
        Args: {
          _amount_coins: number
          _counterparty?: string
          _description?: string
          _metadata?: Json
          _reference_id?: string
          _reference_type?: string
          _type: Database["public"]["Enums"]["wallet_tx_type"]
          _user_id: string
        }
        Returns: string
      }
      wallet_transfer: {
        Args: {
          _amount_coins: number
          _credit_type: Database["public"]["Enums"]["wallet_tx_type"]
          _debit_type: Database["public"]["Enums"]["wallet_tx_type"]
          _description?: string
          _from_user: string
          _metadata?: Json
          _reference_id?: string
          _reference_type?: string
          _to_user: string
        }
        Returns: Json
      }
    }
    Enums: {
      admin_rank: "Moderator" | "Organizer" | "Admin" | "Superadmin"
      app_role: "student" | "college" | "company"
      college_internal_role: "admin" | "coordinator" | "ticket_poc" | "member"
      college_status: "pending" | "approved" | "rejected"
      razorpay_order_status: "created" | "paid" | "failed" | "refunded"
      wallet_tx_type:
        | "topup"
        | "purchase"
        | "sale"
        | "refund"
        | "sponsorship"
        | "sponsorship_received"
        | "withdrawal"
        | "withdrawal_hold"
        | "withdrawal_release"
        | "admin_adjustment"
      withdrawal_status: "pending" | "approved" | "rejected" | "processed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_rank: ["Moderator", "Organizer", "Admin", "Superadmin"],
      app_role: ["student", "college", "company"],
      college_internal_role: ["admin", "coordinator", "ticket_poc", "member"],
      college_status: ["pending", "approved", "rejected"],
      razorpay_order_status: ["created", "paid", "failed", "refunded"],
      wallet_tx_type: [
        "topup",
        "purchase",
        "sale",
        "refund",
        "sponsorship",
        "sponsorship_received",
        "withdrawal",
        "withdrawal_hold",
        "withdrawal_release",
        "admin_adjustment",
      ],
      withdrawal_status: ["pending", "approved", "rejected", "processed"],
    },
  },
} as const
