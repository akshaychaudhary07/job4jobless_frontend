import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../constant';

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
  sendTime: Date;
  isDescriptionVisible: boolean;
  approvejob: boolean;
  experience: string;
}

@Component({
  selector: 'app-jobcards',
  templateUrl: './jobcards.component.html',
  styleUrls: ['./jobcards.component.css']
})

export class JobcardsComponent implements OnInit {
  jobs: Job[] = [];
  currentPage = 1;
  isLoading = true;
  searchJobTitle: string = '';
  searchLocation: string = '';
  filteredJobs: Job[] = [];
  data1: any;
  selectedJob: Job | null = null;
  disableNextButton = false;
  totalPages!: number;
  totalItems!: number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchJobs(this.currentPage);
  }

  performSearch() {
    if (this.searchJobTitle.trim() !== '') {
      const searchTerm = this.searchJobTitle.toLowerCase();
      this.filteredJobs = this.jobs.filter(job =>
        job.jobtitle.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredJobs = this.jobs;
    }
  }

  performLocation()
  {
    if (this.searchLocation.trim() !== '') {
      const searchTerm = this.searchLocation.toLowerCase();
      this.filteredJobs = this.jobs.filter(job =>
        job.locationjob.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredJobs = this.jobs;
    }
  }
  performSearchAndFetchJobs(): void {
    this.currentPage=1;
    this.fetchJobs(this.currentPage);
  }

  performSearchJobTitle() {
    if (this.searchJobTitle.trim() !== '' && this.searchLocation.trim() !== '') {
      const titleSearchTerm = this.searchJobTitle.toLowerCase();
      const locationSearchTerm = this.searchLocation.toLowerCase();
      this.filteredJobs = this.jobs.filter(job =>
        job.jobtitle.toLowerCase().includes(titleSearchTerm) && job.locationjob.toLowerCase().includes(locationSearchTerm)
      );
    } else if (this.searchJobTitle.trim() !== '') {
      const searchTerm = this.searchJobTitle.toLowerCase();
      this.filteredJobs = this.jobs.filter(job =>
        job.jobtitle.toLowerCase().includes(searchTerm) 
      );
    } else if (this.searchLocation.trim() !== '') {
      const searchTerm = this.searchLocation.toLowerCase();
      this.filteredJobs = this.jobs.filter(job =>
        job.locationjob.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredJobs = this.jobs
    }
}

  fetchJobs(pageNumber:any): void {
    this.isLoading = true;
    const url = `${backendUrl}fetchjobpoststatus`;
    const params = {
      page:pageNumber-1,
      searchJobTitle: this.searchJobTitle,
      searchLocation: this.searchLocation
    };

    this.http.get<any>(url, { params }).subscribe({
      next: (response) => {
        this.jobs = response.jobPosts;
        // this.performSearch();
        // this.performLocation();
        // this.performSearchJobTitle();
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage + 1;;  // Reset current page to 1 for new search
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // if (this.jobs.length < 5 || this.jobs.length === 0) {
        //   this.disableNextButton = true; 
        // } else {
        //   this.disableNextButton = false; 
        // }
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.isLoading = false;
      }
    });
  }

  
  filterJobs(): Job[] {
    let filteredJobs = this.jobs;
    if (this.searchJobTitle.trim() !== '') {
      const searchTerm = this.searchJobTitle.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.jobtitle.toLowerCase().includes(searchTerm)
      );
    }
    if (this.searchLocation.trim() !== '') {
      const searchTerm = this.searchLocation.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.locationjob.toLowerCase().includes(searchTerm)
      );
    }
    return filteredJobs;
  }

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  //   this.fetchJobs();
  //   this.performSearch();
  // }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.loadJobs(page);
      this.fetchJobs(page)
    }
  }

  // filterJobs(): void {
  //   if (this.searchJobTitle || this.searchLocation) {
  //     this.filteredJobs = this.data1.filter((job: Job) => {
  //       const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
  //       const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
  //       return titleMatch && locationMatch;
  //     });
  //   } else {
  //     this.filteredJobs = this.data1;
  //   }
  //   this.currentPage = 1;
  // }

  toggleDescriptionVisibility(job: Job): void {
    this.selectedJob = this.selectedJob === job ? null : job;
  }
  formatDate(sendTime: Date): Date | null {
    if (!sendTime) return null;

    const date = new Date(sendTime);

    if (isNaN(date.getTime())) {
      return null;
    }

    const extractedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return extractedDate;
  }


}
