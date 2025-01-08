export interface ChatMessage {
    id: string;
    content: string;
    userId: string;
    eventId: string;
    isPinned: boolean;
    // isHidden: boolean;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      isGuest?: boolean;
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