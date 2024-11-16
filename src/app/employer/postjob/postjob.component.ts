import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {


  companyswitch!: FormGroup;
  formSubmitted: any;
  data: any;


  constructor(private snackBar:MatSnackBar, private formBuilder: FormBuilder, private router: Router,private b1:UserService) { }



  ngOnInit(): void {
    this.companyswitch = this.formBuilder.group({
      empcompany: ['', [Validators.required]],
      empmailid: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)],
      ],
      emppass: ['', [Validators.required]],
      termsCheckbox: [false, Validators.requiredTrue]
    });
    // let responce = this.b1.viewemployerdetailservice();
    // responce.subscribe((data1:any)=>this.data=data1);
    const showPostJobButtons = document.getElementsByClassName('showPostJob');
    const popupDialogJob = document.getElementById('popupDialogJob');
    const closeButtonJob = document.getElementById('closeButtonJob');


  }


  get termsCheckbox() {
    return this.companyswitch.get('termsCheckbox');
  }
  // Custom validator for Gmail
  gmailValidator(control: { value: string; }) {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { invalidGmail: true };
    }
    return null;
  }


  switchtoemployer() {
    if (this.companyswitch.valid) {
      // console.log(this.companyswitch.getRawValue());
      // console.log(this.companyswitch);
      return this.b1.logincheckemp(this.companyswitch.getRawValue());
    } else {
      this.snackBar.open('Form is not valid. Please check the fields.', 'Close', {
        duration: 10000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return; // Return early to prevent further execution
    }
  }
  

}
