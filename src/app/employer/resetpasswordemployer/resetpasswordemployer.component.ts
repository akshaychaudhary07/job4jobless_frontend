import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { backendUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resetpasswordemployer',
  templateUrl: './resetpasswordemployer.component.html',
  styleUrls: ['./resetpasswordemployer.component.css']
})
export class ResetpasswordemployerComponent implements OnInit {
  passwordResetForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  showPasswordNew: boolean = false;
  showPasswordVerify: boolean = false;
  passwordVisibleNew: boolean = false;
  passwordVisibleVerify: boolean = false;

  private backend_URL=`${backendUrl}`;

  constructor(private snackBar:MatSnackBar, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.passwordResetForm = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email , Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/),
        ],
      ],
      verifyPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }
  togglePasswordVisibilityNew() {
    this.passwordVisibleNew = !this.passwordVisibleNew;
  }
  togglePasswordVisibilityVerify() {
    this.passwordVisibleVerify = !this.passwordVisibleVerify;
  }
  togglePasswordVisibility1(): void {
    this.showPasswordNew = !this.showPasswordNew;
  }
  togglePasswordVisibility2(): void {
    this.showPasswordVerify = !this.showPasswordVerify;
  }
  // togglePasswordVisibility(inputId: string): void {
  //   const input = document.getElementById(inputId) as HTMLInputElement;
  //   const eyeIcon = document.getElementById('eyeIcon2');
  
  //   if (input.type === 'password') {
  //     input.type = 'text';
  //     eyeIcon?.classList.remove('fa-eye');
  //     eyeIcon?.classList.add('fa-eye-slash');
  //   } else {
  //     input.type = 'password';
  //     eyeIcon?.classList.remove('fa-eye-slash');
  //     eyeIcon?.classList.add('fa-eye');
  //   }
  // }
  

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const verifyPassword = control.get('verifyPassword')?.value;

    return newPassword === verifyPassword ? null : { passwordMismatch: true };
  }

  submitForm() {
    // console.log(this.passwordResetForm);
    if (this.passwordResetForm.valid) {
      const formData = this.passwordResetForm.value;

      this.http.post(`${this.backend_URL}resetPasswordEmpverify`, formData)
        .subscribe({
          next: (response: any) => {
            this.successMessage = 'Password updated successfully';
            this.errorMessage = '';
            this.snackBar.open('Password updated successfully', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/employer/empsign']);
          },
          error: (err: any) => {
            if (err.status === 401) {
              this.errorMessage = 'Invalid old password';
              this.successMessage = '';
            } else if (err.status === 404) {
              this.errorMessage = 'Employer not found';
              this.successMessage = '';
            } else {
              this.errorMessage = 'An error occurred: ' + err.message;
              this.successMessage = '';
            }
          },
        });
    } else {
  //  console.log("error occured");
    }
  }
}

