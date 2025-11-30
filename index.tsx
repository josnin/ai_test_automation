import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './src/app.component';

/**
 * The main application bootstrap function.
 */
function bootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
    ],
  }).catch(err => console.error('Angular bootstrap failed:', err));
}

// Start the application bootstrap process directly.
bootstrap();

// AI Studio always uses an `index.tsx` file for all project types.