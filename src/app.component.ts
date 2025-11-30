import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PageListComponent } from './components/page-list/page-list.component';
import { TestSuiteListComponent } from './components/test-suite-list/test-suite-list.component';
import { E2eFlowListComponent } from './components/e2e-flow-list/e2e-flow-list.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageListComponent, TestSuiteListComponent, E2eFlowListComponent, LoginComponent, SidebarComponent, MobileHeaderComponent],
})
export class AppComponent {
  authService = inject(AuthService);
  activeView = signal<'pages' | 'suites' | 'e2e'>('pages');
  isSidebarOpen = signal(false);

  setView(view: 'pages' | 'suites' | 'e2e'): void {
    this.activeView.set(view);
  }

  logout(): void {
    this.authService.logout();
  }
}