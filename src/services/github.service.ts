import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of, catchError } from 'rxjs';
import { GithubConfigService } from './github-config.service';
import { GithubFileContent } from '../types/github';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  // FIX: Add explicit types for injected services to resolve potential type inference issues.
  private http: HttpClient = inject(HttpClient);
  private configService: GithubConfigService = inject(GithubConfigService);
  private readonly GITHUB_API_URL = 'https://api.github.com';

  private async getFileSha(apiUrl: string, headers: HttpHeaders): Promise<string | null> {
    const request$ = this.http.get<GithubFileContent>(apiUrl, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null); // File doesn't exist, return null
        }
        throw new Error(`Could not fetch file from GitHub. Status: ${error.status}.`);
      })
    );
    const response = await firstValueFrom(request$);
    return response ? response.sha : null;
  }

  async uploadToRepo(content: string): Promise<void> {
    const config = this.configService.getConfig();
    
    if (!config.pat || !config.owner || !config.repo || !config.filePath) {
      throw new Error('GitHub configuration is incomplete. Please fill in all fields.');
    }

    const apiUrl = `${this.GITHUB_API_URL}/repos/${config.owner}/${config.repo}/contents/${config.filePath}`;
    
    const headers = new HttpHeaders({
      'Authorization': `token ${config.pat}`,
      'Accept': 'application/vnd.github.v3+json'
    });

    try {
      const sha = await this.getFileSha(apiUrl, headers);

      const body: { message: string, content: string, sha?: string } = {
        message: `feat: add/update test suite ${config.filePath}`,
        content: btoa(content), // content must be base64 encoded
      };

      if (sha) {
        body.sha = sha; // include sha if updating an existing file
      }

      const request$ = this.http.put(apiUrl, body, { headers });
      await firstValueFrom(request$);

    } catch (error) {
      console.error('GitHub API Error:', error);
      if (error instanceof HttpErrorResponse) {
        throw new Error(`GitHub API request failed: ${error.status} ${error.statusText}. Check your token permissions and repository details.`);
      }
      throw error; // rethrow original error if it's not an HttpErrorResponse
    }
  }
}
