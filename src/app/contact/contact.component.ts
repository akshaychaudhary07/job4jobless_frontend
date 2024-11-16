import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  // Define a FormGroup for your form
  contactForm!: FormGroup;

  constructor(private snackBar:MatSnackBar, private fb: FormBuilder, private router: Router, private h1: UserService) {
    // Initialize the form with FormBuilder
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/), this.noLeadingSpaceValidator]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)
        ]
      ],
      contactNumber: ['', [Validators.required, this.contactNumberValidator]],
      message: ['', [Validators.required]],
    });
  }

  noLeadingSpaceValidator(control: any) {
    if (control.value && control.value.trimLeft()[0] === ' ') {
      return { 'leadingSpace': true };
    }
    return null;
  }

  // Custom validator for Gmail
  gmailValidator(control: { value: string; }) {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { invalidGmail: true };
    }
    return null;
  }

  // Custom validator for 10-digit contact number
  contactNumberValidator(control: { value: any; }) {
    const value = control.value;
    const isValid = /^\d{10}$/.test(value);

    if (!isValid) {
      return { invalidContactNumber: true };
    }
    return null;
  }
  // Handle form submission
  onSubmitForm() {
    if (this.contactForm.valid) {
      // Form data is valid, you can access it using this.contactForm.value
      console.log(this.contactForm.value);
      this.h1.insertfrontform(this.contactForm.value).subscribe(
        {
          next: (response: any) => {
            if (response === true) {
              this.snackBar.open('Contact form submitted successfully', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.router.navigate(['/']);
            }
            else {
              this.snackBar.open('Failed to submit contact form', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            }
          },
          error: (err) => {
            this.snackBar.open(err, 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        }
      );
    }
  }
}
