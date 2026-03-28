// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'agency';
  alertChannels: {
    email: boolean;
    slack: boolean;
    slackWebhookUrl?: string;
  };
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
