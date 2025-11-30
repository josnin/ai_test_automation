import { Injectable, signal, effect } from '@angular/core';
import { E2EFlow } from '../types/test-generation';

@Injectable({
  providedIn: 'root',
})
export class E2eFlowService {
  private readonly FLOW_KEY = 'roboGeniusE2EFlows';
  flows = signal<E2EFlow[]>(this.loadFromLocalStorage());

  constructor() {
    effect(() => {
      this.saveToLocalStorage(this.flows());
    });
  }

  addFlow(name: string, delay: number, retries: number, suiteIds: string[]): void {
    const newFlow: E2EFlow = {
      id: `flow_${new Date().getTime()}`,
      name,
      delayBetweenSuites: delay,
      retries,
      suiteIds,
    };
    this.flows.update(flows => [...flows, newFlow]);
  }
  
  updateFlow(updatedFlow: E2EFlow): void {
    this.flows.update(flows => 
      flows.map(f => f.id === updatedFlow.id ? updatedFlow : f)
    );
  }

  deleteFlow(flowId: string): void {
    this.flows.update(flows => flows.filter(f => f.id !== flowId));
  }

  private loadFromLocalStorage(): E2EFlow[] {
    try {
      const storedFlows = localStorage.getItem(this.FLOW_KEY);
      return storedFlows ? JSON.parse(storedFlows) : [];
    } catch (e) {
      console.error('Failed to load E2E flows from localStorage', e);
      return [];
    }
  }

  private saveToLocalStorage(flows: E2EFlow[]): void {
    try {
      localStorage.setItem(this.FLOW_KEY, JSON.stringify(flows));
    } catch (e) {
      console.error('Failed to save E2E flows to localStorage', e);
    }
  }
}
