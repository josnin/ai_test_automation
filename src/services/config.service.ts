import { Injectable, signal, effect } from '@angular/core';
import { AppConfig } from '../types/test-generation';

const DEFAULT_PROMPT = `You are an expert in Robot Framework. Your task is to generate a complete and valid Robot Framework test suite file (.robot).
Use the provided images of web pages and user instructions to create test cases.
Identify UI elements from the images and use descriptive, human-readable names for keywords and variables.
Generate keywords in the "*** Keywords ***" section for reusable actions.
The final output should be ONLY the Robot Framework code, starting with "*** Settings ***". Do not include any other explanations or markdown formatting.`;

const DEFAULTS: AppConfig = {
  model: 'gemini-2.5-flash',
  systemPrompt: DEFAULT_PROMPT,
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly CONFIG_KEY = 'roboGeniusConfig';
  private configSignal = signal<AppConfig>(this.loadFromLocalStorage());
  
  // Public readonly signal
  public readonly config = this.configSignal.asReadonly();

  constructor() {
    // Effect to save to localStorage whenever the signal changes
    effect(() => {
      this.saveToLocalStorage(this.configSignal());
    });
  }

  private loadFromLocalStorage(): AppConfig {
    try {
      const storedConfig = localStorage.getItem(this.CONFIG_KEY);
      if (storedConfig) {
        return { ...DEFAULTS, ...JSON.parse(storedConfig) };
      }
    } catch (e) {
      console.error('Failed to load config from localStorage', e);
    }
    return DEFAULTS;
  }

  private saveToLocalStorage(config: AppConfig): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  }

  public getConfig(): AppConfig {
    return this.configSignal();
  }

  public updateConfig(newConfig: Partial<AppConfig>): void {
    this.configSignal.update(currentConfig => ({ ...currentConfig, ...newConfig }));
  }
}
