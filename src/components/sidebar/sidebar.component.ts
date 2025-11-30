import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class SidebarComponent {
  activeView = input.required<'pages' | 'suites' | 'e2e'>();
  isOpen = input<boolean>(false);
  viewChange = output<'pages' | 'suites' | 'e2e'>();
  logout = output<void>();
  close = output<void>();
}
