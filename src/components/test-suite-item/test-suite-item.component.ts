import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TestSuite } from '../../types/test-generation';

@Component({
  selector: 'app-test-suite-item',
  templateUrl: './test-suite-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TestSuiteItemComponent {
  suite = input.required<TestSuite>();
  edit = output<TestSuite>();
  delete = output<string>();
  run = output<string>();

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.suite().name}"?`)) {
      this.delete.emit(this.suite().id);
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.suite());
  }

  onRun(event: MouseEvent): void {
    event.stopPropagation();
    this.run.emit(this.suite().id);
  }
}