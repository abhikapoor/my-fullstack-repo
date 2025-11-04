import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SharedMessageService {
  private toast = inject(MessageService);

  success(summary: string, detail?: string) {
    this.toast.add({ severity: 'success', summary, detail, life: 5000, key: 'global' });
  }

  error(summary: string, detail?: string) {
    this.toast.add({ severity: 'error', summary, detail, life: 7000, key: 'global' });
  }

  info(summary: string, detail?: string) {
    this.toast.add({ severity: 'info', summary, detail, life: 5000, key: 'global' });
  }

  warn(summary: string, detail?: string) {
    this.toast.add({ severity: 'warn', summary, detail, life: 5000, key: 'global' });
  }
}
