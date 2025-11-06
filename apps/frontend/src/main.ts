import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/core/services/config/config.service';

async function bootstrap() {
  try {
    // Create a ConfigService instance and load the config
    const configService = new ConfigService();
    await configService.loadConfig();

    // Bootstrap the app and provide the loaded ConfigService
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...(appConfig.providers || []),
        { provide: ConfigService, useValue: configService }
      ],
    });
  } catch (err) {
    console.error('Failed to bootstrap application:', err);
  }
}

bootstrap();
