import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  fileSelected = output<File>();
  isDragging = signal(false);
  fileName = signal<string | null>(null);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
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
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      this.fileName.set(file.name);
      this.fileSelected.emit(file);
    } else {
      alert('Please upload a valid .docx file.');
      this.fileName.set(null);
    }
  }
}
