import { Injectable, inject, signal, effect } from '@angular/core';
import { Page } from '../types/test-generation';
import { DocProcessingService } from './doc-processing.service';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private readonly PAGE_KEY = 'roboGeniusPages';
  private docProcessingService = inject(DocProcessingService);

  pages = signal<Page[]>(this.loadFromLocalStorage());

  constructor() {
    effect(() => {
      this.saveToLocalStorage(this.pages());
    });
  }

  async addPage(name: string, instructions: string, imageFile: File): Promise<void> {
    const pageId = `page_${new Date().getTime()}`;
    const imageUrl = URL.createObjectURL(imageFile);

    const newPage: Page = {
      id: pageId,
      name,
      instructions,
      imageUrl,
      status: 'loading',
      robotCode: null,
    };

    this.pages.update(currentPages => [...currentPages, newPage]);
    
    try {
      const generatedCode = await this.docProcessingService.generateTestFromImage(imageFile, instructions);
      this.pages.update(pages =>
        pages.map(p => (p.id === pageId ? { ...p, status: 'generated', robotCode: generatedCode } : p))
      );
    } catch (e) {
      console.error(`Failed to generate test for page ${pageId}:`, e);
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      this.pages.update(pages =>
        pages.map(p => (p.id === pageId ? { ...p, status: 'error', errorMessage: message } : p))
      );
    }
  }

  deletePage(pageId: string): void {
    this.pages.update(pages => {
      const pageToDelete = pages.find(p => p.id === pageId);
      if (pageToDelete?.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pageToDelete.imageUrl);
      }
      return pages.filter(p => p.id !== pageId);
    });
  }

  private loadFromLocalStorage(): Page[] {
    try {
      const storedPages = localStorage.getItem(this.PAGE_KEY);
      // We don't persist image blobs, so reset status of loading pages
      const pages = storedPages ? (JSON.parse(storedPages) as Page[]) : [];
      return pages.map(p => p.status === 'loading' ? {...p, status: 'error', errorMessage: 'Generation interrupted'} : p);
    } catch (e) {
      console.error('Failed to load pages from localStorage', e);
      return [];
    }
  }

  private saveToLocalStorage(pages: Page[]): void {
    try {
      // Exclude blob URLs from being stored
      const pagesToStore = pages.map(({ imageUrl, ...page }) => {
        const newPage = {...page, imageUrl: imageUrl.startsWith('blob:') ? '' : imageUrl };
        return newPage;
      });
      localStorage.setItem(this.PAGE_KEY, JSON.stringify(pagesToStore));
    } catch (e)
    {
      console.error('Failed to save pages to localStorage', e);
    }
  }
}