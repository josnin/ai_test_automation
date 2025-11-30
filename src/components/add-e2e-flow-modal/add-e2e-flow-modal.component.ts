import { Component, ChangeDetectionStrategy, input, output, signal, inject, effect, computed } from '@angular/core';
import { TestSuiteService } from '../../services/test-suite.service';
import { TestSuite, E2EFlow } from '../../types/test-generation';

@Component({
  selector: 'app-add-e2e-flow-modal',
  templateUrl: './add-e2e-flow-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AddE2eFlowModalComponent {
  isOpen = input.required<boolean>();
  flowToEdit = input<E2EFlow | null>();
  close = output<void>();
  save = output<{ name: string; delay: number; retries: number; suiteIds: string[] }>();

  testSuiteService = inject(TestSuiteService);
  allSuites = this.testSuiteService.suites;

  name = signal('');
  delay = signal(0);
  retries = signal(0);
  selectedSuiteIds = signal<string[]>([]);

  selectedSuites = computed(() => {
    const suitesMap = this.allSuites().reduce((map, suite) => {
      map.set(suite.id, suite);
      return map;
    }, new Map<string, TestSuite>());
    return this.selectedSuiteIds().map(id => suitesMap.get(id)).filter((s): s is TestSuite => !!s);
  });

  availableSuites = computed(() => {
    const selectedIds = new Set(this.selectedSuiteIds());
    return this.allSuites().filter(suite => !selectedIds.has(suite.id));
  });

  constructor() {
    effect(() => {
      const flow = this.flowToEdit();
      if (this.isOpen() && flow) {
        this.name.set(flow.name);
        this.delay.set(flow.delayBetweenSuites);
        this.retries.set(flow.retries);
        this.selectedSuiteIds.set(flow.suiteIds);
      } else {
        this.resetForm();
      }
    });
  }

  onSave(): void {
    if (this.name() && this.selectedSuiteIds().length > 0) {
      this.save.emit({
        name: this.name(),
        delay: this.delay(),
        retries: this.retries(),
        suiteIds: this.selectedSuiteIds()
      });
      this.onClose();
    } else {
      alert('Please provide a name and select at least one test suite.');
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  addSuite(suiteId: string): void {
    this.selectedSuiteIds.update(ids => [...ids, suiteId]);
  }

  removeSuite(suiteId: string): void {
    this.selectedSuiteIds.update(ids => ids.filter(id => id !== suiteId));
  }

  moveSuite(index: number, direction: 'up' | 'down'): void {
    this.selectedSuiteIds.update(ids => {
      const newIds = [...ids];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newIds.length) {
        [newIds[index], newIds[targetIndex]] = [newIds[targetIndex], newIds[index]];
      }
      return newIds;
    });
  }

  private resetForm(): void {
    this.name.set('');
    this.delay.set(0);
    this.retries.set(0);
    this.selectedSuiteIds.set([]);
  }
}
