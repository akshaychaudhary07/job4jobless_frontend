import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminserviceService } from '../adminauth/adminservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Admin {

  adminName: String;
  adminMail: String;
  adminPass: String;
  adminId: String;

}

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent implements OnInit {
  myForm!: FormGroup;
  public passwordVisible: boolean = false;
  showFooter = false;
  constructor(private snackBar:MatSnackBar, private formBuilder: FormBuilder,private cookie: CookieService, private router: Router,private adminauth:AdminserviceService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      adminMail: ['', [Validators.required, Validators.email]],
      adminPass: ['', [Validators.required, Validators.minLength(6)]]

    });
  }

  onSubmit() {
    console.log(this.myForm.value);
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      
      this.adminauth.loginCheck(formData).subscribe({
        next: (response: any) => {
          if (response.accessToken && response.refreshToken && response.adminid) {
            const mainres: Admin = response;
            this.cookie.set('accessToken', response.accessToken);
            this.cookie.set('adminid', response.adminid);
            this.cookie.set('refreshToken', response.refreshToken);
         
            const accessToken = response.accessToken; 
            AuthInterceptor.accessToken = accessToken;
    
            const isAuthenticated = response.accessToken && response.adminid;
            console.log(isAuthenticated);
            if (isAuthenticated) {
              this.snackBar.open('Login Successful!.', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.router.navigate(['/admin/dashboardadmin']);
            } else {
             
              this.snackBar.open('Incorrect Credentials!', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.router.navigate(['/admin']);
            }
          } else {
         
            this.snackBar.open('Invalid response format', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (err: any) => {
          this.snackBar.open(err, 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        
        }
      });
    }
  }
  
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
