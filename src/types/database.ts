export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      Attendee: {
        Row: {
          createdAt: string;
          eventId: string;
          id: string;
          status: Database["public"]["Enums"]["AttendeeStatus"];
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventId: string;
          id: string;
          status?: Database["public"]["Enums"]["AttendeeStatus"];
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventId?: string;
          id?: string;
          status?: Database["public"]["Enums"]["AttendeeStatus"];
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Attendee_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Attendee_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      ChatMessage: {
        Row: {
          content: string;
          createdAt: string;
          eventId: string;
          id: string;
          isPinned: boolean;
          status: Database["public"]["Enums"]["MessageStatus"];
          userId: string;
          vendorId: string | null;
        };
        Insert: {
          content: string;
          createdAt?: string;
          eventId: string;
          id: string;
          isPinned?: boolean;
          status?: Database["public"]["Enums"]["MessageStatus"];
          userId: string;
          vendorId?: string | null;
        };
        Update: {
          content?: string;
          createdAt?: string;
          eventId?: string;
          id?: string;
          isPinned?: boolean;
          status?: Database["public"]["Enums"]["MessageStatus"];
          userId?: string;
          vendorId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ChatMessage_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ChatMessage_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ChatMessage_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      ChatSettings: {
        Row: {
          allowGuestMessages: boolean;
          banList: Json | null;
          createdAt: string;
          eventId: string;
          id: string;
          isEnabled: boolean;
          muteList: Json | null;
          requireModeration: boolean;
          slowMode: boolean;
          slowModeInterval: number;
          updatedAt: string;
        };
        Insert: {
          allowGuestMessages?: boolean;
          banList?: Json | null;
          createdAt?: string;
          eventId: string;
          id: string;
          isEnabled?: boolean;
          muteList?: Json | null;
          requireModeration?: boolean;
          slowMode?: boolean;
          slowModeInterval?: number;
          updatedAt?: string;
        };
        Update: {
          allowGuestMessages?: boolean;
          banList?: Json | null;
          createdAt?: string;
          eventId?: string;
          id?: string;
          isEnabled?: boolean;
          muteList?: Json | null;
          requireModeration?: boolean;
          slowMode?: boolean;
          slowModeInterval?: number;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ChatSettings_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
        ];
      };
      Comment: {
        Row: {
          content: string;
          createdAt: string;
          id: string;
          postId: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          id: string;
          postId: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          id?: string;
          postId?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Comment_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Comment_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Event: {
        Row: {
          accessType: Database["public"]["Enums"]["AccessType"];
          allowChat: boolean;
          allowComments: boolean;
          allowLikes: boolean;
          allowPosts: boolean;
          coverImage: string | null;
          createdAt: string;
          dateTime: string;
          description: string | null;
          hostId: string;
          id: string;
          isDisabled: boolean;
          isPrivate: boolean;
          location: string | null;
          name: string;
          pinCode: string | null;
          qrCodeUrl: string | null;
          requiresApproval: boolean;
          slug: string | null;
          type: string;
          updatedAt: string;
          vendorBudget: number | null;
          vendorCosts: Json | null;
        };
        Insert: {
          accessType?: Database["public"]["Enums"]["AccessType"];
          allowChat?: boolean;
          allowComments?: boolean;
          allowLikes?: boolean;
          allowPosts?: boolean;
          coverImage?: string | null;
          createdAt?: string;
          dateTime: string;
          description?: string | null;
          hostId: string;
          id: string;
          isDisabled?: boolean;
          isPrivate?: boolean;
          location?: string | null;
          name: string;
          pinCode?: string | null;
          qrCodeUrl?: string | null;
          requiresApproval?: boolean;
          slug?: string | null;
          type: string;
          updatedAt: string;
          vendorBudget?: number | null;
          vendorCosts?: Json | null;
        };
        Update: {
          accessType?: Database["public"]["Enums"]["AccessType"];
          allowChat?: boolean;
          allowComments?: boolean;
          allowLikes?: boolean;
          allowPosts?: boolean;
          coverImage?: string | null;
          createdAt?: string;
          dateTime?: string;
          description?: string | null;
          hostId?: string;
          id?: string;
          isDisabled?: boolean;
          isPrivate?: boolean;
          location?: string | null;
          name?: string;
          pinCode?: string | null;
          qrCodeUrl?: string | null;
          requiresApproval?: boolean;
          slug?: string | null;
          type?: string;
          updatedAt?: string;
          vendorBudget?: number | null;
          vendorCosts?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "Event_hostId_fkey";
            columns: ["hostId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      EventActivity: {
        Row: {
          createdAt: string;
          eventId: string;
          id: string;
          type: Database["public"]["Enums"]["EventActivityType"];
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventId: string;
          id: string;
          type: Database["public"]["Enums"]["EventActivityType"];
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventId?: string;
          id?: string;
          type?: Database["public"]["Enums"]["EventActivityType"];
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventActivity_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "EventActivity_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      EventRole: {
        Row: {
          createdAt: string;
          eventId: string;
          id: string;
          role: Database["public"]["Enums"]["Role"];
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventId: string;
          id: string;
          role: Database["public"]["Enums"]["Role"];
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventId?: string;
          id?: string;
          role?: Database["public"]["Enums"]["Role"];
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventRole_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "EventRole_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      EventVendor: {
        Row: {
          eventId: string;
          id: string;
          notes: string | null;
          status: Database["public"]["Enums"]["VendorStatus"];
          vendorId: string;
        };
        Insert: {
          eventId: string;
          id: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["VendorStatus"];
          vendorId: string;
        };
        Update: {
          eventId?: string;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["VendorStatus"];
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventVendor_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "EventVendor_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      Feedback: {
        Row: {
          category: Database["public"]["Enums"]["FeedbackCategory"];
          createdAt: string;
          id: string;
          message: string | null;
          metadata: Json | null;
          rating: number;
          status: Database["public"]["Enums"]["FeedbackStatus"];
          type: Database["public"]["Enums"]["FeedbackType"];
          updatedAt: string;
          userId: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["FeedbackCategory"];
          createdAt?: string;
          id: string;
          message?: string | null;
          metadata?: Json | null;
          rating: number;
          status?: Database["public"]["Enums"]["FeedbackStatus"];
          type: Database["public"]["Enums"]["FeedbackType"];
          updatedAt: string;
          userId: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["FeedbackCategory"];
          createdAt?: string;
          id?: string;
          message?: string | null;
          metadata?: Json | null;
          rating?: number;
          status?: Database["public"]["Enums"]["FeedbackStatus"];
          type?: Database["public"]["Enums"]["FeedbackType"];
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Feedback_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Follow: {
        Row: {
          createdAt: string;
          followerId: string;
          followingId: string;
          id: string;
        };
        Insert: {
          createdAt?: string;
          followerId: string;
          followingId: string;
          id: string;
        };
        Update: {
          createdAt?: string;
          followerId?: string;
          followingId?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Follow_followerId_fkey";
            columns: ["followerId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Follow_followingId_fkey";
            columns: ["followingId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      FollowRequest: {
        Row: {
          createdAt: string;
          id: string;
          requestorId: string;
          targetUserId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          requestorId: string;
          targetUserId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          requestorId?: string;
          targetUserId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "FollowRequest_requestorId_fkey";
            columns: ["requestorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "FollowRequest_targetUserId_fkey";
            columns: ["targetUserId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Forms: {
        Row: {
          createdAt: string;
          email: string;
          id: string;
          message: string | null;
          name: string | null;
          phone: string | null;
          status: Database["public"]["Enums"]["NewsletterStatus"] | null;
          subject: string | null;
          type: Database["public"]["Enums"]["FormsType"];
          updatedAt: string;
          userId: string | null;
        };
        Insert: {
          createdAt?: string;
          email: string;
          id: string;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          status?: Database["public"]["Enums"]["NewsletterStatus"] | null;
          subject?: string | null;
          type?: Database["public"]["Enums"]["FormsType"];
          updatedAt: string;
          userId?: string | null;
        };
        Update: {
          createdAt?: string;
          email?: string;
          id?: string;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          status?: Database["public"]["Enums"]["NewsletterStatus"] | null;
          subject?: string | null;
          type?: Database["public"]["Enums"]["FormsType"];
          updatedAt?: string;
          userId?: string | null;
        };
        Relationships: [];
      };
      Like: {
        Row: {
          createdAt: string;
          id: string;
          postId: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          postId: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          postId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Like_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Like_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      MessageReaction: {
        Row: {
          createdAt: string;
          emoji: string;
          id: string;
          messageId: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          emoji: string;
          id: string;
          messageId: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          emoji?: string;
          id?: string;
          messageId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "MessageReaction_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "ChatMessage";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "MessageReaction_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Post: {
        Row: {
          caption: string | null;
          createdAt: string;
          eventId: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          caption?: string | null;
          createdAt?: string;
          eventId: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          caption?: string | null;
          createdAt?: string;
          eventId?: string;
          id?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Post_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Post_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      PostMedia: {
        Row: {
          createdAt: string;
          id: string;
          order: number;
          postId: string;
          type: Database["public"]["Enums"]["MediaType"];
          url: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          order?: number;
          postId: string;
          type: Database["public"]["Enums"]["MediaType"];
          url: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          order?: number;
          postId?: string;
          type?: Database["public"]["Enums"]["MediaType"];
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PostMedia_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          allowFollowers: boolean;
          avatarUrl: string | null;
          bio: string | null;
          createdAt: string;
          dob: string | null;
          email: string | null;
          id: string;
          isAnonymous: boolean;
          isPrivateProfile: boolean;
          lastActive: string;
          name: string | null;
          role: Database["public"]["Enums"]["UserRole"];
          updatedAt: string;
          username: string | null;
        };
        Insert: {
          allowFollowers?: boolean;
          avatarUrl?: string | null;
          bio?: string | null;
          createdAt?: string;
          dob?: string | null;
          email?: string | null;
          id: string;
          isAnonymous?: boolean;
          isPrivateProfile?: boolean;
          lastActive?: string;
          name?: string | null;
          role?: Database["public"]["Enums"]["UserRole"];
          updatedAt: string;
          username?: string | null;
        };
        Update: {
          allowFollowers?: boolean;
          avatarUrl?: string | null;
          bio?: string | null;
          createdAt?: string;
          dob?: string | null;
          email?: string | null;
          id?: string;
          isAnonymous?: boolean;
          isPrivateProfile?: boolean;
          lastActive?: string;
          name?: string | null;
          role?: Database["public"]["Enums"]["UserRole"];
          updatedAt?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      Vendor: {
        Row: {
          aiMetadata: Json | null;
          contactEmail: string | null;
          createdAt: string;
          id: string;
          location: string | null;
          name: string;
          phone: string | null;
          priceRange: Database["public"]["Enums"]["PriceRange"];
          rating: number | null;
          services: string[] | null;
          type: Database["public"]["Enums"]["VendorType"];
          updatedAt: string;
          userId: string;
          website: string | null;
        };
        Insert: {
          aiMetadata?: Json | null;
          contactEmail?: string | null;
          createdAt?: string;
          id: string;
          location?: string | null;
          name: string;
          phone?: string | null;
          priceRange: Database["public"]["Enums"]["PriceRange"];
          rating?: number | null;
          services?: string[] | null;
          type: Database["public"]["Enums"]["VendorType"];
          updatedAt: string;
          userId: string;
          website?: string | null;
        };
        Update: {
          aiMetadata?: Json | null;
          contactEmail?: string | null;
          createdAt?: string;
          id?: string;
          location?: string | null;
          name?: string;
          phone?: string | null;
          priceRange?: Database["public"]["Enums"]["PriceRange"];
          rating?: number | null;
          services?: string[] | null;
          type?: Database["public"]["Enums"]["VendorType"];
          updatedAt?: string;
          userId?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Vendor_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorAttribute: {
        Row: {
          id: string;
          key: string;
          value: string;
          vendorId: string;
        };
        Insert: {
          id: string;
          key: string;
          value: string;
          vendorId: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorAttribute_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorPackage: {
        Row: {
          description: string | null;
          id: string;
          inclusions: string[] | null;
          name: string;
          price: number | null;
          vendorId: string;
        };
        Insert: {
          description?: string | null;
          id: string;
          inclusions?: string[] | null;
          name: string;
          price?: number | null;
          vendorId: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          inclusions?: string[] | null;
          name?: string;
          price?: number | null;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorPackage_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorReview: {
        Row: {
          comment: string | null;
          id: string;
          rating: number;
          userId: string;
          vendorId: string;
        };
        Insert: {
          comment?: string | null;
          id: string;
          rating: number;
          userId: string;
          vendorId: string;
        };
        Update: {
          comment?: string | null;
          id?: string;
          rating?: number;
          userId?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorReview_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "VendorReview_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      AccessType: "DIRECT_PASS" | "PIN_REQUIRED" | "INVITE_ONLY";
      AttendeeStatus: "JOINED" | "PENDING" | "APPROVED" | "DENIED";
      EventActivityType:
        | "JOIN"
        | "LEAVE"
        | "POST"
        | "LIKE"
        | "COMMENT"
        | "DELETE"
        | "REPORT"
        | "RESQUEST_PENDING"
        | "ACCESS_DENIED"
        | "ACCESS_GRANTED";
      FeedbackCategory:
        | "UI_UX"
        | "PERFORMANCE"
        | "FUNCTIONALITY"
        | "CONTENT"
        | "TECHNICAL"
        | "GENERAL";
      FeedbackStatus: "PENDING" | "REVIEWED" | "RESOLVED" | "ARCHIVED";
      FeedbackType:
        | "ACCOUNT_SETUP"
        | "EVENT_EXPERIENCE"
        | "APP_USABILITY"
        | "BUG_REPORT"
        | "FEATURE_REQUEST"
        | "OTHER";
      FormsType: "CONTACT" | "NEWSLETTER";
      MediaType: "IMAGE" | "VIDEO";
      MessageStatus: "SENT" | "DELIVERED" | "READ";
      NewsletterStatus: "APPROVED" | "UNSUBSCRIBED" | "AUTO_ARCHIVED";
      PriceRange: "BUDGET" | "MIDRANGE" | "LUXURY" | "CUSTOM";
      Role: "ADMIN" | "MODERATOR" | "MEMBER";
      UserRole: "ADMIN" | "USER" | "PARTNER" | "MEMBER";
      VendorStatus: "PENDING" | "CONTACTED" | "BOOKED" | "DECLINED";
      VendorType:
        | "VENUE"
        | "CATERER"
        | "PHOTOGRAPHER"
        | "VIDEOGRAPHER"
        | "ENTERTAINMENT"
        | "DECOR"
        | "TRANSPORTATION"
        | "PLANNER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
