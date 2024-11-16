import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';
import { UserService } from 'src/app/auth/user.service';
import * as intelInput from "intl-tel-input";
import { backendUrl } from 'src/app/constant';
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




interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
  userlinkden:String,
  usergithub:String,
  otherturluser:String
}

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit {
  userform!: FormGroup;
//  countries: string[] = [];
  
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  selectedCountry: string = '';
  selectedState: string = '';


userData1: any;
  abc: any;
  uid!: string | null;
  constructor(
    private formBuilder: FormBuilder,
    private b1: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public cookie: CookieService,
    private http: HttpClient,
private locationService: LocationService
  ) { }

  userID: String = "0";

  private backend_URL=`${backendUrl}`;

  ngOnInit() {
   this.fetchCountries();
    const innputElement = document.getElementById("empphone");
    if (innputElement) {
      intelInput(innputElement, {
        initialCountry: "US",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js"
      })
    }

    this.userID = this.cookie.get('uid');
    this.fetchUserDetailById(this.userID);
    // console.log(this.userID);
    // console.log('User ID from cookie:', this.userID);

    // let response = this.b1.fetchuser();

    // response.subscribe((data1: any) => {
    //   // Debugging: Log the data received from the API
    //   // console.log('Data from API:', data1);
    //   const uuid = this.userID;
    //   // console.log(uuid);

    //   // Filter the data array to include only the user with the matching userID
    //   // this.data = data1.find((user: any) => user.uid === uuid);
    //   this.userData1 = data1.find((user: any) => user.uid == uuid);
    //   // console.log(this.userData1);
    //   // Debugging: Log the filtered data
    //   // console.log('Filtered Data:', this.userData1);
    //   this.abc = this.userData1.uid;
    //   // console.log(this.abc);
    // });

    // Initialize the form with default values or load existing employee data
    this.userform = this.formBuilder.group({
      uid: [this.userID, Validators.required],
      userFirstName: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      userLastName: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
  

      userphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      usercountry: ['', Validators.required],
      userstate: ['',  [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      usercity: ['',  [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      // websiteuser: ['', Validators.required],
      userlinkden: ['', Validators.required],
      usergithub: ['', Validators.required],
      otherturluser: ['']
      // Set the default value for userName using abc
      // This line sets the default value for userName
    });

    // this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
    //   this.countries = data.map(country => country.name.common);
    // });

    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });

    this.uid = this.route.snapshot.paramMap.get('uid');
    // this.fetchUserDetailById();
  }
  fetchUserDetailById(userId: String) {
    this.http.get<User>(`${this.backend_URL}fetchuserById/${userId}`)
      .subscribe({
        next: (response: User) => {
          console.log("User Old Details", response);
          this.userform.patchValue(response);
        },
        error: (error) => {
          console.error('Error fetching user details', error);
          // Optionally, handle user-facing error feedback
        }
      });
  }
  updateUser() {
    if (this.userform.valid) {
      // Extract updated user data from the form
      const updatedUser = this.userform.value;
      // console.log(updatedUser);
      this.b1
        .updateUser(updatedUser)
        .pipe(
          catchError((error) => {
            // Handle the error response here
            console.error('Error updating profile:', error);
            return throwError(error); // Re-throw the error
          })
        )
        .subscribe({
          next: (response) => {
            // Handle the success response here
            // console.log('Profile updated successfully:', response);
            alert("Profile updated successfully");
            this.router.navigate(['/dashboarduser/userprofile']);
          },
          complete: () => {
            // This block is optional and can be used for handling completion
          }
        });
    } else {
      console.error('Form is invalid. Cannot update profile.');
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
}
