import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from '../types/test-generation';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private http = inject(HttpClient);

  async generateRobotTest(file: File, config: AppConfig): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('config', JSON.stringify(config));

    // In a real application, you would replace this with your actual backend endpoint.
    const backendUrl = '/api/generate-test-suite';

    try {
      // The following is a placeholder for a real backend API call.
      // Since we don't have a live backend, we'll simulate the network delay
      // and return a mock response.

      console.log(`Simulating POST request to ${backendUrl} with file: ${file.name}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      const mockResponse = `*** Settings ***
Library    SeleniumLibrary

*** Variables ***
\${BROWSER}    chrome
\${URL}        http://yourapp.com

*** Test Cases ***
Login To Application
    Open Browser To Login Page
    Input Username    testuser
    Input Password    password123
    Click Login Button
    Verify Dashboard Is Visible
    [Teardown]    Close Browser

*** Keywords ***
Open Browser To Login Page
    Open Browser    \${URL}    \${BROWSER}
    Maximize Browser Window
    Title Should Be    Login Page

Input Username
    [Arguments]    \${username}
    Input Text    id=username    \${username}

Input Password
    [Arguments]    \${password}
    Input Text    id=password    \${password}

Click Login Button
    Click Button    id=login-button

Verify Dashboard Is Visible
    Page Should Contain Element    xpath=//h1[contains(text(), 'Welcome, testuser!')]
`;
      return mockResponse;
    } catch (error) {
      console.error('Backend API Error:', error);
      if (error instanceof HttpErrorResponse) {
        throw new Error(`Backend API request failed: ${error.status} ${error.statusText}.`);
      }
      throw new Error('Failed to communicate with the test generation service.');
    }
  }

  async refineRobotTest(modifiedCode: string, config: AppConfig): Promise<string> {
    const payload = {
      code: modifiedCode,
      config: config,
    };

    const backendUrl = '/api/refine-test-suite';

    try {
      console.log(`Simulating POST request to ${backendUrl} with modified code.`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      const refinedResponse = `# --- Refined by AI on ${new Date().toLocaleTimeString()} ---\n` + 
        modifiedCode.replace(/id=login-button/g, 'css=.login-btn-submit'); // Simulate a change
      
      return refinedResponse;

    } catch (error) {
      console.error('Backend API Error:', error);
      if (error instanceof HttpErrorResponse) {
        throw new Error(`Backend API request failed: ${error.status} ${error.statusText}.`);
      }
      throw new Error('Failed to communicate with the test refinement service.');
    }
  }
}
