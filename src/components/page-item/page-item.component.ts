import { Component, ChangeDetectionStrategy, input, inject, signal } from '@angular/core';
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

  isExpanded = signal(false);

  toggleExpand(): void {
    this.isExpanded.update(v => !v);
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