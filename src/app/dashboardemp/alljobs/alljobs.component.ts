import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
export interface PostJob {
showDetails: any;
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
  uid: string;
  status: boolean;
  applicants: number;
  experience: String;
}

declare var $: any;

@Component({
  selector: 'app-alljobs',
  templateUrl: './alljobs.component.html',
  styleUrls: ['./alljobs.component.css']
})
export class AlljobsComponent implements OnInit {
  jobs: PostJob[] = [];
  data: any;
  empDetail: any;
  abc: any;
  selectedJob: any;
  empId: string = "0";
  jobTitleFilter: string = '';
  isTableVisible: boolean = false;
  totalPages!: number;
  totalItems!: number;
  isLoading = true;
  // filteredData: any[] = [];
  filteredData: PostJob[] = [];
  currentPage = 1;
  constructor(
    public cookie: CookieService,
    private b1: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient

  ) { }



  ngOnInit(): void {
    this.empId = this.cookie.get('emp');
    console.log("Employee id is: " + this.empId)
    this.fetchEmployerDetails();
  }

  fetchEmployerDetails() {
    // let response = this.b1.fetchemployer();
    let response = this.b1.fetchEmployerById(this.empId);
    response.subscribe((data1: any) => {
      this.empDetail = data1;
      this.fetchJobPostDetails(this.currentPage);
    });

  }


  // fetchJobPostDetails() {
  //   this.b1.fetchjobpost(this.empId).subscribe((data1: any) => {
  //     this.data = data1.filter((job: any) => job.empid == this.abc);
  //     // console.log("checking the console",data1);
  //     // Sort the data by sendTime in descending order
  //     this.filteredData = this.data
  //       .map((job: any) => ({ ...job, showDetails: false }))
  //       .sort((a: PostJob, b: PostJob) => {
  //         const dateA = new Date(a.sendTime || 0);
  //         const dateB = new Date(b.sendTime || 0);
  //         return dateB.getTime() - dateA.getTime();
  //       });

  //     // console.log(this.filteredData);
  //   });
  // }
  performSearchAndFetchJobs(): void {
    this.currentPage=1;
    this.fetchJobPostDetails(this.currentPage);
  }
  fetchJobPostDetails(pageNumber:any) {
    this.isLoading = true;
    const url = `${backendUrl}fetchjobpost`;
    const params = {
      page: pageNumber - 1,
      empid:this.empId,
      searchJobTitle:this.jobTitleFilter
    };

    this.http.get<any>(url, { params }).subscribe({
      next: (response) => {
        this.jobs = response.jobPosts;
        // this.performSearchJobTitle();
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage + 1;;  // Reset current page to 1 for new search
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.isLoading = false;
      }
    });
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.loadJobs(page);
      this.fetchJobPostDetails(page)
    }
  }
  filterByJobTitle() {
    if (!this.jobTitleFilter) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((application: PostJob) =>
        application.jobtitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
      );
    }
  }
  showMoreInfo(job: any): void {
    job.showDetails = !job.showDetails;
    this.cdr.detectChanges();
  }

  fetchAppliedUsers(empid: string, jobid: string) {
    let response = this.b1.fetchapplyformbyjobid(empid, jobid);

    response.subscribe(
      (users: any) => {
        this.selectedJob = { ...this.selectedJob, applicants: users };
        this.openModal();
      },
      (error: any) => {
        // console.error('Error fetching applied users:', error);
        // Handle error and show appropriate message
      }
    );
  }

  openModal() {
    $('.modal').modal('show');
  }

  closeModal() {
    $('.modal').modal('hide');
  }

  editJob(jobid: string) {
    this.router.navigate(['/dashboardemp/updatejob/', jobid]);
  }

  redirectToDashboardEmp() {
    this.router.navigate(['/dashboardemp']);
  }
  showAllApplicantsDetails() {
    this.router.navigate(['/dashboardemp/applieduserdetails'])
  }
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

}
