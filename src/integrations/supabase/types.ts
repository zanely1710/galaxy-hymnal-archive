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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_downloads: {
        Row: {
          downloaded_at: string
          event_id: string
          id: string
          music_sheet_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          event_id: string
          id?: string
          music_sheet_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          event_id?: string
          id?: string
          music_sheet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_downloads_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "music_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_downloads_music_sheet_id_fkey"
            columns: ["music_sheet_id"]
            isOneToOne: false
            referencedRelation: "music_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          music_sheet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          music_sheet_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          music_sheet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_music_sheet_id_fkey"
            columns: ["music_sheet_id"]
            isOneToOne: false
            referencedRelation: "music_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      music_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          is_moderated: boolean | null
          music_sheet_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          is_moderated?: boolean | null
          music_sheet_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          is_moderated?: boolean | null
          music_sheet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_comments_music_sheet_id_fkey"
            columns: ["music_sheet_id"]
            isOneToOne: false
            referencedRelation: "music_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      music_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          stock_limit: number | null
          stock_remaining: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          stock_limit?: number | null
          stock_remaining?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          stock_limit?: number | null
          stock_remaining?: number | null
          title?: string
        }
        Relationships: []
      }
      music_sheets: {
        Row: {
          arranger: string | null
          category_id: string | null
          composer: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          event_id: string | null
          file_url: string | null
          id: string
          is_latest: boolean | null
          parent_id: string | null
          thumbnail_url: string | null
          title: string
          version_number: number | null
        }
        Insert: {
          arranger?: string | null
          category_id?: string | null
          composer?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          event_id?: string | null
          file_url?: string | null
          id?: string
          is_latest?: boolean | null
          parent_id?: string | null
          thumbnail_url?: string | null
          title: string
          version_number?: number | null
        }
        Update: {
          arranger?: string | null
          category_id?: string | null
          composer?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          event_id?: string | null
          file_url?: string | null
          id?: string
          is_latest?: boolean | null
          parent_id?: string | null
          thumbnail_url?: string | null
          title?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "music_sheets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_sheets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "music_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_sheets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "music_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          appearance_mode: string | null
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string | null
          profile_picture_url: string | null
        }
        Insert: {
          appearance_mode?: string | null
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          name?: string | null
          profile_picture_url?: string | null
        }
        Update: {
          appearance_mode?: string | null
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string | null
          profile_picture_url?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          music_sheet_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          music_sheet_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          music_sheet_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_music_sheet_id_fkey"
            columns: ["music_sheet_id"]
            isOneToOne: false
            referencedRelation: "music_sheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      song_requests: {
        Row: {
          admin_notes: string | null
          completed: boolean
          created_at: string
          id: string
          message: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reflections: {
        Row: {
          id: string
          reflection_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          reflection_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          reflection_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reflections_reflection_id_fkey"
            columns: ["reflection_id"]
            isOneToOne: false
            referencedRelation: "reflections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_event_stock: { Args: { event_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_event_active: { Args: { event_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
