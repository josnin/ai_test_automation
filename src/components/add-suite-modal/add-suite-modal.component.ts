import { Component, ChangeDetectionStrategy, input, output, signal, inject, effect } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page, TestSuite } from '../../types/test-generation';

@Component({
  selector: 'app-add-suite-modal',
  templateUrl: './add-suite-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AddSuiteModalComponent {
  isOpen = input.required<boolean>();
  suiteToEdit = input<TestSuite | null>();
  close = output<void>();
  save = output<{ name: string; baseUrl: string; pageIds: string[] }>();

  pageService = inject(PageService);
  allPages = this.pageService.pages;

  name = signal('');
  baseUrl = signal('');
  selectedPageIds = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const suite = this.suiteToEdit();
      if (suite) {
        this.name.set(suite.name);
        this.baseUrl.set(suite.baseUrl);
        const selection = suite.pageIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        this.selectedPageIds.set(selection);
      } else {
        this.resetForm();
      }
    });
  }

  onSave(): void {
    const pageIds = Object.entries(this.selectedPageIds())
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (this.name() && this.baseUrl() && pageIds.length > 0) {
      this.save.emit({ name: this.name(), baseUrl: this.baseUrl(), pageIds });
      this.resetForm();
    } else {
      alert('Please provide a name, base URL, and select at least one page.');
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onPageSelectionChange(pageId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedPageIds.update(currentSelection => ({
      ...currentSelection,
      [pageId]: isChecked,
    }));
  }

  private resetForm(): void {
    this.name.set('');
    this.baseUrl.set('');
    this.selectedPageIds.set({});
  }
}