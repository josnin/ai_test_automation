import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { DocPage } from '../../types/test-generation';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  fileParsed = output<DocPage[]>();
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
      // In a real application, you would use a library like Mammoth.js to parse the docx file.
      // This is a complex task involving extracting text and images.
      // For this demonstration, we will simulate the parsing and emit mock data.
      this.simulateDocxParsing();
    } else {
      alert('Please upload a valid .docx file.');
      this.fileName.set(null);
    }
  }

  private simulateDocxParsing(): void {
    // This is MOCK data. A real implementation would parse the DOCX file.
    console.warn('Simulating DOCX parsing. Using mock data.');
    const mockPages: DocPage[] = [
      {
        image: 'iVBORw0KGgoAAAANSUhEUgAAAYAAAAEgCAYAAADZt+sYAAAAEklEQVR42g3BAQEAAACCIP+vbkhAAQAAAAAAAADwXwYgAAEAAADIKAAAAABJRU5ErkJggg==', // a tiny transparent png
        mimeType: 'image/png',
        instructions: 'User lands on the login page. Verify the "Username" field, "Password" field, and "Login" button are visible.'
      },
      {
        image: 'iVBORw0KGgoAAAANSUhEUgAAAYAAAAEgCAYAAADZt+sYAAAAEklEQVR42g3BAQEAAACCIP+vbkhAAQAAAAAAAADwXwYgAAEAAADIKAAAAABJRU5ErkJggg==', // a tiny transparent png
        mimeType: 'image/png',
        instructions: 'User enters "testuser" into the username field and "password123" into the password field, then clicks the "Login" button.'
      },
      {
        image: 'iVBORw0KGgoAAAANSUhEUgAAAYAAAAEgCAYAAADZt+sYAAAAEklEQVR42g3BAQEAAACCIP+vbkhAAQAAAAAAAADwXwYgAAEAAADIKAAAAABJRU5ErkJggg==', // a tiny transparent png
        mimeType: 'image/png',
        instructions: 'After successful login, verify that the dashboard heading says "Welcome, testuser!" and a "Logout" button is visible.'
      }
    ];
    this.fileParsed.emit(mockPages);
  }
}
