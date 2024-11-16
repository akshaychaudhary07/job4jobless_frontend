import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Job {
  jobid: string;
  empEmail:string;
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
  saveStatus:boolean;
  uid:string; 
  sendTime:Date;
  isDescriptionVisible: boolean;
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  liked: boolean = false;
  // data1: any;
  data1:Job[]=[];
  searchQuery: string = '';
  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];
  // itemsPerPage = 5;
  currentPage = 1;
  totalPages!: number;
  searchJobTitle: string = '';
  searchLocation: string = '';
  filteredJobs: Job[] = [];
  private jobStatus: boolean = true;
  uid!: string;
  isLoading: boolean = true;
  totalItems: any;
  constructor(private router: Router, private b1: UserService , private cookie:CookieService,private snackBar: MatSnackBar) {}

  performSearch() {
    this.filterJobs();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs(page)
    }
  }
  userID: String = '0';
  ngOnInit(): void {
    this.uid = this.cookie.get('uid');
    console.log("User ID is: "+this.uid)
    this.loadJobs(this.currentPage);
  }
  loadJobs(page: number): void {
    this.isLoading = true;
      this.b1.fetchJobPostsWithStatuscheck(this.uid,page-1).subscribe(
      (responseData: any) => {
        this.data1 = responseData.jobPosts.filter((job: Job) => job.saveStatus);
        // console.log("These are saved jobs: " + this.data1.map(job => JSON.stringify(job)).join(", "));
        console.log("These are saved jobs: " + this.data1);

        this.totalPages = responseData.totalPages;
        this.currentPage = responseData.currentPage + 1; 
        this.totalItems = responseData.totalItems;
        this.filterJobs();
        this.isLoading = false;

        if (this.data1.length === 0) {
          this.isLoading = false; // Disable loader
        }

        this.data1.forEach((job: Job) => {
          job.isDescriptionVisible = false;
        });
      },
      (error) => {
        console.error('Error fetching job posts', error);
        this.isLoading = false;
      }
    );
  }
  searchJobs() {
    this.data = this.data1.filter((job: Job) => {
      const titleMatch = job.jobtitle.toLowerCase().includes(this.searchQuery.toLowerCase());
      const locationMatch = job.locationjob.toLowerCase().includes(this.searchQuery.toLowerCase());
      return titleMatch || locationMatch;
    });
  }
  navigateToSignIn() {
    this.router.navigate(['/login']);
  }
  toggleDescriptionVisibility(job: Job): void {
    this.selectedJob = this.selectedJob === job ? null : job;
  }
  navigateToSignUp() {
    this.router.navigate(['/register']);
  }
  // getJobsForCurrentPage(): Job[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.filteredJobs.slice(startIndex, endIndex);
  // }
  applyForJob(selectedJob: Job) {
    if (selectedJob) {  
      this.b1.setJobTitle(selectedJob.jobtitle);
      this.b1.setCompanyName(selectedJob.companyforthisjob);
      this.b1.setEmpId(selectedJob.empid);
      this.b1.setJobId(selectedJob.jobid);
      // this.router.navigate(['/dashboarduser/questionpaper']);
      console.log("User ID is: " + this.uid);
      console.log("Job iD is: " + selectedJob.jobid)
      this.b1.checkAlreadyApplied(selectedJob.jobid, this.uid).subscribe({
        next: (response: string) => {
          console.log("Response is: " + response)
          const jsonResponse = JSON.parse(response); // Parse the JSON response
          if (jsonResponse.message === "User has already applied for this job") {
            this.snackBar.open('You have already applied for this job....', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            console.log("The user has not applied for this job.");
            // Proceed with checking if the job ID exists
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
    }
  }
  filterJobs(): void {
    console.log(this.searchJobTitle, this.searchLocation);
    if (this.searchJobTitle || this.searchLocation) {
      console.log("The saved jobs are: "+this.data1)
      this.filteredJobs = this.data1.filter((job: Job) => {
        const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
        const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
        console.log("The filtered jobs are: "+this.filteredJobs)
        return titleMatch && locationMatch && job.saveStatus;
      });
    } else {
      this.filteredJobs = this.data1.filter((job:Job) => job.saveStatus); 
    }
    // this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    // this.currentPage = 1;
  }
jobIdLikedStatusMap: { [key: string]: boolean } = {};
toggleLikedStatus(jobid: string): void {
  const uid = this.cookie.get('uid');
  console.log(uid);
  console.log(jobid);
  this.b1.updateSavedJobStatus(jobid, uid).subscribe(
    (response: any) => {
      console.log('Check the values', response);
      if (response.saveStatus != null) {
        console.log('Job status updated successfully.');
        this.jobIdLikedStatusMap[jobid] = response.saveStatus;
        this.filterJobs();
        this.snackBar.open('Removed Job Successfully.', 'Close', {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/dashboarduser']);
      } else {
        console.error('Job status update failed.');
      }
    },
    (error) => {
      console.error('Error updating job status:', error);
    }
  );
}
//   searchJobTitle: string = '';
//   searchLocation: string = '';
//   filteredJobs: Job[] = [];

//   showJobFeed = false;
//   showJobSearches = false;
  
  
//   selectedJob: Job | null = null;
//   data: Job[] = [];
//   datajobs: any;
//   userData1: any;
//   abc: any;
//   user: any;

//   showContainer(containerId: string): void {
//     this.showJobFeed = false;
//     this.showJobSearches = false;

//     if (containerId === 'jbfeed') {
//       this.showJobFeed = true;
//     } else if (containerId === 'showsearches') {
//       this.showJobSearches = true;
//     }
//   }

//   constructor(private router: Router, public cookie: CookieService, private b1: UserService) {}

//   selectJob(data: Job): void {
//     this.selectedJob = data;
//     this.b1.setJobTitle(this.selectedJob.jobtitle);
//     this.b1.setCompanyName(this.selectedJob.companyforthisjob);
//     this.b1.setEmpId(this.selectedJob.empid);

//   }

//   userID: String = '0';
//   ngOnInit(): void {
 

//     let response = this.b1.fetchjobpost();
//     response.subscribe((data1: any) => (this.data = data1));

//     this.userID = this.cookie.get('user');

//     let responseUser = this.b1.fetchuser();

//     responseUser.subscribe((data1: any) => {

//       const uuid = this.userID;

//       this.userData1 = data1.find((user: any) => user.uid == uuid);
//       this.abc = this.userData1.userName;
//       this.fetchApplyJob();
//     });
//   }

//   fetchApplyJob() {
//     let response = this.b1.fetchapplyform();

//     response.subscribe((data1: any) => {
//       this.datajobs = data1.filter((apply: any) => apply.jumail == this.abc);
//     });
//   }

//   navigateToSignIn() {
//     this.router.navigate(['/dashboarduser/questionpaper']);
//   }

//   filterJobs(): void {
//     if (this.searchJobTitle || this.searchLocation) {
//       this.filteredJobs = this.data.filter((job) => {
//         const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
//         const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
//         return titleMatch && locationMatch;
//       });
//     } else {
//       this.filteredJobs = this.data;
//     }
//   }

//   navigateToDashboardUser() {
//     this.router.navigate(['/dashboarduser']);
// }


}