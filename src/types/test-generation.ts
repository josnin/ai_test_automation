export interface AppConfig {
  model: string;
  systemPrompt: string;
}

export interface DocPage {
  image: string; // base64 encoded image
  mimeType: string;
  instructions: string;
}
