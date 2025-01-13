export interface ReactionInfo {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  isPinned: boolean;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  userId: string;
  eventId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  reactions?: ReactionInfo[];
}

export interface Reaction {
  id: string;
  emoji: string;
  messageId: string;
  userId: string;
  createdAt: string;
}

export interface MessageStatus {
  id: string;
  messageId: string;
  userId: string;
  status: 'delivered' | 'read';
  updatedAt: string;
}

export interface ChatSettings {
  isEnabled: boolean;
  allowGuestMessages: boolean;
  slowMode: boolean;
  slowModeInterval: number;
  requireModeration: boolean;
}

export interface ChatStats {
  messages: ChatMessage[];
  settings: ChatSettings;
  lastMessageTime?: Date;
}
