export interface SessionProfile {
  userName?: string;
  preferredLanguage?: string;
}

export interface SystemPrompt {
  input: string;
  profile?: SessionProfile;
  rules?: string;
}
