import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { backendUrl } from 'src/app/constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-subadmin',
  templateUrl: './subadmin.component.html',
  styleUrls: ['./subadmin.component.css']
})
export class SubadminComponent implements OnInit{
  adminForm!: FormGroup;
  loading: boolean = false;

  private backend_URL=`${backendUrl}`;
  public passwordVisible: boolean = false;

  constructor(private snackBar:MatSnackBar, private formBuilder: FormBuilder , private http: HttpClient , private router:Router) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      subadminame: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      subadminmail: ['', [Validators.required ,Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]],
      subadminpassword: ['', [Validators.required, Validators.minLength(6) , 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
]],
      manageUsers: [false],
      manageEmployers: [false],
      postJob: [false],
      applyJob: [false],
      manageBlogs: [false],
      pushNotification: [false],
      approveJobDetails:[false],
      enquiry: [false]
    });
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.loading=true;
      console.log(this.adminForm.value);
      this.http.post(`${this.backend_URL}subadmindetails/add`, this.adminForm.getRawValue()).subscribe(
        (payload: any) => {
          console.log("Successfully added to database...");
          console.log("checking after running api", this.adminForm);
          this.snackBar.open('Sub Admin Created Successfully....', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/admin/subadmindetails']);
        },
        (err) => {
          console.error('Some error occurred:', err);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  } 
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
