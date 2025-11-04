import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';
import { Role } from '@my-fullstack-repo/shared-prisma-types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    AvatarModule,
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
})
export class EditUserDialogComponent implements OnChanges {
  @Input() user!: SafeUser | null;
  @Input() visible = false;
  roles: string[] = Object.values(Role);
  @Output() save = new EventEmitter<SafeUser>();
  @Output() cancel = new EventEmitter<void>();
  @Input() isAdmin : boolean = false

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        dob: this.user?.dob ? new Date(this.user.dob) : null,
        address: this.user.address,
        role: this.user.role,
      });
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [null, Validators.required],
      address: [''],
      role: ['', Validators.required],
    });
  }

  onSave() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const updatedUser = { ...this.user, ...this.userForm.value } as SafeUser;
    this.save.emit(updatedUser);
  }

  onCancel() {
    this.cancel.emit();
  }
}
