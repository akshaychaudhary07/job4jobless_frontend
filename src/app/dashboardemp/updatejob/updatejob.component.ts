import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { backendUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selector: 'app-updatejob',
  templateUrl: './updatejob.component.html',
  styleUrls: ['./updatejob.component.css']
})
export class UpdatejobComponent implements OnInit {
  jobForm!: FormGroup;
  jobid!: string | null;
  private backend_URL=`${backendUrl}`;
 // countries: string[] = [];
 countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  selectedCountry: string = '';
  selectedState: string = '';

  constructor(
    private snackBar:MatSnackBar,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
private locationService: LocationService
  ) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      jobtitle: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empEmail: [
        '',
        [Validators.required, Validators.email,  Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)]
      ],
      companyforthisjob: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      numberofopening: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/), Validators.min(0)]],
      locationjob: ['', Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      // payjobsup: ['',Validators.required],
      descriptiondata: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empid: ['', Validators.required],
      minAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/)]],
      maxAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/)]],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/)]],
      experience: ['', [Validators.required, this.positiveNumberValidator]],
      rate: ['', Validators.required],
      payjobType:['',Validators.required]
    });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });
   
    this.jobForm.get('minAmount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobForm.get('maxAmount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobForm.get('amount')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });
    this.jobForm.get('rate')?.valueChanges.subscribe(() => {
      this.updatePayJobValue();
    });



    this.jobForm.get('country')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobForm.get('state')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobForm.get('city')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    
    this.jobid = this.route.snapshot.paramMap.get('jobid');
    this.fetchJobDetails();
   this.fetchCountries();
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
  
  updatePayJobValue() {
    const payjobValue = this.jobForm.get('payjobType')?.value;
    let combinedValue = '';

    switch (payjobValue) {
      case 'Range':
        const minAmount = this.jobForm.get('minAmount')?.value;
        const maxAmount = this.jobForm.get('maxAmount')?.value;
        const rateRange = this.jobForm.get('rate')?.value;
        if (minAmount && maxAmount && minAmount !== 0 && maxAmount !== 0 && rateRange && minAmount > 0 && maxAmount > 0 ) {
          combinedValue = `Range: ${minAmount} - ${maxAmount} ${rateRange}`;
          this.jobForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Starting_amount':
        const startingAmount = this.jobForm.get('amount')?.value;
        const rateStarting = this.jobForm.get('rate')?.value;
        if (startingAmount && rateStarting && startingAmount > 0) {
          combinedValue = `Starting Amount: ${startingAmount} ${rateStarting}`;
          this.jobForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Exact_Amount':
        const exactAmount = this.jobForm.get('amount')?.value;
        const rateExact = this.jobForm.get('rate')?.value;
        if (exactAmount && rateExact && exactAmount >0 ) {
          combinedValue = `Exact Amount: ${exactAmount}  ${rateExact}`;
          this.jobForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
      case 'Maximum_Amount':
        const maximumAmount = this.jobForm.get('amount')?.value;
        const rateMaximum = this.jobForm.get('rate')?.value;
        if (maximumAmount && rateMaximum && maximumAmount > 0 ) {
          combinedValue = `Maximum Amount: ${maximumAmount}  ${rateMaximum}`;
          this.jobForm.patchValue({
            payjob: combinedValue
          });
        }
        break;
    }
  }


  fetchJobDetails() {
    if (this.jobid) {
      this.http.get(`${this.backend_URL}fetchJobPostById/${this.jobid}`)
        .subscribe({
          next: (response: any) => {
            
            // console.log("show data",response);
            // Assuming response has the job post data in the correct format
            this.jobForm.patchValue(response);
            // Populate form with the job details received
          },
          error: (error: any) => {
            // console.error('Error fetching job details', error);
            // Handle error
          }
        });
    }
  }
  updateJob() {
    const formData = this.jobForm.value;

    this.http.put(`${this.backend_URL}jobpostupdate/${this.jobid}`, formData)
      .subscribe(
       {
        next: (response:any) => {
          this.snackBar.open('JOB UPDATED SUCCESSFULLY', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboardemp/alljobs']);
          // Handle success (e.g., show a success message)
        },
        error:(error:any) => {
          this.snackBar.open(error, 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Handle error (e.g., show an error message)
        }
       }
      );
  }
  updateLocation() {
    const country = this.jobForm.get('country')?.value;
    const state = this.jobForm.get('state')?.value;
    const city = this.jobForm.get('city')?.value;

    // Update the location field
    const countryControl = this.jobForm.get('country');
    const stateControl = this.jobForm.get('state');
    const cityControl = this.jobForm.get('city');
    if (countryControl?.valid && stateControl?.valid && cityControl?.valid) {
      // Update the location field
      this.jobForm.get('locationjob')?.setValue(`${city}, ${state}, ${country}`);
    } else {
      // Clear the location field if any of the fields are not valid
      this.jobForm.get('locationjob')?.setValue('');
    }
  }
}
