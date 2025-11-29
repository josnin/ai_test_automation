import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ConfigurationComponent {
  private configService = inject(ConfigService);

  // Use a local signal to manage form state
  config = signal(this.configService.getConfig());
  
  // Available models - in a real app, this might come from an API
  availableModels = ['gemini-2.5-flash'];
  
  isDirty = computed(() => {
    const savedConfig = this.configService.config();
    const currentConfig = this.config();
    return savedConfig.model !== currentConfig.model || savedConfig.systemPrompt !== currentConfig.systemPrompt;
  });

  onModelChange(event: Event): void {
    const model = (event.target as HTMLSelectElement).value;
    this.config.update(c => ({...c, model}));
  }

  onPromptChange(event: Event): void {
    const systemPrompt = (event.target as HTMLTextAreaElement).value;
    this.config.update(c => ({...c, systemPrompt}));
  }
  
  saveConfiguration(): void {
    this.configService.updateConfig(this.config());
  }

  resetConfiguration(): void {
    this.config.set(this.configService.getConfig());
  }
}
