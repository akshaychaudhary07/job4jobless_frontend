
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform!: FormGroup;
  public passwordVisible: boolean = false;
  constructor(private fb: FormBuilder, private router:Router , private b1:UserService, private userservice:UserService,private snackBar:MatSnackBar) {
      }

      ngOnInit(): void {
        this.loginform = this.fb.group({
          userName: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]],
          userPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)]],
        });
      }

  // public login(loginform:{value:any;}) {
  //   console.log("User name is: "+loginform.value.userName);
  //   console.log("User password is: "+loginform.value.userPassword);
   
  //  return this.b1.logincheck(loginform.value);

  // }
  public login(loginform:FormGroup) {
    if (loginform.valid) {
      return this.b1.logincheck(loginform.value);
    } else {
      console.error("Invalid form. Please check the entered values.");
      return undefined;
    }

  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email!=null) {
          const userName = user.email;
          this.b1.logincheckgmail(userName);
        } else {
          console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error) => {
      });
  }
}
