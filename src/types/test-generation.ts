export interface Page {
  id: string;
  name: string;
  imageUrl: string;
  instructions: string;
  robotCode: string | null;
  status: 'idle' | 'loading' | 'generated' | 'error';
  errorMessage?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  baseUrl: string;
  pageIds: string[];
}

export interface E2EFlow {
  id: string;
  name: string;
  delayBetweenSuites: number; // in milliseconds
  retries: number;
  suiteIds: string[]; // Order is important
}

export interface AppConfig {
  model: string;
  systemPrompt: string;
}