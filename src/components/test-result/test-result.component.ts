import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CodeEditorComponent],
})
export class TestResultComponent {
  code = input.required<string>();
  refineRequest = output<string>();

  copyButtonText = signal('Copy');
  editedCode = signal('');

  constructor() {
    effect(() => {
      // Sync the local edited code when the input code changes (e.g., after a new generation/refinement)
      this.editedCode.set(this.code());
    }, { allowSignalWrites: true });
  }
  
  isCodeDirty = computed(() => {
    return this.code() !== this.editedCode();
  });

  onCodeChange(newCode: string): void {
    this.editedCode.set(newCode);
  }

  submitForRefinement(): void {
    if (this.isCodeDirty()) {
      this.refineRequest.emit(this.editedCode());
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.editedCode()).then(() => {
      this.copyButtonText.set('Copied!');
      setTimeout(() => this.copyButtonText.set('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.copyButtonText.set('Failed');
       setTimeout(() => this.copyButtonText.set('Copy'), 2000);
    });
  }

  downloadFile(): void {
    const blob = new Blob([this.editedCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_suite.robot';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
