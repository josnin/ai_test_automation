import { Injectable, signal, effect } from '@angular/core';
import { TestSuite } from '../types/test-generation';

@Injectable({
  providedIn: 'root',
})
export class TestSuiteService {
  private readonly SUITE_KEY = 'roboGeniusSuites';
  suites = signal<TestSuite[]>(this.loadFromLocalStorage());

  constructor() {
    effect(() => {
      this.saveToLocalStorage(this.suites());
    });
  }

  addSuite(name: string, baseUrl: string, pageIds: string[]): void {
    const newSuite: TestSuite = {
      id: `suite_${new Date().getTime()}`,
      name,
      baseUrl,
      pageIds,
    };
    this.suites.update(suites => [...suites, newSuite]);
  }
  
  updateSuite(updatedSuite: TestSuite): void {
    this.suites.update(suites => 
      suites.map(s => s.id === updatedSuite.id ? updatedSuite : s)
    );
  }

  deleteSuite(suiteId: string): void {
    this.suites.update(suites => suites.filter(s => s.id !== suiteId));
  }

  private loadFromLocalStorage(): TestSuite[] {
    try {
      const storedSuites = localStorage.getItem(this.SUITE_KEY);
      return storedSuites ? JSON.parse(storedSuites) : [];
    } catch (e) {
      console.error('Failed to load suites from localStorage', e);
      return [];
    }
  }

  private saveToLocalStorage(suites: TestSuite[]): void {
    try {
      localStorage.setItem(this.SUITE_KEY, JSON.stringify(suites));
    } catch (e) {
      console.error('Failed to save suites to localStorage', e);
    }
  }
}