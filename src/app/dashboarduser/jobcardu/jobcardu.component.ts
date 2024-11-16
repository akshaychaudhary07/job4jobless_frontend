import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-jobcardu',
  templateUrl: './jobcardu.component.html',
  styleUrls: ['./jobcardu.component.css']
})
export class JobcarduComponent implements OnInit {
  loadingJobs: boolean = true;
  liked: boolean = false;
  data1: Job[] = [];
  searchQuery: string = '';
  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  currentPage = 1;
  totalPages!: number;
  searchJobTitle: string = '';
  searchLocation: string = '';
  isLoading: boolean = true;
  totalItems: any;
  uid!: string;
  jobIdLikedStatusMap: { [key: string]: boolean } = {};
  filteredJobs: Job[] = [];
  itemsPerPage = 5;

  constructor(private router: Router, private b1: UserService, private cookie: CookieService,private snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit(): void {
    this.uid = this.cookie.get('uid');
    // this.loadJobs(this.currentPage);
    this.fetchJobs(this.currentPage);
  }

  performSearchJobTitle() {
    console.log("checking the data1 test",this.data1);
    if (this.searchJobTitle.trim() !== '' && this.searchLocation.trim() !== '') {
      const titleSearchTerm = this.searchJobTitle.toLowerCase();
      const locationSearchTerm = this.searchLocation.toLowerCase();
      this.filteredJobs = this.data1.filter(job =>
        job.jobtitle.toLowerCase().includes(titleSearchTerm) && job.locationjob.toLowerCase().includes(locationSearchTerm)
      );
    } else if (this.searchJobTitle.trim() !== '') {
      const searchTerm = this.searchJobTitle.toLowerCase();
      this.filteredJobs = this.data1.filter(job =>
        job.jobtitle.toLowerCase().includes(searchTerm)
      );
    } else if (this.searchLocation.trim() !== '') {
      const searchTerm = this.searchLocation.toLowerCase();
      this.filteredJobs = this.data1.filter(job =>
        job.locationjob.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredJobs = this.data1;
    }
  }


  performSearchAndFetchJobs(): void {
    this.currentPage = 1;
    this.fetchJobs(this.currentPage);
  }

  fetchJobs(pageNumber: any) {
    this.isLoading = true;
    const url = `${backendUrl}fetchjobpoststatus`;
    const params = {
      uid: this.uid, // Pass the uid parameter
      page: pageNumber - 1,
      searchJobTitle: this.searchJobTitle,
      searchLocation: this.searchLocation
    };

    this.http.get<any>(url, { params }).subscribe({
      next: (response) => {
        this.data1 = response.jobPosts;
        console.log("checking the data1 test",response.jobPosts);
        console.log("checking the data1 test",response.jobPosts.savedjob);
        this.performSearchJobTitle();
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage + 1;  // Reset current page to 1 for new search
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
      this.fetchJobs(page)
    }
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
          const jsonResponse = JSON.parse(response); // Parse the JSON response
          if (jsonResponse.message === "User has already applied for this job") {
            console.log("The user has already applied for this job.");
            this.snackBar.open('You have already applied on this job.', 'Close', {
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
      this.router.navigate(['/dashboarduser/applyjob']);
    }
  }

  filterJobs(): void {
    console.log("checking the data1 test",this.data1);
    // console.log(this.searchJobTitle, this.searchLocation);
    if (this.searchJobTitle || this.searchLocation) {
      this.filteredJobs = this.data1.filter((job: Job) => {
        const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
        const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
        return titleMatch && locationMatch;
      });
    } else {
      console.log("checking the data1 test",this.data1);
      this.filteredJobs = this.data1;
    }
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  toggleLikedStatus(jobid: string): void {
    const uid = this.cookie.get('uid');
    console.log("The uid is: " + this.uid)
    console.log("The jobid is: " + jobid)
    this.b1.updateSavedJobStatus(jobid, uid).subscribe(
      (response: any) => {
        // console.log('Check the values', response);
        if (response.saveStatus != null) {
          // console.log('Job status updated successfully.');
          this.jobIdLikedStatusMap[jobid] = response.saveStatus;
          console.log("the save status is: " + response.saveStatus)
          // this.filterJobs();
          this.router.navigate(['/dashboarduser/savedjob']);
        } else {
          // console.error('Job status update failed.');
        }
      },
      (error) => {
        // console.error('Error updating job status:', error);
      }
    );
  }
}
