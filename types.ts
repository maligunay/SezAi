export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
  sources?: GroundingSource[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string; // 'application/pdf' | 'text/plain'
  data: string; // Base64 string
}

// Interface for the Logger Service to simulate DB structure
export interface ChatLog {
  sessionId: string;
  userId?: string; // Anonymous or logged in
  userAgent: string;
  ipAddress?: string; // Would be captured by backend
  conversation: {
    role: string;
    content: string;
    timestamp: string;
  }[];
  metadata: {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    platform: string;
  }
}