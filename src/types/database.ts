export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _JoinedEvents: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_JoinedEvents_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_JoinedEvents_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Attendee: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          userId: string
        }
        Insert: {
          createdAt?: string
          eventId: string
          id: string
          userId: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Attendee_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Attendee_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ChatMessage: {
        Row: {
          content: string
          createdAt: string
          eventId: string
          id: string
          isPinned: boolean
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          eventId: string
          id: string
          isPinned?: boolean
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          eventId?: string
          id?: string
          isPinned?: boolean
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChatMessage_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChatMessage_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ChatSettings: {
        Row: {
          allowGuestMessages: boolean
          banList: Json | null
          createdAt: string
          eventId: string
          id: string
          isEnabled: boolean
          muteList: Json | null
          requireModeration: boolean
          slowMode: boolean
          slowModeInterval: number
          updatedAt: string
        }
        Insert: {
          allowGuestMessages?: boolean
          banList?: Json | null
          createdAt?: string
          eventId: string
          id: string
          isEnabled?: boolean
          muteList?: Json | null
          requireModeration?: boolean
          slowMode?: boolean
          slowModeInterval?: number
          updatedAt?: string
        }
        Update: {
          allowGuestMessages?: boolean
          banList?: Json | null
          createdAt?: string
          eventId?: string
          id?: string
          isEnabled?: boolean
          muteList?: Json | null
          requireModeration?: boolean
          slowMode?: boolean
          slowModeInterval?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChatSettings_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Comment: {
        Row: {
          content: string
          createdAt: string
          id: string
          postId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          postId: string
          updatedAt: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          postId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Event: {
        Row: {
          allowChat: boolean
          allowComments: boolean
          allowLikes: boolean
          allowPosts: boolean
          coverImage: string | null
          createdAt: string
          dateTime: string
          description: string | null
          hostId: string
          id: string
          isDisabled: boolean
          isPrivate: boolean
          location: string | null
          name: string
          qrCodeUrl: string | null
          slug: string | null
          type: string
          updatedAt: string
        }
        Insert: {
          allowChat?: boolean
          allowComments?: boolean
          allowLikes?: boolean
          allowPosts?: boolean
          coverImage?: string | null
          createdAt?: string
          dateTime: string
          description?: string | null
          hostId: string
          id: string
          isDisabled?: boolean
          isPrivate?: boolean
          location?: string | null
          name: string
          qrCodeUrl?: string | null
          slug?: string | null
          type: string
          updatedAt: string
        }
        Update: {
          allowChat?: boolean
          allowComments?: boolean
          allowLikes?: boolean
          allowPosts?: boolean
          coverImage?: string | null
          createdAt?: string
          dateTime?: string
          description?: string | null
          hostId?: string
          id?: string
          isDisabled?: boolean
          isPrivate?: boolean
          location?: string | null
          name?: string
          qrCodeUrl?: string | null
          slug?: string | null
          type?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Event_hostId_fkey"
            columns: ["hostId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      EventActivity: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          type: Database["public"]["Enums"]["EventActivityType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          eventId: string
          id: string
          type: Database["public"]["Enums"]["EventActivityType"]
          userId: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          type?: Database["public"]["Enums"]["EventActivityType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventActivity_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventActivity_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      EventRole: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Insert: {
          createdAt?: string
          eventId: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          role?: Database["public"]["Enums"]["Role"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventRole_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventRole_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Follow: {
        Row: {
          createdAt: string
          followerId: string
          followingId: string
          id: string
        }
        Insert: {
          createdAt?: string
          followerId: string
          followingId: string
          id: string
        }
        Update: {
          createdAt?: string
          followerId?: string
          followingId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Follow_followerId_fkey"
            columns: ["followerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Follow_followingId_fkey"
            columns: ["followingId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Like: {
        Row: {
          createdAt: string
          id: string
          postId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          postId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Like_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Like_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Post: {
        Row: {
          caption: string | null
          createdAt: string
          eventId: string
          id: string
          mediaType: string | null
          mediaUrl: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          caption?: string | null
          createdAt?: string
          eventId: string
          id: string
          mediaType?: string | null
          mediaUrl?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          caption?: string | null
          createdAt?: string
          eventId?: string
          id?: string
          mediaType?: string | null
          mediaUrl?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Post_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Post_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          allowFollowers: boolean
          avatarUrl: string | null
          bio: string | null
          createdAt: string
          dob: string | null
          email: string | null
          id: string
          isAnonymous: boolean
          lastActive: string
          name: string | null
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          username: string | null
        }
        Insert: {
          allowFollowers?: boolean
          avatarUrl?: string | null
          bio?: string | null
          createdAt?: string
          dob?: string | null
          email?: string | null
          id: string
          isAnonymous?: boolean
          lastActive?: string
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          username?: string | null
        }
        Update: {
          allowFollowers?: boolean
          avatarUrl?: string | null
          bio?: string | null
          createdAt?: string
          dob?: string | null
          email?: string | null
          id?: string
          isAnonymous?: boolean
          lastActive?: string
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      EventActivityType:
        | "JOIN"
        | "LEAVE"
        | "POST"
        | "LIKE"
        | "COMMENT"
        | "DELETE"
        | "REPORT"
      Role: "ADMIN" | "MODERATOR" | "MEMBER"
      UserRole: "ADMIN" | "USER" | "PARTNER" | "MEMBER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
