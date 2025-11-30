import { Component, ChangeDetectionStrategy, input, output, signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-add-page-modal',
  templateUrl: './add-page-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AddPageModalComponent implements OnDestroy {
  isOpen = input.required<boolean>();
  close = output<void>();
  save = output<{ name: string; instructions: string; imageFile: File }>();

  name = signal('');
  instructions = signal('');
  imageFile = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isDragging = signal(false);

  onSave(): void {
    const file = this.imageFile();
    const pageName = this.name();
    const pageInstructions = this.instructions();
    if (file && pageName && pageInstructions) {
      this.save.emit({ name: pageName, instructions: pageInstructions, imageFile: file });
      this.resetForm();
    } else {
      alert('Please fill out all fields and select an image.');
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.name.set('');
    this.instructions.set('');
    this.revokeImagePreview();
    this.imageFile.set(null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type.startsWith('image/')) {
      this.imageFile.set(file);
      this.revokeImagePreview(); // Revoke previous URL if exists
      this.imagePreviewUrl.set(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid image file (PNG, JPG, etc.).');
    }
  }

  private revokeImagePreview(): void {
     if (this.imagePreviewUrl()) {
        URL.revokeObjectURL(this.imagePreviewUrl()!);
        this.imagePreviewUrl.set(null);
     }
  }
  
  ngOnDestroy(): void {
      this.revokeImagePreview();
  }
}