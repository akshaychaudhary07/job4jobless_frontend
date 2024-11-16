import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { backendUrl,blogconst } from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgetblogpass',
  templateUrl: './forgetblogpass.component.html',
  styleUrls: ['./forgetblogpass.component.css']
})
export class ForgetblogpassComponent {
  togglePasswordVisibilityNew() {
    this.passwordVisibleNew = !this.passwordVisibleNew;
  }
  togglePasswordVisibilityVerify() {
    this.passwordVisibleVerify = !this.passwordVisibleVerify;
  }
  passwordResetForm: FormGroup; // Declare the property
  successMessage = '';
  errorMessage = '';
  passwordVisibleNew: boolean = false;
  passwordVisibleVerify: boolean = false;
  passwordsDoNotMatch: boolean = false;

  private backend_URL=`${blogconst}`;


  constructor(private snackBar:MatSnackBar, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.passwordResetForm = this.formBuilder.group({
      email: ['',[Validators.required , Validators.email , Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/) ]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)]]
    });
  }
  passwordPatternValidator(): any | string {
    return (control: { value: any; }) => {
      const password = control.value;
      const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!pattern.test(password)) {
        return { invalidPassword: true };
      }

      return null;
    };
  }
  ngOnInit(): void {
    // this.passwordResetForm = this.formBuilder.group({
    //   userName: [''],
    //   newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordPatternValidator()]],
    //   verifyPassword: ['', Validators.required],
    // });
  }



  submitForm() {
    if (this.passwordResetForm.valid) {
      const newPasswordControl = this.passwordResetForm.get('newPassword');
      const verifyPasswordControl = this.passwordResetForm.get('verifyPassword');

      if (newPasswordControl && verifyPasswordControl) {
        const newPassword = newPasswordControl.value;
        const verifyPassword = verifyPasswordControl.value;

        if (newPassword !== verifyPassword) {
          this.passwordsDoNotMatch = true;
          return;
        }

        this.passwordsDoNotMatch = false;


        const formData = this.passwordResetForm.value;

        // Make a POST request to your backend for password reset
        this.http.post(`${this.backend_URL}/reset-password`, formData)
        .subscribe({
          next: (response: any) => {
            // Handle success
            // console.log(response);
            this.successMessage = 'Password updated successfully';
            this.errorMessage = '';
            this.snackBar.open('Password updated successfully', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/']); // Navigate to a different route after successful password reset
          },
          error: (err: any) => {
            // Handle errors
            // console.error(err);
    
            if (err.status === 404) {
              this.errorMessage = 'Email not found';
              this.successMessage = '';
              this.snackBar.open('Email not found', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            } else if (err.status === 500) {
              this.errorMessage = 'Internal server error';
              this.successMessage = '';
              this.snackBar.open('Internal server error', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            } else {
              // If there's a custom error message from the server, display it
              if (err.error && err.error.error) {
                this.errorMessage = 'An error occurred: ' + err.error.error;
                this.successMessage = '';
                this.snackBar.open('An error occurred:', 'Close', {
                  duration: 10000, // Duration in milliseconds
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                });
              } else {
                this.errorMessage = 'An unexpected error occurred';
                this.successMessage = '';
                this.snackBar.open('An unexpected error occurred', 'Close', {
                  duration: 10000, // Duration in milliseconds
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                });
              }
            }
          }
        });
      } else {
        // Form is invalid, show error messages or perform desired actions
      }
    }



  }
}
