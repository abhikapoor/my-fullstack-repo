import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { NgxParticlesModule } from '@tsparticles/angular';

import type { Container, Engine, ISourceOptions } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { NgParticlesService } from '@tsparticles/angular';
import { Store } from '@ngrx/store';
import { login } from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    NgxParticlesModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  id = 'tsparticles';
  private ngParticlesService = inject(NgParticlesService);
  private store = inject(Store);

  // Inject the service
  private readonly fb = inject(FormBuilder);
  form: FormGroup;

  // Particles Configuration (Using stable string literals)
  particlesOptions: ISourceOptions = {
    background: { color: { value: '#000000' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push' },
      },
      modes: { push: { quantity: 4 }, repulse: { distance: 100 } },
    },
    particles: {
      color: { value: '#22577a' },
      links: { enable: true, color: '#22577a', distance: 120 },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        outModes: { default: 'bounce' },
      },
      number: {
        value: 60,
        density: {
          enable: true,
          width: 800,
          height: 600,
        },
      },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 4 } },
    },
    detectRetina: true,
  };

  ngOnInit(): void {
    void this.ngParticlesService.init(async (engine: Engine) => {
      console.log('init', engine);

      await loadFull(engine);
    });
  }

  public particlesLoaded(container: Container): void {
    console.log('loaded', container);
  }

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.store.dispatch(login({ email, password }));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
