import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { CookieService } from 'ngx-cookie-service';
import { backendUrl } from 'src/app/constant';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface Job {
  jobid: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
  payjobsup: string;
  empid: string;
  isFollowing: boolean;
  employer: {
    empfname: string;
    emplname: string;
    empcompany: string;
    empmailid: string;
    empid:string
  };
  follow:boolean;
  following:boolean;
}


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  //jobpostData: any[] = []; // Variable to store jobpost data
  filteredJobs: Job[] = [];
  jobpostData: Job[] = [];
  searchTerm: string = ''; // Property to store the search term
  //filteredCompanies: any[] = []; // Declare filteredCompanies as an empty array
  filteredCompanies: Job[] = [];
  itemsPerPage = 6;
  currentPage = 1;
  totalPages!: number;
  isLoading = true;  
  private backend_URL = `${backendUrl}`;
  constructor(private router: Router,private yourHttpService: UserService , private cookie: CookieService , private http: HttpClient) {} // Replace with your actual service

  ngOnInit() {
    // this.yourHttpService.fetchjobpost("",this.currentPage-1).subscribe((data: any) => {
    //   console.log("testing data array element",data.jobPosts);
    //   // console.log("testing data array element",data);
    //   this.jobpostData = data.jobPosts;
    //   this.totalPages = data.totalPages;
    //   this.currentPage = data.currentPage + 1;
    //   // this.jobpostData = data;
    //   // this.totalPages = Math.ceil(this.jobpostData.length / this.itemsPerPage);
    //   this.filterCompanies();
    // }); 
    this.fetchCompany(this.currentPage);
  }

  searchCompanies() {
    this.currentPage = 1;
    this.fetchCompanyName(this.currentPage);
    // this.fetchCompany(this.currentPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.loadJobs(page);
      this.fetchCompany(page)
    }
  }

  filterCompanies(): void {
    // Filter the data based on the search term
    const filteredData = this.jobpostData.filter((company) => {
      return (
        company.jobtitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.companyforthisjob.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredCompanies = filteredData.slice(startIndex, endIndex);
  }

  fetchCompanyName(pageNumber:any):void{
    this.isLoading = true;
    // this.yourHttpService.fetchjobpost("",pageNumber-1,this.searchTerm).subscribe((data: any) => {
    //   console.log("testing data array element",data.jobPosts);
    //   // console.log("testing data array element",data);
    //   this.jobpostData = data.jobPosts;
    //   this.totalPages = data.totalPages;
    //   this.currentPage = data.currentPage + 1;
    //   this.filteredJobs=this.jobpostData;
    //   this.isLoading = false;
    // });
    const uid = this.cookie.get('uid');

    this.yourHttpService.fetchEmployer(undefined, pageNumber - 1, this.itemsPerPage, undefined,this.searchTerm, undefined).subscribe((data: any) => {
      console.log("Fetched employers data", data);
      this.jobpostData = data.employers;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage + 1;
      this.filteredJobs = this.jobpostData;
      this.isLoading = false;
      this.filterCompanies();
    });
  }
  fetchCompany(pageNumber:any):void{
    this.isLoading = true;
    const uid = this.cookie.get('uid');

    const searchTermLower = (this.searchTerm || '').toLowerCase();

    this.yourHttpService.fetchEmployer(undefined, pageNumber - 1, this.itemsPerPage, undefined,searchTermLower, uid).subscribe((data: any) => {
      console.log("Fetched employers data", data);
      this.jobpostData = data.employers;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage + 1;
      this.filteredJobs = this.jobpostData;
      this.isLoading = false;
      this.filterCompanies();
    });
  }

  followEmployee(job: Job): void {
    const url = `${backendUrl}follows`;
    console.log("The userID is: " + this.cookie.get('uid'));
    console.log("The empID is: " + job.employer.empid);
  
    const uid = this.cookie.get('uid');
  
    const body = {
      uid: uid,
      empid: job.employer.empid
    };
  
    this.http.post(url, body, { observe: 'response', responseType: 'text' }).subscribe({
      next: (response: HttpResponse<string>) => {
        if (response.status === 200) {
          alert("Unfollowed Successfully..!!!");
          // window.location.reload();
          job.follow = false;
        }else if(response.status === 201){
            alert("Followed Successfully...!!!!");
            // window.location.reload();
            job.follow = true;
        } else {
          console.error('Unexpected response status:', response.status);
          alert('Unexpected response status: ' + response.status);
        }
        this.router.navigate(['/dashboarduser/company']);
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