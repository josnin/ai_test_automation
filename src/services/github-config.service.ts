import { Injectable, signal, effect } from '@angular/core';
import { GithubConfig } from '../types/github';

const DEFAULTS: GithubConfig = {
  pat: '',
  owner: '',
  repo: '',
  filePath: 'tests/generated-test.robot'
};

@Injectable({
  providedIn: 'root'
})
export class GithubConfigService {
  private readonly CONFIG_KEY = 'roboGeniusGithubConfig';
  private configSignal = signal<GithubConfig>(this.loadFromLocalStorage());
  
  public readonly config = this.configSignal.asReadonly();

  constructor() {
    effect(() => {
      this.saveToLocalStorage(this.configSignal());
    });
  }

  private loadFromLocalStorage(): GithubConfig {
    try {
      const storedConfig = localStorage.getItem(this.CONFIG_KEY);
      if (storedConfig) {
        return { ...DEFAULTS, ...JSON.parse(storedConfig) };
      }
    } catch (e) {
      console.error('Failed to load GitHub config from localStorage', e);
    }
    return DEFAULTS;
  }

  private saveToLocalStorage(config: GithubConfig): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save GitHub config to localStorage', e);
    }
  }

  public getConfig(): GithubConfig {
    return this.configSignal();
  }

  public updateConfig(newConfig: Partial<GithubConfig>): void {
    this.configSignal.update(currentConfig => ({ ...currentConfig, ...newConfig }));
  }
}
