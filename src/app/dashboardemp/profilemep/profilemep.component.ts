import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Employer {
  empid: Number;
  empfname: String;
  emplname: String;
  empcompany: String;
  empmailid: String;
  emppass: String;
  empphone: String;
  empcountry: String;
  empstate: String;
  empcity: String;
  descriptionemp: String;
}

@Component({
  selector: 'app-profilemep',
  templateUrl: './profilemep.component.html',
  styleUrls: ['./profilemep.component.css']
})
export class ProfilemepComponent implements OnInit {
  isOpen: boolean = false;
  active: number = 0;
  data: any
  empDetail!: Employer;
  passwordVisible1: boolean = false;
  passwordVisible2: boolean = false;
  passwordVisible3: boolean = false;
  passwordVisibleCurrent:boolean=false
  passwordVisibleNew:boolean=false
  passwordVisibleVerify:boolean=false
  abc: any;
  emp: any;
  passwordResetForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private snackBar:MatSnackBar, public cookie: CookieService, private fb: FormBuilder, private b1: UserService, private router: Router, private http: HttpClient) { }

  empId: string = "0";
  private backend_URL = `${backendUrl}`;
  ngOnInit(): void {



    this.empId = this.cookie.get('emp');

    // console.log(this.empId);
    // console.log('Employer ID from cookie:', this.empId);

    // let response = this.b1.fetchemployer();
    let response = this.b1.fetchEmployerById(this.empId);

    response.subscribe((data1: any) => {
      const eeid = this.empId;
      // this.empDetail = data1.find((emp: any) => emp.empid == eeid);
      this.empDetail = data1;
      console.log("Employee first name is: "+this.empDetail.empfname)
      this.abc = this.empDetail.empmailid;
      // console.log(this.abc);
    });

    this.passwordResetForm = this.fb.group({
      empmailid: [this.abc, [Validators.required, Validators.email,Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/) ]],
      oldPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)
      ]],
      newPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)
      ]],
      verifyPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)
      ]]
    });
  }


  submitForm() {
    if (this.passwordResetForm.valid) {
      // console.log(this.abc);
      // Set empmailid field in formData to the value of abc
      this.passwordResetForm.patchValue({ empmailid: this.abc });

      const formData = this.passwordResetForm.value;
      // Make a POST request to your backend for password reset
      this.http.post(`${this.backend_URL}resetPasswordEmp`, formData)
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
              this.router.navigate(['/dashboardemp/profilemep'])
            },
            error: (err: any) => {
              // Handle errors
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
            }
          }
        );
    } else {
      // Form is invalid, show error messages or perform desired actions
    }
  }
  togglePasswordVisibilityCurrent()
  {
    this.passwordVisibleCurrent=!this.passwordVisibleCurrent
  }
  togglePasswordVisibilityNew()
  {
    this.passwordVisibleNew=!this.passwordVisibleNew;
  }
  togglePasswordVisibilityVerify()
  {
    this.passwordVisibleVerify=!this.passwordVisibleVerify;
  }

  updateuserprofile() {
    this.router.navigate(['/dashboardemp/updateempprofile', this.empId]);
  }
  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
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

  deleteAccountemp() {
    // console.log(this.empId);
    this.b1.deleteEmployer(this.empId).subscribe({
      next: (response: any) => {
        // console.log(response);
        if (response && response.message) {
          this.snackBar.open(response.message, 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/']);
        } else {
          this.snackBar.open('Unexpected response format', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.snackBar.open('Employer not found', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          this.snackBar.open('An error occurred: ' + err.message, 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      }
    });
  }
  
}