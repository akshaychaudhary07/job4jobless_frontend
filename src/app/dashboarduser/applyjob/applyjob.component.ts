import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
import { AbstractControl } from '@angular/forms';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-applyjob',
  templateUrl: './applyjob.component.html',
  styleUrls: ['./applyjob.component.css']
})
export class ApplyjobComponent implements OnInit {
  userService: any;
  user: User | undefined;
  userData: any;
  juname: string | undefined;
  noLeadingSpace: any | string;
  totalExperienceDisabled: boolean = true;
  onExperienceTypeChange() {
    this.isExperienced = this.myformsubmission.get('selectedExperience')?.value === 'experienced';
    if (!this.isExperienced) {
      this.myformsubmission.get('totalExperience')?.setValue(0);
      this.myformsubmission.get('years')?.setValue(0); // Reset years to 0
      this.myformsubmission.get('months')?.setValue(0); // Reset months to 0
    }
  }

  selectedFile: File | null = null;
  jobTitle: string | null = null;
  companyName: string | null = null;
  jobIda: string | null = null;
  empId: string | null = null;
  imageSrc: string = 'https://global.discourse-cdn.com/turtlehead/optimized/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace_2_250x250.png';
  myformsubmission!: FormGroup; // Initialize with an empty group
  currentStep = 1;
  totalSteps: number = 3;
  data: any;
  uid!: string;
  pdfFile: boolean = false;
  formValues: any = {};
  selectedExperience: string = 'fresher';
  isExperienced: boolean = false;

  private backend_URL = `${backendUrl}`;
  totalExperience: number | undefined;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private b1: UserService, private cookie: CookieService) { }
  ngOnInit(): void {
    this.myformsubmission = this.formBuilder.group({
      juname: [''],
      jumail: [''],
      juresume: [''],
      jucompny: ['',Validators.required],
      jutitle: ['', Validators.required],
      jurelocation: ['commute'],
      jueducation: ['bachelor'],
      juinterviewdate: [''],
      years: ['0'],
      months: ['0'],
      jujobtitle: [''],
      jucompanyname: [''],
      empid: ['', Validators.required],
      jobid: ['', Validators.required],
      selectedExperience: ['fresher'],
      juexperience: ['0'],
      totalExperience: ['0']
    });

    this.companyName=this.b1.companyNameUserService;
    this.myformsubmission.get('jucompny')?.setValue(this.companyName);

    this.jobTitle=this.b1.jobNameUserService;
    this.myformsubmission.get('jutitle')?.setValue(this.jobTitle);

    this.jobIda=this.b1.jobidUserService;
    this.myformsubmission.get('jobid')?.setValue(this.jobIda);

    this.empId=this.b1.empidUserService;
    this.myformsubmission.get('empid')?.setValue(this.empId);

    this.uid = this.cookie.get('uid');
    console.log("The uid of the user is: ", this.uid)
    this.fetchUserData(this.uid);
    this.initializeForm();
    this.loadFormDataFromLocalStorage();


    // this.myformsubmission.get('jutitle')?.setValue(this.jobTitle);
    // this.myformsubmission.get('empid')?.setValue(this.empId);
    // this.myformsubmission.get('jobid')?.setValue(this.jobIda);

    if (this.uid) {
      console.log("I am going to call you the fetchUserData function: ")
      this.fetchUserData(this.uid);
    } else {
      console.error('User ID is not available.');
    }
  }
  updateTotalExperience() {
    const years = parseInt(this.myformsubmission.get('years')?.value) || 0;
    const months = parseInt(this.myformsubmission.get('months')?.value) || 0;
    this.totalExperience = years + months / 12; 
    console.log("Value of years is: " + years);
    console.log("Value of months is: " + months);
    console.log("Experience is: " + this.totalExperience);
    this.myformsubmission.get('juexperience')?.setValue(this.totalExperience);
  }
  
  fetchUserData(uid: string): void {
    console.log("Fetching user data for UID:", uid);
    const url = `${backendUrl}fetchuserById/${uid}`;
  
    this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user data:', error);
        return [];
      })
    ).subscribe((userData: any) => {
      console.log('User data:', userData);
  
      // Check if myformsubmission is not null
      if (this.myformsubmission) {
        // Check if juname control exists in the form group
        const junameControl = this.myformsubmission.get('juname');
        const jumail = this.myformsubmission.get('jumail')
        if (junameControl && jumail) {
          // Patch the value if juname control exists
          junameControl.patchValue(userData?.userFirstName + " " + userData?.userLastName);
          jumail.patchValue(userData?.userName);
          
          // Log the updated value of juname
          console.log('User name is:', junameControl.value);
          console.log('User email is:', jumail.value);
        } else {
          console.error('juname control does not exist in myformsubmission');
        }
      } else {
        console.error('myformsubmission is null');
      }
    });
  }
  
  

  initializeForm() {
    console.log("Initializing the form....")
    this.myformsubmission = this.formBuilder.group({
      juname: [this.user?.userFirstName + ' ' + this.user?.userLastName || '', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/),
        this.noLeadingSpace
      ]],
      jumail: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      jucompny: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      jutitle: ['', Validators.required],
      juresume: ['', [Validators.required]],
      jurelocation: ['', [Validators.required]],
      jueducation: ['', [Validators.required]],
      juinterviewdate: ['', [Validators.pattern(/^[\d,-]+$/)]],
      jujobtitle: ['', [Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      jucompanyname: ['', [Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empid: ['', Validators.required],
      jobid: ['', Validators.required],
      experienceType: ['fresher', Validators.required],
      years: ['0', Validators.pattern(/^[0-9]+$/)],
      months: ['0', Validators.pattern(/^[0-9]+$/)],
      juexperience: ['0'],
      uid: this.uid
    });
    console.log("The user name is: ",this.juname)
    console.log("The value of juname is: ",this.juname)
  }
  userData$: Observable<User> | undefined;
  fetchUserById(uid: string): Observable<User> {
    const url = `${backendUrl}fetchuserById/${uid}`;
    console.log("User id is given: ", uid);
    return this.http.get<User>(url).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
  fetchUserDetails(): void {
    console.log("The USER ID is: ", this.userId)
    this.userService.fetchUserById(this.userId).subscribe(
      (user: User) => {
        // Handle successful response
        console.log('Full User Information:', user);
      },
      (error: any) => {
        // Handle error
        console.error('Error fetching user:', error);
      }
    );
  }

  userId(userId: any) {
    throw new Error('Method not implemented.');
  }

  loadFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('applyJobFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.myformsubmission.patchValue(formData);
    }
  }

  saveFormDataToLocalStorage() {
    localStorage.setItem('applyJobFormData', JSON.stringify(this.myformsubmission.value));
  }

  positiveNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Allow empty value
    }

    const isNegative = value.toString().startsWith('-');
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

    if (!isNumber || isNegative) {
      return { 'positiveNumber': true };
    }

    return null;
  }

  insertUserForma(myformsubmission: { value: any; }) {
    if (this.currentStep == this.totalSteps) {
      myformsubmission.value.jobid = this.jobIda;
      myformsubmission.value.uid = this.uid;

      const submissionResult = this.b1.insertapplyjob(myformsubmission.value);

      this.router.navigate(['/dashboarduser/myjobs']);
    } else {
      this.router.navigate(['/dashboarduser/applyjob']);
    }

    localStorage.removeItem('applyJobFormData');
  }

  noLeadingSpaceValidator(control: any) {
    if (control.value && control.value.trimLeft()[0] === ' ') {
      return { 'leadingSpace': true };
    }
    return null;
  }

  ngOnDestroy() {
    this.saveFormDataToLocalStorage();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.currentStep === 1) {
        const name = this.myformsubmission.get('juname');
        const mail = this.myformsubmission.get('jumail');
        const resume = this.myformsubmission.get('juresume');

        if (name?.value && mail?.value && resume?.value) {
          this.currentStep++;
          this.uploadFile();
          this.saveFormDataToLocalStorage();
          console.log("Data added successfully.....")
        } else {
          // Handle empty fields
        }
      }else if (this.currentStep === 2) {
        const jrelocation = this.myformsubmission.get('jurelocation');
        const jeducation = this.myformsubmission.get('jueducation');
        let juexperience = this.totalExperience;
      
        // Set totalExperience to 0 if it's undefined
        if (juexperience === undefined) {
          juexperience = 0;
        }
      
        if (jrelocation?.value && jeducation?.value && juexperience !== undefined) {
          this.onExperienceTypeChange();
          this.currentStep++;
          this.saveFormDataToLocalStorage();
          console.log("Total experience is: " + juexperience)
          console.log("Data for step 2 added successfully.....");
        } else {
          console.log(jrelocation?.value)
          console.log(jeducation?.value)
          console.log("Total experience is: " + juexperience)
          console.log("Step 2 form data incomplete");
          // Handle empty fields
        }
      }else if (this.currentStep === 3) {
        const jujobtitle = this.myformsubmission.get('jujobtitle');
        const jucompanyname = this.myformsubmission.get('jucompanyname');
  
        if (jujobtitle?.value && jucompanyname?.value) {
          this.currentStep++;
          this.saveFormDataToLocalStorage();
          console.log("Data added successfully.....")
        } else {
          // Handle empty fields or any other validation errors
        }
      }
    }
  }

  prevStep() {
    this.currentStep--;
    this.saveFormDataToLocalStorage();
  }

  onImageSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  fileValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (!file) {
      return { required: true };
    }

    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.indexOf(fileExtension) === -1) {
      return { invalidExtension: true };
    }

    return null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.myformsubmission.get('juresume')?.setErrors({ 'invalidFormat': true });
    }
  }

  uploadFile() {
    if (this.selectedFile && this.uid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('uid', this.uid);

      this.http.post(`${this.backend_URL}uploadPdf`, formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully');
          this.saveFormDataToLocalStorage();
        },
        error: (error: any) => {
          console.error('File upload failed:', error);
        }
      });
    }
  }
}
