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
      _VendorTiers: {
        Row: {
          A: string;
          B: number;
        };
        Insert: {
          A: string;
          B: number;
        };
        Update: {
          A?: string;
          B?: number;
        };
        Relationships: [
          {
            foreignKeyName: "_VendorTiers_A_fkey";
            columns: ["A"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "_VendorTiers_B_fkey";
            columns: ["B"];
            isOneToOne: false;
            referencedRelation: "VendorTier";
            referencedColumns: ["id"];
          },
        ];
      };
      Analytics: {
        Row: {
          createdAt: string;
          dimensions: Json | null;
          eventId: string | null;
          id: string;
          metric: string;
          publicId: string;
          type: Database["public"]["Enums"]["AnalyticsType"];
          userId: string | null;
          value: number;
          vendorId: string | null;
        };
        Insert: {
          createdAt?: string;
          dimensions?: Json | null;
          eventId?: string | null;
          id: string;
          metric: string;
          publicId: string;
          type: Database["public"]["Enums"]["AnalyticsType"];
          userId?: string | null;
          value: number;
          vendorId?: string | null;
        };
        Update: {
          createdAt?: string;
          dimensions?: Json | null;
          eventId?: string | null;
          id?: string;
          metric?: string;
          publicId?: string;
          type?: Database["public"]["Enums"]["AnalyticsType"];
          userId?: string | null;
          value?: number;
          vendorId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Analytics_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Analytics_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Analytics_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      Attendee: {
        Row: {
          createdAt: string;
          eventId: string;
          id: string;
          publicId: string;
          status: Database["public"]["Enums"]["AttendeeStatus"];
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventId: string;
          id: string;
          publicId: string;
          status?: Database["public"]["Enums"]["AttendeeStatus"];
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventId?: string;
          id?: string;
          publicId?: string;
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
      Booking: {
        Row: {
          createdAt: string;
          date: string;
          id: string;
          notes: string | null;
          packageId: string | null;
          publicId: string;
          status: Database["public"]["Enums"]["BookingStatus"];
          timeSlot: string;
          updatedAt: string;
          userId: string;
          vendorId: string;
        };
        Insert: {
          createdAt?: string;
          date: string;
          id: string;
          notes?: string | null;
          packageId?: string | null;
          publicId: string;
          status?: Database["public"]["Enums"]["BookingStatus"];
          timeSlot: string;
          updatedAt: string;
          userId: string;
          vendorId: string;
        };
        Update: {
          createdAt?: string;
          date?: string;
          id?: string;
          notes?: string | null;
          packageId?: string | null;
          publicId?: string;
          status?: Database["public"]["Enums"]["BookingStatus"];
          timeSlot?: string;
          updatedAt?: string;
          userId?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Booking_packageId_fkey";
            columns: ["packageId"];
            isOneToOne: false;
            referencedRelation: "VendorPackage";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Booking_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Booking_vendorId_fkey";
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
          publicId: string;
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
          publicId: string;
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
          publicId?: string;
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
          portfolioItemId: string | null;
          postId: string;
          publicId: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          id: string;
          portfolioItemId?: string | null;
          postId: string;
          publicId: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          id?: string;
          portfolioItemId?: string | null;
          postId?: string;
          publicId?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Comment_portfolioItemId_fkey";
            columns: ["portfolioItemId"];
            isOneToOne: false;
            referencedRelation: "PortfolioItem";
            referencedColumns: ["id"];
          },
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
      ContactGroup: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          publicId: string;
          updatedAt: string;
          vendorId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          name: string;
          publicId: string;
          updatedAt: string;
          vendorId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          publicId?: string;
          updatedAt?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ContactGroup_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
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
          city: string | null;
          coordinates: Json | null;
          country: string | null;
          coverImage: string | null;
          createdAt: string;
          dateTime: string;
          description: string | null;
          fee: number | null;
          hostId: string;
          id: string;
          isDisabled: boolean;
          isPaid: boolean;
          isPrivate: boolean;
          location: string | null;
          name: string;
          pinCode: string | null;
          publicId: string;
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
          city?: string | null;
          coordinates?: Json | null;
          country?: string | null;
          coverImage?: string | null;
          createdAt?: string;
          dateTime: string;
          description?: string | null;
          fee?: number | null;
          hostId: string;
          id: string;
          isDisabled?: boolean;
          isPaid?: boolean;
          isPrivate?: boolean;
          location?: string | null;
          name: string;
          pinCode?: string | null;
          publicId: string;
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
          city?: string | null;
          coordinates?: Json | null;
          country?: string | null;
          coverImage?: string | null;
          createdAt?: string;
          dateTime?: string;
          description?: string | null;
          fee?: number | null;
          hostId?: string;
          id?: string;
          isDisabled?: boolean;
          isPaid?: boolean;
          isPrivate?: boolean;
          location?: string | null;
          name?: string;
          pinCode?: string | null;
          publicId?: string;
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
          publicId: string;
          type: Database["public"]["Enums"]["EventActivityType"];
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventId: string;
          id: string;
          publicId: string;
          type: Database["public"]["Enums"]["EventActivityType"];
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventId?: string;
          id?: string;
          publicId?: string;
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
      EventTeam: {
        Row: {
          eventId: string;
          id: string;
          name: string;
          publicId: string;
        };
        Insert: {
          eventId: string;
          id: string;
          name: string;
          publicId: string;
        };
        Update: {
          eventId?: string;
          id?: string;
          name?: string;
          publicId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventTeam_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
        ];
      };
      EventTeamMember: {
        Row: {
          createdAt: string;
          eventTeamId: string;
          id: string;
          publicId: string;
          role: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          eventTeamId: string;
          id: string;
          publicId: string;
          role: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          eventTeamId?: string;
          id?: string;
          publicId?: string;
          role?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventTeamMember_eventTeamId_fkey";
            columns: ["eventTeamId"];
            isOneToOne: false;
            referencedRelation: "EventTeam";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "EventTeamMember_userId_fkey";
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
          publicId: string;
          status: Database["public"]["Enums"]["VendorStatus"];
          vendorId: string;
        };
        Insert: {
          eventId: string;
          id: string;
          notes?: string | null;
          publicId: string;
          status?: Database["public"]["Enums"]["VendorStatus"];
          vendorId: string;
        };
        Update: {
          eventId?: string;
          id?: string;
          notes?: string | null;
          publicId?: string;
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
          publicId: string;
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
          publicId: string;
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
          publicId?: string;
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
          publicId: string;
        };
        Insert: {
          createdAt?: string;
          followerId: string;
          followingId: string;
          id: string;
          publicId: string;
        };
        Update: {
          createdAt?: string;
          followerId?: string;
          followingId?: string;
          id?: string;
          publicId?: string;
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
          publicId: string;
          requestorId: string;
          targetUserId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          publicId: string;
          requestorId: string;
          targetUserId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          publicId?: string;
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
          publicId: string;
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
          publicId: string;
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
          publicId?: string;
          status?: Database["public"]["Enums"]["NewsletterStatus"] | null;
          subject?: string | null;
          type?: Database["public"]["Enums"]["FormsType"];
          updatedAt?: string;
          userId?: string | null;
        };
        Relationships: [];
      };
      Invitation: {
        Row: {
          createdAt: string;
          id: string;
          inviteeEmail: string | null;
          inviteeId: string | null;
          inviterId: string;
          publicId: string;
          role: string | null;
          status: Database["public"]["Enums"]["InvitationStatus"];
          type: Database["public"]["Enums"]["InvitationType"];
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          inviteeEmail?: string | null;
          inviteeId?: string | null;
          inviterId: string;
          publicId: string;
          role?: string | null;
          status?: Database["public"]["Enums"]["InvitationStatus"];
          type: Database["public"]["Enums"]["InvitationType"];
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          inviteeEmail?: string | null;
          inviteeId?: string | null;
          inviterId?: string;
          publicId?: string;
          role?: string | null;
          status?: Database["public"]["Enums"]["InvitationStatus"];
          type?: Database["public"]["Enums"]["InvitationType"];
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Invitation_inviteeId_fkey";
            columns: ["inviteeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Invitation_inviterEvent_fkey";
            columns: ["inviterId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Invitation_inviterUser_fkey";
            columns: ["inviterId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Invitation_inviterVendor_fkey";
            columns: ["inviterId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      Like: {
        Row: {
          createdAt: string;
          id: string;
          portfolioItemId: string | null;
          postId: string;
          publicId: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          portfolioItemId?: string | null;
          postId: string;
          publicId: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          portfolioItemId?: string | null;
          postId?: string;
          publicId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Like_portfolioItemId_fkey";
            columns: ["portfolioItemId"];
            isOneToOne: false;
            referencedRelation: "PortfolioItem";
            referencedColumns: ["id"];
          },
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
      message_reactions: {
        Row: {
          createdAt: string;
          emoji: string;
          id: string;
          messageId: string;
          publicId: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          emoji: string;
          id: string;
          messageId: string;
          publicId: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          emoji?: string;
          id?: string;
          messageId?: string;
          publicId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_reactions_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_reactions_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          createdAt: string;
          eventId: string;
          id: string;
          isPinned: boolean;
          publicId: string;
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
          publicId: string;
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
          publicId?: string;
          status?: Database["public"]["Enums"]["MessageStatus"];
          userId?: string;
          vendorId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      Notification: {
        Row: {
          content: string;
          createdAt: string;
          dismissed: boolean;
          eventId: string | null;
          id: string;
          link: string | null;
          postId: string | null;
          seenAt: string | null;
          subject: string | null;
          type: Database["public"]["Enums"]["NotificationType"];
          updatedAt: string;
          userId: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          dismissed?: boolean;
          eventId?: string | null;
          id: string;
          link?: string | null;
          postId?: string | null;
          seenAt?: string | null;
          subject?: string | null;
          type: Database["public"]["Enums"]["NotificationType"];
          updatedAt: string;
          userId: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          dismissed?: boolean;
          eventId?: string | null;
          id?: string;
          link?: string | null;
          postId?: string | null;
          seenAt?: string | null;
          subject?: string | null;
          type?: Database["public"]["Enums"]["NotificationType"];
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Notification_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Notification_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Notification_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Portfolio: {
        Row: {
          createdAt: string;
          id: string;
          publicId: string;
          updatedAt: string;
          vendorId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          publicId: string;
          updatedAt: string;
          vendorId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          publicId?: string;
          updatedAt?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Portfolio_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      PortfolioItem: {
        Row: {
          createdAt: string;
          description: string | null;
          eventId: string | null;
          id: string;
          portfolioId: string;
          publicId: string;
          tags: string[] | null;
          title: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          description?: string | null;
          eventId?: string | null;
          id: string;
          portfolioId: string;
          publicId: string;
          tags?: string[] | null;
          title: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          description?: string | null;
          eventId?: string | null;
          id?: string;
          portfolioId?: string;
          publicId?: string;
          tags?: string[] | null;
          title?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PortfolioItem_portfolioId_fkey";
            columns: ["portfolioId"];
            isOneToOne: false;
            referencedRelation: "Portfolio";
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
          publicId: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          caption?: string | null;
          createdAt?: string;
          eventId: string;
          id: string;
          publicId: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          caption?: string | null;
          createdAt?: string;
          eventId?: string;
          id?: string;
          publicId?: string;
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
          portfolioItemId: string | null;
          postId: string | null;
          publicId: string;
          type: Database["public"]["Enums"]["MediaType"];
          url: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          order?: number;
          portfolioItemId?: string | null;
          postId?: string | null;
          publicId: string;
          type: Database["public"]["Enums"]["MediaType"];
          url: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          order?: number;
          portfolioItemId?: string | null;
          postId?: string | null;
          publicId?: string;
          type?: Database["public"]["Enums"]["MediaType"];
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PostMedia_portfolioItemId_fkey";
            columns: ["portfolioItemId"];
            isOneToOne: false;
            referencedRelation: "PortfolioItem";
            referencedColumns: ["id"];
          },
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
          publicId: string;
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
          publicId: string;
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
          publicId?: string;
          role?: Database["public"]["Enums"]["UserRole"];
          updatedAt?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      Vendor: {
        Row: {
          aiMetadata: Json | null;
          aiTags: string[] | null;
          category: Database["public"]["Enums"]["VendorCategory"];
          contactEmail: string | null;
          createdAt: string;
          customServices: string[] | null;
          description: string | null;
          id: string;
          location: string | null;
          logoUrl: string | null;
          name: string;
          phone: string | null;
          publicId: string;
          rating: number | null;
          services: Database["public"]["Enums"]["ServiceType"][] | null;
          servingCities: string[] | null;
          totalReviews: number;
          travelFee: number | null;
          travelNotes: string | null;
          travelScope: Database["public"]["Enums"]["TravelScope"];
          updatedAt: string;
          userId: string;
          website: string | null;
        };
        Insert: {
          aiMetadata?: Json | null;
          aiTags?: string[] | null;
          category: Database["public"]["Enums"]["VendorCategory"];
          contactEmail?: string | null;
          createdAt?: string;
          customServices?: string[] | null;
          description?: string | null;
          id: string;
          location?: string | null;
          logoUrl?: string | null;
          name: string;
          phone?: string | null;
          publicId: string;
          rating?: number | null;
          services?: Database["public"]["Enums"]["ServiceType"][] | null;
          servingCities?: string[] | null;
          totalReviews?: number;
          travelFee?: number | null;
          travelNotes?: string | null;
          travelScope?: Database["public"]["Enums"]["TravelScope"];
          updatedAt: string;
          userId: string;
          website?: string | null;
        };
        Update: {
          aiMetadata?: Json | null;
          aiTags?: string[] | null;
          category?: Database["public"]["Enums"]["VendorCategory"];
          contactEmail?: string | null;
          createdAt?: string;
          customServices?: string[] | null;
          description?: string | null;
          id?: string;
          location?: string | null;
          logoUrl?: string | null;
          name?: string;
          phone?: string | null;
          publicId?: string;
          rating?: number | null;
          services?: Database["public"]["Enums"]["ServiceType"][] | null;
          servingCities?: string[] | null;
          totalReviews?: number;
          travelFee?: number | null;
          travelNotes?: string | null;
          travelScope?: Database["public"]["Enums"]["TravelScope"];
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
          publicId: string;
          value: string;
          vendorId: string;
        };
        Insert: {
          id: string;
          key: string;
          publicId: string;
          value: string;
          vendorId: string;
        };
        Update: {
          id?: string;
          key?: string;
          publicId?: string;
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
      VendorContact: {
        Row: {
          company: string | null;
          contactType: Database["public"]["Enums"]["ContactType"];
          createdAt: string;
          customFields: Json | null;
          email: string | null;
          groupId: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          phone: string | null;
          publicId: string;
          tags: string[] | null;
          updatedAt: string;
          userId: string | null;
          vendorId: string;
        };
        Insert: {
          company?: string | null;
          contactType: Database["public"]["Enums"]["ContactType"];
          createdAt?: string;
          customFields?: Json | null;
          email?: string | null;
          groupId?: string | null;
          id: string;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          publicId: string;
          tags?: string[] | null;
          updatedAt: string;
          userId?: string | null;
          vendorId: string;
        };
        Update: {
          company?: string | null;
          contactType?: Database["public"]["Enums"]["ContactType"];
          createdAt?: string;
          customFields?: Json | null;
          email?: string | null;
          groupId?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          publicId?: string;
          tags?: string[] | null;
          updatedAt?: string;
          userId?: string | null;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorContact_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "ContactGroup";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "VendorContact_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "VendorContact_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorOperations: {
        Row: {
          availability: Json | null;
          businessHours: Json | null;
          cancellationRate: number | null;
          completionRate: number | null;
          createdAt: string;
          id: string;
          publicId: string;
          responseTime: number | null;
          updatedAt: string;
          vendorId: string;
        };
        Insert: {
          availability?: Json | null;
          businessHours?: Json | null;
          cancellationRate?: number | null;
          completionRate?: number | null;
          createdAt?: string;
          id: string;
          publicId: string;
          responseTime?: number | null;
          updatedAt: string;
          vendorId: string;
        };
        Update: {
          availability?: Json | null;
          businessHours?: Json | null;
          cancellationRate?: number | null;
          completionRate?: number | null;
          createdAt?: string;
          id?: string;
          publicId?: string;
          responseTime?: number | null;
          updatedAt?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorOperations_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorPackage: {
        Row: {
          basePrice: number;
          description: string | null;
          discountRules: Json | null;
          id: string;
          inclusions: string[] | null;
          name: string;
          price: number | null;
          publicId: string;
          surgePrice: number | null;
          vendorId: string;
        };
        Insert: {
          basePrice: number;
          description?: string | null;
          discountRules?: Json | null;
          id: string;
          inclusions?: string[] | null;
          name: string;
          price?: number | null;
          publicId: string;
          surgePrice?: number | null;
          vendorId: string;
        };
        Update: {
          basePrice?: number;
          description?: string | null;
          discountRules?: Json | null;
          id?: string;
          inclusions?: string[] | null;
          name?: string;
          price?: number | null;
          publicId?: string;
          surgePrice?: number | null;
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
      VendorPageVisit: {
        Row: {
          id: string;
          publicId: string;
          timestamp: string;
          userId: string | null;
          vendorId: string;
        };
        Insert: {
          id: string;
          publicId: string;
          timestamp?: string;
          userId?: string | null;
          vendorId: string;
        };
        Update: {
          id?: string;
          publicId?: string;
          timestamp?: string;
          userId?: string | null;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorPageVisit_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "VendorPageVisit_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorReview: {
        Row: {
          bookingId: string | null;
          comment: string | null;
          id: string;
          publicId: string;
          rating: number;
          userId: string;
          vendorId: string;
        };
        Insert: {
          bookingId?: string | null;
          comment?: string | null;
          id: string;
          publicId: string;
          rating: number;
          userId: string;
          vendorId: string;
        };
        Update: {
          bookingId?: string | null;
          comment?: string | null;
          id?: string;
          publicId?: string;
          rating?: number;
          userId?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorReview_bookingId_fkey";
            columns: ["bookingId"];
            isOneToOne: false;
            referencedRelation: "Booking";
            referencedColumns: ["id"];
          },
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
      VendorTeam: {
        Row: {
          id: string;
          name: string;
          publicId: string;
          vendorId: string;
        };
        Insert: {
          id: string;
          name: string;
          publicId: string;
          vendorId: string;
        };
        Update: {
          id?: string;
          name?: string;
          publicId?: string;
          vendorId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorTeam_vendorId_fkey";
            columns: ["vendorId"];
            isOneToOne: false;
            referencedRelation: "Vendor";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorTeamMember: {
        Row: {
          createdAt: string;
          id: string;
          publicId: string;
          role: string;
          userId: string;
          vendorTeamId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          publicId: string;
          role: string;
          userId: string;
          vendorTeamId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          publicId?: string;
          role?: string;
          userId?: string;
          vendorTeamId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "VendorTeamMember_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "VendorTeamMember_vendorTeamId_fkey";
            columns: ["vendorTeamId"];
            isOneToOne: false;
            referencedRelation: "VendorTeam";
            referencedColumns: ["id"];
          },
        ];
      };
      VendorTier: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_cuid: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_random_string: {
        Args: {
          length: number;
        };
        Returns: string;
      };
      get_counter_base36: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_timestamp_base36: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      AccessType: "DIRECT_PASS" | "PIN_REQUIRED" | "INVITE_ONLY";
      AnalyticsType: "VENDOR" | "EVENT" | "USER";
      AttendeeStatus: "JOINED" | "PENDING" | "APPROVED" | "DENIED";
      BookingStatus:
        | "INQUIRY"
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED";
      ContactType: "USER" | "EXTERNAL";
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
        | "GENERAL"
        | "SUGGESTION";
      FeedbackStatus: "PENDING" | "REVIEWED" | "RESOLVED" | "ARCHIVED";
      FeedbackType:
        | "ACCOUNT_SETUP"
        | "EVENT_EXPERIENCE"
        | "APP_USABILITY"
        | "BUG_REPORT"
        | "FEATURE_REQUEST"
        | "OTHER";
      FormsType: "CONTACT" | "NEWSLETTER";
      InvitationStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
      InvitationType: "USER" | "VENDOR_TEAM" | "EVENT_TEAM";
      MediaType: "IMAGE" | "VIDEO";
      MessageStatus: "SENT" | "DELIVERED" | "READ";
      NewsletterStatus: "APPROVED" | "UNSUBSCRIBED" | "AUTO_ARCHIVED";
      NotificationType:
        | "EVENT_REMINDER"
        | "EVENT_UPDATE"
        | "POST_LIKE"
        | "POST_COMMENT"
        | "NEW_FOLLOWER"
        | "MESSAGE"
        | "SYSTEM"
        | "BOOKING_REQUEST"
        | "BOOKING_CONFIRMED"
        | "BOOKING_CANCELLED"
        | "PAYMENT_RECEIVED"
        | "REVIEW_RECEIVED"
        | "VENDOR_INVITATION"
        | "VENDOR_ACCOUNT_UPDATE"
        | "VENDOR_PERFORMANCE_METRICS"
        | "VENDOR_PROMOTION";
      PriceRange: "BUDGET" | "MIDRANGE" | "LUXURY" | "CUSTOM";
      Role: "ADMIN" | "MODERATOR" | "MEMBER";
      ServiceType:
        | "RECREATION_CENTER"
        | "VENUE_HOSTING"
        | "CATERING"
        | "EVENT_PLANNING"
        | "PHOTOGRAPHY"
        | "VIDEOSGRAPHY"
        | "GRAPHIC_DESIGN"
        | "BRANDING"
        | "CONTENT_CREATION"
        | "DECOR_AND_THEMING"
        | "EQUIPMENT_RENTAL"
        | "TRANSPORTATION"
        | "STAFFING"
        | "HAIR_MAKEUP"
        | "WARDROBE_STYLING"
        | "ENTERTAINMENT"
        | "AV_PRODUCTION"
        | "LIGHTING_SOUND"
        | "LIVE_STREAMING"
        | "DESTINATION_MANAGEMENT"
        | "SUSTAINABILITY_SERVICES";
      TravelScope:
        | "LOCAL_ONLY"
        | "NATIONAL"
        | "INTERNATIONAL"
        | "NATIONAL_AND_INTERNATIONAL";
      UserRole: "ADMIN" | "USER" | "VENDOR" | "PARTNER" | "MEMBER";
      VendorCategory:
        | "INDIVIDUAL"
        | "AGENCY"
        | "VENUE_PROVIDER"
        | "CATERING"
        | "CREATIVE"
        | "RENTAL"
        | "PROFESSIONAL"
        | "OTHER";
      VendorStatus: "PENDING" | "CONTACTED" | "BOOKED" | "DECLINED";
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
