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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          blog_post_id: string | null
          category_id: string | null
          id: string
        }
        Insert: {
          blog_post_id?: string | null
          category_id?: string | null
          id?: string
        }
        Update: {
          blog_post_id?: string | null
          category_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          blog_post_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          canonical_url: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_at: string | null
          reading_time: number | null
          schema_markup: Json | null
          slug: string
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
          word_count: number | null
        }
        Insert: {
          author_id: string
          canonical_url?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          schema_markup?: Json | null
          slug: string
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          author_id?: string
          canonical_url?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          schema_markup?: Json | null
          slug?: string
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          category: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      early_access_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          status?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          barcode: string
          created_at: string
          health_score: number | null
          id: string
          product_name: string
          user_id: string
        }
        Insert: {
          barcode: string
          created_at?: string
          health_score?: number | null
          id?: string
          product_name: string
          user_id: string
        }
        Update: {
          barcode?: string
          created_at?: string
          health_score?: number | null
          id?: string
          product_name?: string
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          assigned_by: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          product_barcode: string
          subcategory_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          product_barcode: string
          subcategory_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          product_barcode?: string
          subcategory_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback: {
        Row: {
          barcode: string
          category: string | null
          comment: string | null
          created_at: string
          feedback_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          barcode: string
          category?: string | null
          comment?: string | null
          created_at?: string
          feedback_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          barcode?: string
          category?: string | null
          comment?: string | null
          created_at?: string
          feedback_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          location: string | null
          preferences: Json | null
          quizzes_completed: number | null
          total_score: number | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          location?: string | null
          preferences?: Json | null
          quizzes_completed?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          location?: string | null
          preferences?: Json | null
          quizzes_completed?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string | null
          id: string
          quiz_id: string
          score: number
          time_taken: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          quiz_id: string
          score?: number
          time_taken?: number | null
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          quiz_id?: string
          score?: number
          time_taken?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_attempts_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          question_order: number
          question_text: string
          quiz_id: string
          wrong_answer_1: string
          wrong_answer_2: string
          wrong_answer_3: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          question_order: number
          question_text: string
          quiz_id: string
          wrong_answer_1: string
          wrong_answer_2: string
          wrong_answer_3: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          question_order?: number
          question_text?: string
          quiz_id?: string
          wrong_answer_1?: string
          wrong_answer_2?: string
          wrong_answer_3?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"]
          id: string
          is_published: boolean | null
          prompt: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"]
          id?: string
          is_published?: boolean | null
          prompt: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"]
          id?: string
          is_published?: boolean | null
          prompt?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scan_history: {
        Row: {
          barcode: string
          health_score: number | null
          id: string
          notes: string | null
          product_name: string
          scan_location: string | null
          scanned_at: string
          user_id: string
        }
        Insert: {
          barcode: string
          health_score?: number | null
          id?: string
          notes?: string | null
          product_name: string
          scan_location?: string | null
          scanned_at?: string
          user_id: string
        }
        Update: {
          barcode?: string
          health_score?: number | null
          id?: string
          notes?: string | null
          product_name?: string
          scan_location?: string | null
          scanned_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scanned_products: {
        Row: {
          barcode: string
          concerns: string[] | null
          created_at: string | null
          description: string | null
          health_score: number | null
          id: string
          images: string[] | null
          ingredients: string | null
          is_health_related_product: boolean | null
          is_published: boolean
          name: string
          nutrition_per_100g: Json | null
          other_good_product_suggestions: Json | null
          positives: string[] | null
          recommendations: string[] | null
          retailers: Json | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          barcode: string
          concerns?: string[] | null
          created_at?: string | null
          description?: string | null
          health_score?: number | null
          id?: string
          images?: string[] | null
          ingredients?: string | null
          is_health_related_product?: boolean | null
          is_published?: boolean
          name: string
          nutrition_per_100g?: Json | null
          other_good_product_suggestions?: Json | null
          positives?: string[] | null
          recommendations?: string[] | null
          retailers?: Json | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string
          concerns?: string[] | null
          created_at?: string | null
          description?: string | null
          health_score?: number | null
          id?: string
          images?: string[] | null
          ingredients?: string | null
          is_health_related_product?: boolean | null
          is_published?: boolean
          name?: string
          nutrition_per_100g?: Json | null
          other_good_product_suggestions?: Json | null
          positives?: string[] | null
          recommendations?: string[] | null
          retailers?: Json | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          barcode: string | null
          created_at: string
          id: string
          is_purchased: boolean
          notes: string | null
          product_name: string
          quantity: number
          shopping_list_id: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          created_at?: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          product_name: string
          quantity?: number
          shopping_list_id: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          created_at?: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          product_name?: string
          quantity?: number
          shopping_list_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_shopping_list_items_list_id"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          health_insights: boolean
          id: string
          new_features: boolean
          product_alerts: boolean
          push_notifications: boolean
          quiet_hours: boolean
          scan_reminders: boolean
          social_updates: boolean
          updated_at: string
          user_id: string
          weekly_summary: boolean
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          health_insights?: boolean
          id?: string
          new_features?: boolean
          product_alerts?: boolean
          push_notifications?: boolean
          quiet_hours?: boolean
          scan_reminders?: boolean
          social_updates?: boolean
          updated_at?: string
          user_id: string
          weekly_summary?: boolean
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          health_insights?: boolean
          id?: string
          new_features?: boolean
          product_alerts?: boolean
          push_notifications?: boolean
          quiet_hours?: boolean
          scan_reminders?: boolean
          social_updates?: boolean
          updated_at?: string
          user_id?: string
          weekly_summary?: boolean
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          cloud_backup: boolean
          crash_reporting: boolean
          created_at: string
          id: string
          location_services: boolean
          personalized_ads: boolean
          profile_visibility: string
          updated_at: string
          usage_analytics: boolean
          user_id: string
        }
        Insert: {
          cloud_backup?: boolean
          crash_reporting?: boolean
          created_at?: string
          id?: string
          location_services?: boolean
          personalized_ads?: boolean
          profile_visibility?: string
          updated_at?: string
          usage_analytics?: boolean
          user_id: string
        }
        Update: {
          cloud_backup?: boolean
          crash_reporting?: boolean
          created_at?: string
          id?: string
          location_services?: boolean
          personalized_ads?: boolean
          profile_visibility?: string
          updated_at?: string
          usage_analytics?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      quiz_difficulty: "easy" | "medium" | "hard"
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
      quiz_difficulty: ["easy", "medium", "hard"],
    },
  },
} as const
