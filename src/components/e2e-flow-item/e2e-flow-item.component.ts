import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { E2EFlow } from '../../types/test-generation';

@Component({
  selector: 'app-e2e-flow-item',
  templateUrl: './e2e-flow-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class E2eFlowItemComponent {
  flow = input.required<E2EFlow>();
  edit = output<E2EFlow>();
  delete = output<string>();
  run = output<string>();
  isMenuOpen = signal(false);

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.update(v => !v);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.set(false);
    if (confirm(`Are you sure you want to delete "${this.flow().name}"?`)) {
      this.delete.emit(this.flow().id);
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.set(false);
    this.edit.emit(this.flow());
  }

  onRun(event: MouseEvent): void {
    event.stopPropagation();
    this.run.emit(this.flow().id);
  }
}
