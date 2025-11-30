import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TestSuiteService } from '../../services/test-suite.service';
import { TestSuite } from '../../types/test-generation';
import { TestSuiteItemComponent } from '../test-suite-item/test-suite-item.component';
import { AddSuiteModalComponent } from '../add-suite-modal/add-suite-modal.component';

@Component({
  selector: 'app-test-suite-list',
  templateUrl: './test-suite-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TestSuiteItemComponent, AddSuiteModalComponent],
})
export class TestSuiteListComponent {
  testSuiteService = inject(TestSuiteService);
  isModalOpen = signal(false);
  suiteToEdit = signal<TestSuite | null>(null);

  openAddModal(): void {
    this.suiteToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(suite: TestSuite): void {
    this.suiteToEdit.set(suite);
    this.isModalOpen.set(true);
  }

  handleSave(event: { name: string; baseUrl: string; pageIds: string[] }): void {
    const suite = this.suiteToEdit();
    if (suite) {
      // Update existing suite
      this.testSuiteService.updateSuite({ ...suite, ...event });
    } else {
      // Add new suite
      this.testSuiteService.addSuite(event.name, event.baseUrl, event.pageIds);
    }
    this.isModalOpen.set(false);
    this.suiteToEdit.set(null);
  }

  handleRunSuite(suiteId: string): void {
    console.log(`Triggering run for Test Suite: ${suiteId}`);
    alert(`Running Test Suite ID: ${suiteId}`);
  }
}