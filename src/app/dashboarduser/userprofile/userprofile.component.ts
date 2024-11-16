import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
  summary: String;
  userlinkden: String;
  usergithub:String;
  otherturluser:String;
}
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  data: any
  userData1: User[]=[];
  public pdfUrl: string = '';
  abc: any;
  user: any;
  isOpen: boolean = false;
  active: number = 0;
  passwordResetForm!: FormGroup;
  passwordVisibleCurrent: boolean = false
  passwordVisibleNew: boolean = false
  passwordVisibleVerify: boolean = false


  successMessage = '';
  errorMessage = '';
  isLoading!: boolean;
  error!: string;
  constructor(private snackBar:MatSnackBar, public cookie: CookieService, private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private b1: UserService) { }

  userID: string = "0"; // Change 'String' to 'string'

  private backend_URL = `${backendUrl}`;

  ngOnInit(): void {
    // Check if the userID is correctly retrieved from the cookie
    this.userID = this.cookie.get('uid');
    console.log("The user id is: "+this.userID);
    // console.log('User ID from cookie:', this.userID);

    // let response = this.b1.fetchuser();
    let response = this.b1.fetchuser(this.userID,0);

    response.subscribe((data1: any) => {
      const uuid = this.userID;
      // this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.userData1 = data1.users;
      console.log("The userData1 is: "+JSON.stringify(this.userData1))
      // this.abc = this.userData1[1].userName;
      this.abc = this.userData1?.[0]?.userName;
      console.log("THe value of abc is: "+this.abc)
    });

    this.passwordResetForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]],
      oldPassword: ['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)]],
      verifyPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)]],
    },{ validator: this.passwordMatchValidator });

    this.pdfUrl = `${this.backend_URL}getPdfByUi/${this.userID}`;
    // console.log('PDF URL:', this.pdfUrl);

  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const verifyPassword = control.get('verifyPassword')?.value;

    return newPassword === verifyPassword ? null : { passwordMismatch: true };
  }
  togglePasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const eyeIcon = input.nextElementSibling as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon.querySelector('i')?.classList.remove('fa-eye');
      eyeIcon.querySelector('i')?.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      eyeIcon.querySelector('i')?.classList.remove('fa-eye-slash');
      eyeIcon.querySelector('i')?.classList.add('fa-eye');
    }
  }
  submitForm() {
    if (this.passwordResetForm.valid) {
      // Set userName field in formData to the value of abc
      this.passwordResetForm.patchValue({ userName: this.abc });

      const formData = this.passwordResetForm.value;
      console.log("The form data is: "+ JSON.stringify(formData))

      // Make a POST request to your backend for password reset
      this.http.post(`${this.backend_URL}resetPassword`, formData)
        .subscribe(
          {
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
              
              this.router.navigate(['/dashboarduser/userprofile']);
            },

            error: (err: any) => {
              // Handle errors
              if (err.status === 401) {
                this.errorMessage = 'Invalid old password';
                this.successMessage = '';
              } else if (err.status === 404) {
                this.errorMessage = 'User not found';
                this.successMessage = '';
              } else {
                this.errorMessage = 'An error occurred: ' + err.message;
                this.successMessage = '';
              }
            }
          }
        );
    } else {
      // Form is invalid, show error messages or perform desired actions
    }
  }
  togglePasswordVisibilityCurrent() {
    this.passwordVisibleCurrent = !this.passwordVisibleCurrent
  }
  togglePasswordVisibilityNew() {
    this.passwordVisibleNew = !this.passwordVisibleNew;
  }
  togglePasswordVisibilityVerify() {
    this.passwordVisibleVerify = !this.passwordVisibleVerify;
  }
  parseHTML(htmlString: string | undefined): SafeHtml {
    if (htmlString) {
      // Ensure that htmlString contains valid HTML markup
      const sanitizedHtml = this.sanitizer.sanitize(
        SecurityContext.HTML,
        htmlString
      );
      // Return sanitized HTML
      return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml || '');
    } else {
      return ''; // Return empty string as fallback
    }
  }
  userData: any = {

  };

  openUpdateProfileForm() {
    this.router.navigate(['/dashboarduser/updateprofile', this.userID]);
  }
  deleteAccount() {
    console.log(this.userID);
    // Use this.userID to pass the user's ID for deletion
    this.b1.deactivateUser(this.userID).subscribe(
      {
        next: (response: any) => {
          // Check the response message to determine if the operation was successful
          if (response && response.message) {
            this.snackBar.open(response.message, 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/']); // Navigate to the home page or any other appropriate page
          } else {
            this.snackBar.open('Unexpected response format', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (err: any) => {
          // Handle different error scenarios
          if (err.status === 404) {
            this.snackBar.open('User not found', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else { // Display a generic error message for other errors
            this.snackBar.open('An error occurred', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        }
      }
    );
  }


  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
  }
}