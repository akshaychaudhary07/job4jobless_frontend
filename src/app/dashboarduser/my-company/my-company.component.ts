import { Component,OnInit  } from '@angular/core';
import { backendUrl } from 'src/app/constant';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.css']
})
export class MyCompanyComponent implements OnInit {

  apiUrl = `${backendUrl}follows/employer-data`;
  uid: string | undefined;
  employerData: any; 
  companyDetails: any = null;

  employers: any[] = []; 
  totalPages: number = 0;
  currentPage: number = 0;
  totalPagesArray: number[] = [];
  cookie: any;
  isLoading = true; 

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.uid = this.cookieService.get('uid');
    // if (this.uid) {
    //   this.fetchEmployerData();
    // } else {
    //   console.error('UID not found in cookie');
    // }
    this.fetchEmployers(0);
  }
  showDescription = false;

  toggleDescriptionVisibility(employer: { showDescription: boolean; }): void {
    employer.showDescription = !employer.showDescription;
  }
  fetchEmployers(page: number): void {
    this.isLoading=true;
    const uid = this.cookieService.get('uid');
    const url = `${backendUrl}follows/employer-data?uid=${uid}&page=${page}`;

    this.http.get<any>(url).subscribe(
      (data) => {
        console.log('Fetched employers data:', data);
        this.employers = data.employers;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;

        // Generate an array of page numbers for pagination links
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employers:', error);
        // Handle error
      }
    );
  }

  onPageClick(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.fetchEmployers(page);
    }
  }

  getFirstTenWords(description: string): string {
    if (!description) return '';

    const words = description.split(' ');

    const firstTenWords = words.slice(0, 10).join(' ');

    return firstTenWords;
  }

  navigateToDetails(id: string) {
    this.router.navigate(['/dashboarduser/companyjobs', id]);
  }
  preventNavigation(event: Event): void {
    // Prevent navigation when clicking on Company Description button
    event.stopPropagation();
  }

  unfollowEmployee(empid: string): void {
    const url = `${backendUrl}follows`;
    const uid = this.cookieService.get('uid');
  
    const body = {
      uid: uid,
      empid: empid
    };
  
    this.http.post(url, body, { observe: 'response', responseType: 'text' }).subscribe({
      next: (response: HttpResponse<string>) => {
        console.log(response.status, "checking the status");
        if (response.status === 200) {
          alert("Unfollows Successfully..!!!");
          // window.location.reload();
          // this.router.navigate(['company'])
          this.fetchEmployers(0);
        }else if(response.status === 201){
            alert("Follows Successfully...!!!!");
            this.fetchEmployers(0);
            // window.location.reload();
            // this.router.navigate(['dashboarduser/company'])
        } else {
          console.error('Unexpected response status:', response.status);
          alert('Unexpected response status: ' + response.status);
        }
        this.router.navigate(['/dashboarduser/company'])
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error following/unfollowing employee:', error);
        if (error.status === 0) {
          alert('Network error. Please check your connection.');
        } else {
          alert(`Error: ${error.error || 'Error following/unfollowing employee. Please try again.'}`);
        }
      }
    });
  }

  
  
}
