export interface ChatMessage {
    id: string;
    content: string;
    isPinned: boolean;
    createdAt: string;
    userId: string;
    eventId: string;
    user: {
      id: string;
      username: string | null;
      avatarUrl: string | null;
      name: string | null;
    };
  }
  
  export interface ChatSettings {
    isEnabled: boolean;
    allowGuestMessages: boolean;
    slowMode: boolean;
    slowModeInterval: number;
    requireModeration: boolean;
  }
  
  export interface ChatState {
    messages: ChatMessage[];
    settings: ChatSettings;
    lastMessageTime?: Date;
  }