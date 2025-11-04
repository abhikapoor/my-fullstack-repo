import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './message.component.html',
})
export class MessageComponent {
}
