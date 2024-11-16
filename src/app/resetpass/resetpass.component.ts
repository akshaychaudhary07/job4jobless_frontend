import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { backendUrl , OtpUrl} from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit{
  private backend_URL=`${backendUrl}`;
  private Otp_Url = `${OtpUrl}`
  isLoading: boolean = false;
  
  userName: string = '';
  user: any;
  errorMessage: string | undefined;
  showWarning: boolean = false;
  userForm!: FormGroup; // Define a FormGroup for your form

  constructor(
    private snackBar:MatSnackBar,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
 
  }
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email , Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/) ]]
    });
  }


  checkUser() {
    console.log("checking the user details ", this.userForm);
    if (this.userForm.valid) {
      console.log("checking the user name", this.userForm.value.userName); 
      this.isLoading = true; // Set loader to true
      this.userService.checkUser(this.userForm.value.userName).subscribe({
        next: (payload: any) => {
          this.user = payload.userName;
          this.errorMessage = undefined;
          console.log(payload);
          console.log(payload.uid);
          this.generateOtp(payload);
        },
        error: (err: any) => {
          console.error(err);
          this.user = undefined;
          this.snackBar.open('Invalid mail or Does not exist', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.errorMessage = err.error;
          this.isLoading = false; // Turn off loader in case of error
        }
      });
    }
  }
  
  generateOtp(payload: any) {
    console.log("checking the payload",payload);
    this.http.post(`${this.Otp_Url}generateOtp`, { uid: payload.uid, email: payload.userName }).subscribe({
      next: (response: any) => {
        console.log("checking the response",response);
        if (response.otpCreated) {
          console.log(response.otpCreated);
          console.log(payload.uid);
          const uidid = payload.uid;
          console.log(uidid);
          
          if(payload.uid !== null){
            console.log("checking router is working");
            this.router.navigate(['/checkotpuser', payload.uid]);
          }
          else{
            console.log("checking router is not working");
          }
          this.isLoading = false; // Turn off loader when navigating to OTP page
        } 
        else {
          console.error("Otp not generated");
          this.snackBar.open('Otp not generated', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isLoading = false; // Turn off loader in case OTP is not generated
        }
      },
      error: (err: any) => {
        console.error(`Some error occurred: ${err}`);
        this.snackBar.open(err, 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.isLoading = false; // Turn off loader in case of error
      }
    });
  }
}
