import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class LoginComponent {
  authService = inject(AuthService);
  
  username = signal('admin');
  password = signal('password');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const success = await this.authService.login(this.username(), this.password());
    
    if (!success) {
      this.errorMessage.set('Invalid username or password.');
    }

    this.isLoading.set(false);
  }
}
