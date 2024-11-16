import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { backendUrl , OtpUrl } from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';
  otpExpired: boolean = false;
  private backend_URL = `${backendUrl}`
  private Otp_URL=`${OtpUrl}`;
  loadingVerifyOTP: boolean = false;

  constructor(
    private snackBar:MatSnackBar,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['',  [Validators.required, Validators.pattern(/^\d{6}$/), Validators.pattern(/^[0-9]*$/)]],
      email: ['', [Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]]
    });
  }

  verifyOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    const otpValue = this.otpForm.controls['otp'].value;
    const emailValue = this.otpForm.controls['email'].value;

    this.loadingVerifyOTP = true; 
    this.http.post(`${this.Otp_URL}verifyOtp`, {
      uid: this.activatedRoute.snapshot.paramMap.get('uid'),
      otp: otpValue,
      email: emailValue
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.updateUserificationStatus(emailValue);
          } else {
            this.otpExpired = true;
            this.snackBar.open('OTP expired. Resend OTP.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.resendOTP();
          }
        } else {
          this.loadingVerifyOTP = false;
          this.snackBar.open('OTP not matched. Please enter the correct OTP.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        this.loadingVerifyOTP = false;
        console.error(`Some error occurred: ${err}`);
      },
      complete: () => {
        this.loadingVerifyOTP = false; // Hide loader after OTP verification is completed
      }
    });
  }

  updateUserificationStatus(userName: string): void {
    this.http.post(`${this.backend_URL}verifyUser`, { userName: userName })
    .subscribe({
      next: (response: any) => {
        console.log("User verified successfully");
        this.router.navigate(['/login']);
        this.snackBar.open('Register successful!', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        this.loadingVerifyOTP = false;
        console.error(`Error updating user verification status: ${err}`);
        this.snackBar.open('Invalid mail', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  resendOTP(): void {
    this.http.post(`${this.Otp_URL}resendOtp`, {
      uid: this.activatedRoute.snapshot.paramMap.get('uid'),
      otp: this.otpForm.controls['otp'].value,
      email: this.otpForm.controls['email'].value
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.router.navigate(['login']);
          } else {
            this.otpExpired = true;
            
            this.snackBar.open('OTP expired. Resend OTP.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.loadingVerifyOTP=false
          }
        } else {
          this.loadingVerifyOTP=false
          this.snackBar.open('OTP not matched. Please enter the correct OTP.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  showAlert(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 10000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
