import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TestResultComponent } from './components/test-result/test-result.component';
import { CommonModule } from '@angular/common';
import { GeminiService } from './services/gemini.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FileUploaderComponent, ConfigurationComponent, TestResultComponent],
})
export class AppComponent {
  private geminiService = inject(GeminiService);
  private configService = inject(ConfigService);

  selectedFile = signal<File | null>(null);
  generatedCode = signal<string>('');
  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
    this.status.set('idle');
    this.generatedCode.set('');
  }

  async handleGenerate(): Promise<void> {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Please upload a document first.');
      this.status.set('error');
      return;
    }

    this.status.set('loading');
    this.errorMessage.set('');
    this.generatedCode.set('');

    try {
      const config = this.configService.getConfig();
      const code = await this.geminiService.generateRobotTest(file, config);
      this.generatedCode.set(code);
      this.status.set('success');
    } catch (error) {
      console.error('Error generating test suite:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.errorMessage.set(`Failed to generate test suite. ${message}`);
      this.status.set('error');
    }
  }

  async handleRefine(modifiedCode: string): Promise<void> {
    this.status.set('loading');
    this.errorMessage.set('');
    // We don't clear the generated code here, so the editor doesn't flicker.
    
    try {
      const config = this.configService.getConfig();
      const code = await this.geminiService.refineRobotTest(modifiedCode, config);
      this.generatedCode.set(code);
      this.status.set('success');
    } catch (error) {
      console.error('Error refining test suite:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.errorMessage.set(`Failed to refine test suite. ${message}`);
      this.status.set('error');
    }
  }
}
