import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl , OtpUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkotpemployer',
  templateUrl: './checkotpemployer.component.html',
  styleUrls: ['./checkotpemployer.component.css']
})
export class CheckotpemployerComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';
  otpExpired: boolean = false;
  private backend_URL=`${backendUrl}`;
  private Otp_Url=`${OtpUrl}`
  loading: boolean = false;

  constructor(
    private snackBar : MatSnackBar,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private b1: UserService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['',  [Validators.required, Validators.pattern(/^\d{6}$/), Validators.pattern(/^[0-9]*$/)]],
      email: ['', [Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]]
    });
  }
  verifyOTP(): void {
    this.loading = true; // Set loading to true when initiating OTP verification
    const empid = this.activatedRoute.snapshot.paramMap.get('empid');
    const otpValue = this.otpForm.controls['otp'].value;
    const emailValue = this.otpForm.controls['email'].value;

    this.http.post(`${this.Otp_Url}verifyOtp`, {
      uid: this.activatedRoute.snapshot.paramMap.get('empid'),
      otp: this.otpForm.controls['otp'].value,
      email: this.otpForm.controls['email'].value
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.updateEmployerVerificationStatus(emailValue);
          } else {
            this.snackBar.open('OTP expired. Please resend the OTP.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        } else {
          this.snackBar.open('Incorrect OTP. Please enter the correct OTP.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        // console.error(`Some error occurred: ${err}`);
      },
      complete: () => {
        this.loading = false; // Set loading to false when OTP verification completes
      }
    });
  }

  updateEmployerVerificationStatus(empmailid: string): void {
    this.http.post(`${this.backend_URL}verifyEmployer`, { empmailid: empmailid })
      .subscribe({
        next: (response: any) => {
          // console.log("Employer verified successfully");
          // Navigate to the desired route (e.g., '/employer/empsign')
          this.router.navigate(['/employer/resetpasswordemployer']);
        },
        error: (err) => {
          // console.error(`Error updating employer verification status: ${err}`);
        }
      });
  }

  resendOTP(): void {
    this.http.post(`${this.Otp_Url}verifyOtp`, {
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
            this.snackBar.open('OTP expired. Please resend the OTP.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        } else {
          this.snackBar.open('Incorrect OTP. Please enter the correct OTP.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        // console.error(`Some error occurred: ${err}`);
      }
    });
  }
}
