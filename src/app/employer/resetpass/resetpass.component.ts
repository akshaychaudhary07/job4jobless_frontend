import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl , OtpUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent  implements OnInit{
  empmailid: string = '';
  user: any;
  errorMessage: string | undefined;
  showWarning: boolean = false;
  employerForm!: FormGroup; // Define a FormGroup for your form

  private backend_URL=`${backendUrl}`;
  private Otp_Url = `${OtpUrl}`

  loading: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
 
  }
  ngOnInit(): void {
    this.employerForm = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email,Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]]
    });
  }


  checkUser() {
    if (this.employerForm.valid) {
      this.loading = true;
      // console.log("checking the user name", this.employerForm.value.empmailid);
      this.userService.checkEmployer(this.employerForm.value.empmailid).subscribe({
        next: (payload: any) => {
          this.user = payload.empmailid;
          this.errorMessage = undefined;
          this.generateOtp(payload);
        },
        error: (err: any) => {
          console.error(err);
          this.user = undefined;
          this.loading = false;
          this.snackBar.open('User does not exist...', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.errorMessage = err.error;
        }
      });
    }
  }

  generateOtp(payload: any) {
    this.http.post(`${this.Otp_Url}generateOtp`, { uid: payload.empid, email: payload.empmailid }).subscribe({
      next: (response: any) => {
        if (response.otpCreated) {
          // console.log(response.otpCreated);
          this.router.navigate(['/employer/checkotpemployer', payload.empid]);
        }
        else {
          console.error("Otp not generated");
          this.snackBar.open('Otp not generated', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err: any) => {
        console.error(`Some error occurred: ${err}`);
        this.snackBar.open('Some Error Occurred', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      complete: () => {
        this.loading = false; // Hide loader after OTP generation is completed
      }
    });
  }

}
