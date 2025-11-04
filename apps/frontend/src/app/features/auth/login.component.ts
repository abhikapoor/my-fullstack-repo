import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { login } from '../../core/store/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../core/store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    CardModule,
  ],
})
export class LoginComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = toSignal(this.store.select(selectAuthLoading), {
    initialValue: false,
  });
  error = toSignal(this.store.select(selectAuthError));

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.store.dispatch(login({ email, password }));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
