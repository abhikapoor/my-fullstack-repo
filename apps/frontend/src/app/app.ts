import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import {MessageComponent} from './shared/message/message.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, HeaderComponent, FooterComponent,MessageComponent],
  templateUrl: './app.html',
})
export class AppComponent {}
