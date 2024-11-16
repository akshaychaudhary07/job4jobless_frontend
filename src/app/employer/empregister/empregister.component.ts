import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import * as intelInput from "intl-tel-input";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { backendUrl , OtpUrl} from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


import { LocationService } from '../../location.service';




interface Country {
  iso2: string;
  name: string;
}

interface State {
  iso2: string;
  name: string;
}

interface City {
  name: string;
}

@Component({
  selector: 'app-empregister',
  templateUrl: './empregister.component.html',
  styleUrls: ['./empregister.component.css']
})
export class EmpregisterComponent implements OnInit {
  private backend_URL = `${backendUrl}`;
  private Otp_Url = `${OtpUrl}`;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
  showWebsiteInputBox: boolean = false;
  showLinkedInputBox: boolean = false;
  showOtherInputBox: boolean = false;

  toggleWebsiteInputBox(event: any) {
    this.showWebsiteInputBox = event.target.checked;
  }

  toggleLinkedInputBox(event: any) {
    this.showLinkedInputBox = event.target.checked;
  }

  toggleOtherInputBox(event: any) {
    this.showOtherInputBox = event.target.checked;
  }

  isHovered = false;
  //countries: string[] = [];
  employerdetails!: FormGroup;
  formSubmitted: any;
  empPasswordVisible: boolean = false;
  data1: any;
  successMessage: string | null = null;
  showWarning: boolean = false;
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    outline: true,
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  loading: boolean = false; // Added loading flag
  constructor(private formBuilder: FormBuilder, private router: Router, private b1: UserService, private http: HttpClient,
    private snackBar: MatSnackBar,private locationService: LocationService , private dialog: MatDialog) {
  }
  ngOnInit(): void {
    // const innputElement = document.getElementById("empphone");

    // if (innputElement) {
    //   intelInput(innputElement, {
    //     initialCountry: "In",
    //     separateDialCode: true,
    //     utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js"
    //   })
    // }
    this.employerdetails = this.formBuilder.group({
      empfname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      emplname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empmailid: ['', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]],
      emppass: ['',[Validators.required , Validators.minLength(8) , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/><])[A-Za-z\d@$!%*?&#/><]+$/)
    ]],
      empphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      empcompany: ['', [Validators.required , Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      descriptionemp: ['', Validators.required],
      empcountry: ['', Validators.required],
      empstate: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      empcity: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      emplinkden: [''],
      designation: ['', [Validators.required , Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      websiteUrl: [''],
      empotherurl: ['']
    });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });
    this.fetchCountries();
  }

  verifyPasswordf()
  {
    this.router.navigate(['/employer/resetpass']);
  }

  empRegisteration(): void {
    if (this.employerdetails.valid) {
      this.loading=true;
      // console.log(this.employerdetails);
      this.http.post(`${this.backend_URL}insertEmployer`, this.employerdetails.getRawValue()).subscribe(
        (payload: any) => {
          // console.log("checking after running api", this.employerdetails);
          this.successMessage = 'User registered successfully! Please Wait..';
          this.generateOtp(payload);
        },
        (err) => {
          
          this.loading=false;
          if (err.status === 409) {
            this.snackBar.open('User with this Email Id already exist....', 'Close');
          }
          else if (err.status === 400) {
            this.snackBar.open('Please fill all the fields...', 'Close');
          }
          else {
            this.snackBar.open('Some error occured', 'Close');
          }
          // console.error('Some error occurred: ', err);
        }
      );
    } else {
      this.employerdetails.markAllAsTouched();
    }
  }
 // Fetch countries on initialization
  fetchCountries(): void {
    this.locationService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort countries alphabetically
      },
      (error: any) => {
        console.error('Error fetching countries', error);
      }
    );
  }

  // Fetch states when a country is selected
  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.selectedCountry = selectElement.value;
      this.fetchStates(this.selectedCountry);
      this.selectedState = ''; // Reset selected state and cities
      this.cities = []; // Clear cities
    }
  }

  // Fetch states for the selected country
  fetchStates(countryCode: string): void {
    this.locationService.getStates(countryCode).subscribe(
      (data: State[]) => {
        this.states = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort states alphabetically
      },
      (error: any) => {
        console.error('Error fetching states', error);
      }
    );
  }

  // Fetch cities when a state is selected
  onStateChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      this.selectedState = selectElement.value;
      this.fetchCities(this.selectedCountry, this.selectedState);
    }
  }

  // Fetch cities for the selected state
  fetchCities(countryCode: string, stateCode: string): void {
    this.locationService.getCities(countryCode, stateCode).subscribe(
      (data: City[]) => {
        this.cities = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort cities alphabetically
      },
      (error: any) => {
        console.error('Error fetching cities', error);
      }
    );
  }
  togglePasswordVisibility(): void {
    const passwordInput: HTMLInputElement | null = document.getElementById("password-input") as HTMLInputElement;
    const eyeIcon: HTMLElement | null = document.getElementById("eye-icon");
  
    if (passwordInput && eyeIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
      }
    }
  }

  loginWithGoogle() {
    this.b1.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log('Authenticated');
        // console.log('User Info:', user);
        const empmailid = user.email;
        const empfname = user.displayName;
        if (user.email && user.displayName) {
          const empmailid = user.email;
          const empfname = user.displayName;
          this.b1.createOrGetEmployer(empmailid, empfname);
        }
        else {
          // console.error('Employer email is null. Handle this case as needed.');
        }
      })
      .catch((error: any) => {
        // console.error('Authentication Error:', error);
      });
  }
  generateOtp(payload: any) {
    this.http.post(`${this.Otp_Url}generateOtp`, { uid: payload.empid, email: payload.empmailid }).subscribe({
      next: (response: any) => {
        if (response.otpCreated) {
          this.router.navigate(['/employer/optverify', payload.empid]);
        } else {
          // console.error('Otp not generated');
        }
      },
      error: (err: any) => {
        // console.error(`Some error occurred: ${err}`);
      },
      complete: () => {
        this.loading = false; // Hide loader after OTP generation is completed
      }
    });
  }
  toggleEmpPasswordVisibility() {
    this.empPasswordVisible = !this.empPasswordVisible;
  }

}
