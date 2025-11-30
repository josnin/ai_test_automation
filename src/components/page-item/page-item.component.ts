import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { Page } from '../../types/test-generation';
import { PageService } from '../../services/page.service';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-page-item',
  templateUrl: './page-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeEditorComponent, NgOptimizedImage],
})
export class PageItemComponent {
  page = input.required<Page>();
  pageService = inject(PageService);

  onGenerateTest(): void {
    // This functionality is now handled by the initial creation.
    // This could be repurposed for a "regenerate" feature in the future.
    // For now, we find the original image file to re-run. But since we don't have it, we can't.
    // The simple approach is to re-trigger generation in the service, but the service needs the file.
    // Let's make this do nothing for now, but keep the button for UI consistency.
    console.log("Re-generation logic to be implemented.");
  }
  
  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.page().name}"?`)) {
       this.pageService.deletePage(this.page().id);
    }
  }

  downloadFile(): void {
    const code = this.page().robotCode;
    if (!code) return;
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.page().name.replace(/ /g, '_')}.robot`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}