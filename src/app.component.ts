import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { PageListComponent } from './components/page-list/page-list.component';
import { TestSuiteListComponent } from './components/test-suite-list/test-suite-list.component';
import { E2eFlowListComponent } from './components/e2e-flow-list/e2e-flow-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, PageListComponent, TestSuiteListComponent, E2eFlowListComponent],
})
export class AppComponent {
  activeView = signal<'pages' | 'suites' | 'e2e'>('pages');

  setView(view: 'pages' | 'suites' | 'e2e'): void {
    this.activeView.set(view);
  }
}