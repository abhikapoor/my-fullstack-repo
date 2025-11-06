import { Injectable } from '@angular/core';

export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config!: AppConfig;

  async loadConfig(): Promise<void> {
    const response = await fetch('/assets/config.json');
    this.config = await response.json();
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded yet!');
    }
    return this.config;
  }
}
