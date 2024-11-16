import { Component, OnInit  } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { JobPostService } from 'src/app/auth/job-post.service';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../location.service';
// import { NgxEditorComponent } from 'ngx-editor';
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
interface PostJob {
  jobid: string;
  empName: string;
  empEmail: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: number;
  locationjob: string;
  jobtype: string;
  schedulejob: string;
  payjob: number;
  payjobsup: number;
  descriptiondata: string;
  empid: string;
  sendTime: Date;
  experience:String;
}

function nameValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const nameRegex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces

  if (!nameRegex.test(control.value)) {
    return { 'invalidName': true };
  }
  return null;
}
@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  jobPostForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  abc: any;
	  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
jobid!: string;
 // countries: string[] = [];
  selectedExperience: string = 'fresher';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private jobPostService: JobPostService,
    private userService: UserService,
    public cookie: CookieService,
    private http: HttpClient,
private locationService: LocationService
  ) { }

  positiveNumberPattern = /^[0-9]+(?:[,.][0-9]+)?$/;

  ngOnInit(): void {

   this.fetchCountries();
    this.currentStep = 1;
    // Initialize the form with default values and validations
    this.jobPostForm = this.formBuilder.group({
      jobtitle: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empName: ['', [Validators.required, nameValidator]],
      empEmail: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)
      ]
      ],
      companyforthisjob: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      numberofopening: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/), Validators.min(0)]],
      locationjob: ['', Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      experience: ['', [Validators.required,Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/), Validators.min(0) , this.positiveNumberValidator]],
      descriptiondata: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empid: ['', Validators.required],
      minAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/) , Validators.min(0)]],
      maxAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/) , Validators.min(0)]],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/) , Validators.min(0)]],
      rate: ['', Validators.required],
      payjobType:['',Validators.required]
      
    });


    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });

    this.jobPostForm.get('minAmount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobPostForm.get('maxAmount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobPostForm.get('amount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobPostForm.get('rate')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });

    this.abc = this.cookie.get('emp');
    this.jobPostForm.get('empid')?.setValue(this.abc);

    const savedData = this.jobPostService.loadFormData();
    if (savedData) {
      this.jobPostForm.patchValue(savedData);
      this.currentStep = savedData.currentStep || 1;
    }
    this.jobPostForm.get('country')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobPostForm.get('state')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobPostForm.get('city')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
  }

  // Apply rich text editor command
  applyCommand(command: string): void {
    document.execCommand(command, false, '');
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
  updateLocation() {
    const country = this.jobPostForm.get('country')?.value;
    const state = this.jobPostForm.get('state')?.value;
    const city = this.jobPostForm.get('city')?.value;

    // Update the location field
    const countryControl = this.jobPostForm.get('country');
    const stateControl = this.jobPostForm.get('state');
    const cityControl = this.jobPostForm.get('city');
    if (countryControl?.valid && stateControl?.valid && cityControl?.valid) {
      // Update the location field
      this.jobPostForm.get('locationjob')?.setValue(`${city}, ${state}, ${country}`);
    } else {
      // Clear the location field if any of the fields are not valid
      this.jobPostForm.get('locationjob')?.setValue('');
    }
  }



  updatePayJobValue() {
    const payjobValue = this.jobPostForm.get('payjobType')?.value;
    let combinedValue = '';

    switch (payjobValue) {
      case 'Range':
        const minAmount = this.jobPostForm.get('minAmount')?.value;
        const maxAmount = this.jobPostForm.get('maxAmount')?.value;
        const rateRange = this.jobPostForm.get('rate')?.value;
        if (minAmount && maxAmount && minAmount !== 0 && maxAmount !== 0 && rateRange && minAmount > 0 && maxAmount > 0 ) {
          combinedValue = `Range: ${minAmount} - ${maxAmount} ${rateRange}`;
          this.jobPostForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Starting_amount':
        const startingAmount = this.jobPostForm.get('amount')?.value;
        const rateStarting = this.jobPostForm.get('rate')?.value;
        if (startingAmount && rateStarting && startingAmount > 0) {
          combinedValue = `Starting Amount: ${startingAmount} ${rateStarting}`;
          this.jobPostForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Exact_Amount':
        const exactAmount = this.jobPostForm.get('amount')?.value;
        const rateExact = this.jobPostForm.get('rate')?.value;
        if (exactAmount && rateExact && exactAmount >0 ) {
          combinedValue = `Exact Amount: ${exactAmount}  ${rateExact}`;
          this.jobPostForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Maximum_Amount':
        const maximumAmount = this.jobPostForm.get('amount')?.value;
        const rateMaximum = this.jobPostForm.get('rate')?.value;
        if (maximumAmount && rateMaximum && maximumAmount > 0 ) {
          combinedValue = `Maximum Amount: ${maximumAmount}  ${rateMaximum}`;
          this.jobPostForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
    }

    // Update the 'payjob' form control value
    // this.jobPostForm.patchValue({
    //   payjob: combinedValue
    // });
  }
  // Handle form submission


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




  jobDetailsForm(jobPostForm: { value: any }): void {
    this.jobPostService.saveFormData(jobPostForm.value);

    if (this.currentStep === this.totalSteps) {
      this.userService.jobpostinsert(jobPostForm.value).subscribe({
        next: (resp: any) => {
          // console.log('Complete Response:', resp);

          if (resp !== null) {
            this.currentStep = 1;
            this.jobid = resp;
            this.router.navigate(['/dashboardemp/set-question', this.jobid]);

            localStorage.removeItem('jobPostForm');
            this.jobPostService.clearFormData();
          } else {
            // console.error('Job Id is null or undefined in the response.');
          }
        },

        error: (err: any) => {
          // console.error(err);
        }
      });
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // console.log("Inside the Next Step")
      if (this.currentStep === 1) {
        const jobTitleControl = this.jobPostForm.get('jobtitle');
        const companyforthisjobControl = this.jobPostForm.get('companyforthisjob');
        const empNameControl = this.jobPostForm.get('empName');
        const empEmailControl = this.jobPostForm.get('empEmail');

        if (jobTitleControl?.value && companyforthisjobControl?.value && empNameControl?.value && empEmailControl?.value) {
          // console.log("All required fields are valid....");
          this.currentStep++;
          this.jobPostService.saveFormData({
            ...this.jobPostForm.value,
            currentStep: this.currentStep
          });

        } else {
          // console.log("One or more required fields are empty.");
          // Handle empty fields, e.g., display error message
        }
      }

      if (this.currentStep === 2) {
        const openings = this.jobPostForm.get('numberofopening');
        const location = this.jobPostForm.get('locationjob');
        const jobType = this.jobPostForm.get('jobtype');
        const scheduleJob = this.jobPostForm.get('schedulejob');
        const payJob = this.jobPostForm.get('payjob');
        const desc = this.jobPostForm.get('descriptiondata');


        if (openings?.value && location?.value && jobType?.value && scheduleJob?.value && payJob?.value && desc?.value) {
          // console.log("All required fields are valid....");
          this.currentStep++;
          this.jobPostService.saveFormData({
            ...this.jobPostForm.value,
            currentStep: this.currentStep
          });

        } else {
          // console.log("One or more required fields are empty.");
    
        }
      }


    }

 
  }

  // Navigate to the previous step
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }

    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep
    });
  }

}
