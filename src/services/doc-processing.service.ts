import { Injectable, inject } from '@angular/core';
import { Page } from '../types/test-generation';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class DocProcessingService {
  private configService = inject(ConfigService);
  private ai: any;
  private scriptLoadingPromise: Promise<void> | null = null;

  private loadGoogleGenAIScript(): Promise<void> {
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    if ((window as any).genai?.GoogleGenAI) {
      return Promise.resolve();
    }

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@google/genai@1.30.0/dist/index.iife.js';
      script.onload = () => {
        console.log('Google GenAI script loaded successfully.');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load the Google GenAI script.');
        this.scriptLoadingPromise = null;
        reject(new Error('Failed to load the Google GenAI script from CDN. Check network or security policies.'));
      };
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  // Lazily initialize and get the AI client
  private async getAiClient(): Promise<any | undefined> {
    if (this.ai) {
      return this.ai;
    }

    try {
      await this.loadGoogleGenAIScript();

      const apiKey = process.env.API_KEY;
      if (apiKey) {
        const GoogleGenAI = (window as any).genai?.GoogleGenAI;
        if (!GoogleGenAI) {
          throw new Error('GoogleGenAI constructor not found on window object even after script load.');
        }
        this.ai = new GoogleGenAI({ apiKey });
        return this.ai;
      }
      return undefined;
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client.", e);
      throw e;
    }
  }

  async generateTestFromImage(imageFile: File, instructions: string): Promise<string> {
    console.log(`Generating test for: ${imageFile.name}`);
    
    try {
      const aiClient = await this.getAiClient();

      if (!aiClient) {
        console.warn(
          'Google AI API key is not available or client failed to initialize. Test generation will be mocked.'
        );
        await new Promise(resolve => setTimeout(resolve, 1500));
        return this.getMockTest(instructions);
      }

      const config = this.configService.getConfig();
      const imageBase64 = await this.fileToBase64(imageFile);

      const imagePart = {
        inlineData: {
          mimeType: imageFile.type,
          data: imageBase64,
        },
      };

      const textPart = {
        text: `User instructions for this page: "${instructions}"`,
      };
      
      const response = await aiClient.models.generateContent({
        model: config.model,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: config.systemPrompt,
        },
      });

      return response.text;
    } catch (error) {
      console.error(
        `Failed to generate test with Gemini API:`,
        error
      );
      throw new Error(error instanceof Error ? error.message : 'An error occurred while communicating with the AI model.');
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:image/jpeg;base64,"
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  private getMockTest(instructions: string): string {
    return `*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Mock Generated Test Case
    [Documentation]    This is a mock test generated for instructions: ${instructions}
    Open Browser    https://example.com    browser=chrome
    Page Should Contain    Example Domain
    Close Browser
`;
  }
}