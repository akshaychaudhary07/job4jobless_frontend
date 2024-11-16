import { HttpClient } from '@angular/common/http';
import { Component,OnInit  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';

interface Job {
  jobid: string;
  empEmail: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: number;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: number;
  payjobsup: number;
  empid: string;
  saveStatus: boolean;
  uid: string;
  sendTime: Date;
  isDescriptionVisible: boolean;
  approvejob: boolean;
  experience: String;
}

@Component({
  selector: 'app-company-jobs',
  templateUrl: './company-jobs.component.html',
  styleUrls: ['./company-jobs.component.css']
})
export class CompanyJobsComponent implements OnInit {

  empid: string = '';
  uid: string ='';
  apiUrl = `${backendUrl}follows/approved-postjobs`;
  API_BASE_URL = `${backendUrl}`;
  loading: boolean = false;
  companyDetails: any = null;
  showDescription: boolean = false;
  jobIdLikedStatusMap: { [key: string]: boolean } = {};
  selectedJob: Job | null = null;

  // jobs: any[] = [];
  jobs: Job[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 2; 

  constructor(private route: ActivatedRoute,private http: HttpClient,
    private cookieService: CookieService,
    private router : Router,
    private b1: UserService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.empid = this.route.snapshot.paramMap.get('id') || '';
    this.uid=this.cookieService.get('uid');
    console.log('Employee id:', this.empid);
    console.log("User id is: "+this.uid);
    this.fetchEmployeeDetails(this.empid);
    this.fetchJobs(this.empid, 0);
  }
  fetchJobs(empid: string, page: number): void {
    this.loading = true;
    this.getApprovedPostJobs(this.uid, page, this.empid, this.pageSize).subscribe(data => {
      if (data && data.jobPosts) {
        this.jobs = data.jobPosts.map((jobPost: any) => ({
          ...jobPost.postJob,
          saveStatus: jobPost.saveStatus
        }));
      } else {
        this.jobs = [];
      }
      this.totalPages = data.totalPages || 0;
      this.currentPage = page;
      this.loading = false;
    }, error => {
      console.error('Error fetching jobs:', error);
      this.loading = false;
    });
  }
  getApprovedPostJobs(uid: string, page: number, empid: string, size: number): Observable<any> {
    const params = { uid, page: String(page), empid };
    return this.http.get<any>(this.apiUrl, { params });
  }

  fetchPrevious(): void {
    if (this.currentPage > 0) {
      this.fetchJobs(this.uid, this.currentPage - 1);
    }
  }

  fetchNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      console.log("Inside fetechNext: "+this.currentPage)
      this.fetchJobs(this.uid, this.currentPage + 1);
    }
  }
  fetchEmployeeDetails(employeeId: string) {
    const apiUrl = `${backendUrl}fetchempById/${employeeId}`; 

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        this.companyDetails = data; 
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching company details:', error);
        this.loading = false; 
      }
    );
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }
  toggleLikedStatus(jobid: string): void {
    const job = this.jobs.find(job => job.jobid === jobid);
    if (job) {
      job.saveStatus = !job.saveStatus;
      const status = job.saveStatus ? 'true' : 'false'; 

      this.updateSavedJobStatus(jobid, this.uid, status).subscribe(response => {
        console.log('Save status updated:', response);
      }, error => {
        console.error('Error updating save status:', error);
        job.saveStatus = !job.saveStatus;
      });
    }
  }

  updateSavedJobStatus(jobid: string, uid: string, status: string): Observable<any> {
    const url = `${this.API_BASE_URL}update-status?jobid=${jobid}&uid=${uid}&status=${status}`;
    return this.http.put(url, {});
  }

  toggleDescriptionVisibility(job: Job): void {
    this.selectedJob = this.selectedJob === job ? null : job;
  }

  applyForJob(selectedJob: Job) {
    if (selectedJob && selectedJob.jobid) {
      this.b1.setJobTitle(selectedJob.jobtitle);
      this.b1.setCompanyName(selectedJob.companyforthisjob);
      this.b1.setEmpId(selectedJob.empid);
      this.b1.setJobId(selectedJob.jobid);

      console.log("User ID is: " + this.uid);
      console.log("Job iD is: " + selectedJob.jobid)
      this.b1.checkAlreadyApplied(selectedJob.jobid, this.uid).subscribe({
        next: (response: string) => {
          console.log("Response is: " + response)
          const jsonResponse = JSON.parse(response); 
          if (jsonResponse.message === "User has already applied for this job") {
            console.log("The user has already applied for this job.");
            this.snackBar.open('You have already applied for this job.', 'Close', {
              duration: 10000, 
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            console.log("The user has not applied for this job.");
            this.b1.checkJobIdExists(selectedJob.jobid).subscribe({
              next: (exists: boolean) => {
                if (exists) {
                  this.router.navigate(['/dashboarduser/questionpaper', selectedJob.jobid]);
                } else {
                  this.router.navigate(['/dashboarduser/applyjob']);
                }
              },
              error: (error) => {
                console.error('Error checking jobid:', error);
                this.router.navigate(['/dashboarduser/applyjob']);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error checking application status:', error);
          this.router.navigate(['/dashboarduser/applyjob']);
        }
      });
    } else {
      console.error('No job selected.');
      this.router.navigate(['/dashboarduser/applyjob']);
    }
  }
}
