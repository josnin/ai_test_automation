import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { PageService } from '../../services/page.service';
import { PageItemComponent } from '../page-item/page-item.component';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageItemComponent, AddPageModalComponent],
})
export class PageListComponent {
  pageService = inject(PageService);
  isModalOpen = signal(false);

  handleSave(event: { name: string; instructions: string; imageFile: File }): void {
    this.pageService.addPage(event.name, event.instructions, event.imageFile);
    this.isModalOpen.set(false);
  }
}