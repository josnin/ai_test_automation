import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'roboGeniusAuthToken';
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    try {
      const token = sessionStorage.getItem(this.AUTH_KEY);
      this.isAuthenticated.set(!!token);
    } catch (e) {
      console.error('Could not access sessionStorage:', e);
      this.isAuthenticated.set(false);
    }
  }
  
  async login(username: string, password: string): Promise<boolean> {
    // Mock authentication
    return new Promise(resolve => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          try {
            sessionStorage.setItem(this.AUTH_KEY, 'mock-jwt-token');
            this.isAuthenticated.set(true);
            resolve(true);
          } catch (e) {
            console.error('Could not access sessionStorage:', e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  logout(): void {
    try {
      sessionStorage.removeItem(this.AUTH_KEY);
    } catch (e) {
      console.error('Could not access sessionStorage:', e);
    } finally {
      this.isAuthenticated.set(false);
    }
  }
}
