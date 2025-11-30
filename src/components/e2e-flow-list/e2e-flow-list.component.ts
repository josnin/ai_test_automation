import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { E2eFlowService } from '../../services/e2e-flow.service';
import { E2EFlow } from '../../types/test-generation';
import { E2eFlowItemComponent } from '../e2e-flow-item/e2e-flow-item.component';
import { AddE2eFlowModalComponent } from '../add-e2e-flow-modal/add-e2e-flow-modal.component';

@Component({
  selector: 'app-e2e-flow-list',
  templateUrl: './e2e-flow-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [E2eFlowItemComponent, AddE2eFlowModalComponent],
})
export class E2eFlowListComponent {
  e2eFlowService = inject(E2eFlowService);
  isModalOpen = signal(false);
  flowToEdit = signal<E2EFlow | null>(null);

  openAddModal(): void {
    this.flowToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(flow: E2EFlow): void {
    this.flowToEdit.set(flow);
    this.isModalOpen.set(true);
  }

  handleSave(event: { name: string; delay: number; retries: number; suiteIds: string[] }): void {
    const flow = this.flowToEdit();
    if (flow) {
      this.e2eFlowService.updateFlow({ 
        ...flow, 
        name: event.name,
        delayBetweenSuites: event.delay,
        retries: event.retries,
        suiteIds: event.suiteIds,
       });
    } else {
      this.e2eFlowService.addFlow(event.name, event.delay, event.retries, event.suiteIds);
    }
    this.isModalOpen.set(false);
    this.flowToEdit.set(null);
  }

  handleRunFlow(flowId: string): void {
    console.log(`Triggering run for E2E Flow: ${flowId}`);
    alert(`Running E2E Flow ID: ${flowId}`);
  }
}
