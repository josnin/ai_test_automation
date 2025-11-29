import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { AppConfig, DocPage } from '../types/test-generation';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  // IMPORTANT: The API key must be provided through environment variables.
  // This application assumes 'process.env.API_KEY' is properly configured
  // in the deployment environment. Do not hardcode API keys.
  private ai: GoogleGenAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

  async generateRobotTest(pages: DocPage[], config: AppConfig): Promise<string> {
    if (!pages || pages.length === 0) {
      throw new Error('No document pages provided.');
    }

    const modelInstructions = "Generate a Robot Framework test suite based on the following pages and instructions.";
    
    const parts = pages.flatMap((page, index) => [
      { text: `\n--- Page ${index + 1} Instructions ---\n${page.instructions}` },
      { inlineData: { mimeType: page.mimeType, data: page.image } }
    ]);

    const contents = { parts: [{ text: modelInstructions }, ...parts] };
    
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: config.model,
        contents: contents,
        config: {
          systemInstruction: config.systemPrompt,
        },
      });
      
      const text = response.text.trim();
      
      // Clean up the response to ensure it's valid robot framework code
      return text.replace(/^```robotframework\s*|```$/g, '').trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('The AI model failed to generate a response. Please check your configuration and input.');
    }
  }
}
