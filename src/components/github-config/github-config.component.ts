import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubConfigService } from '../../services/github-config.service';

@Component({
  selector: 'app-github-config',
  templateUrl: './github-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class GithubConfigComponent {
  private githubConfigService = inject(GithubConfigService);

  config = signal(this.githubConfigService.getConfig());
  
  isDirty = computed(() => {
    const savedConfig = this.githubConfigService.config();
    const currentConfig = this.config();
    return savedConfig.pat !== currentConfig.pat 
        || savedConfig.owner !== currentConfig.owner
        || savedConfig.repo !== currentConfig.repo
        || savedConfig.filePath !== currentConfig.filePath;
  });

  updateField(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.config.update(c => ({...c, [field]: value }));
  }
  
  saveConfiguration(): void {
    this.githubConfigService.updateConfig(this.config());
  }

  resetConfiguration(): void {
    this.config.set(this.githubConfigService.getConfig());
  }
}
