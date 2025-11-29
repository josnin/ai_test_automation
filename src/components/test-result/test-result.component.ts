import { Component, ChangeDetectionStrategy, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TestResultComponent {
  code = input.required<string>();
  private githubService = inject(GithubService);
  
  copyButtonText = signal('Copy');
  uploadStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  uploadError = signal<string | null>(null);

  formattedCode = computed(() => {
    return this.highlightSyntax(this.code());
  });

  private highlightSyntax(code: string): string {
    return code
      .replace(/(\*\*\* Settings \*\*\*|\*\*\* Variables \*\*\*|\*\*\* Test Cases \*\*\*|\*\*\* Keywords \*\*\*)/g, '<span class="setting">$1</span>')
      .replace(/^(Library|Resource|Suite Setup|Suite Teardown|Test Setup|Test Teardown|Documentation)/gm, '<span class="keyword">$1</span>')
      .replace(/(\$\{.*?\})/g, '<span class="variable">$1</span>')
      .replace(/(^ {4,}[A-Z][a-zA-Z0-9 ]+)/gm, '<span class="task-name">$1</span>');
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copyButtonText.set('Copied!');
      setTimeout(() => this.copyButtonText.set('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.copyButtonText.set('Failed');
       setTimeout(() => this.copyButtonText.set('Copy'), 2000);
    });
  }

  downloadFile(): void {
    const blob = new Blob([this.code()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_suite.robot';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async uploadToGithub(): Promise<void> {
    this.uploadStatus.set('loading');
    this.uploadError.set(null);
    try {
      await this.githubService.uploadToRepo(this.code());
      this.uploadStatus.set('success');
      setTimeout(() => this.uploadStatus.set('idle'), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.uploadError.set(message);
      this.uploadStatus.set('error');
    }
  }
}
