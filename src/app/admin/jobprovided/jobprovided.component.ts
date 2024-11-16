import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jobprovided',
  templateUrl: './jobprovided.component.html',
  styleUrls: ['./jobprovided.component.css']
})
export class JobprovidedComponent implements OnInit {

  data: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchEmpName: string = '';
  searchJobTitle: string = '';

  jobPosts: any[] = [];
  private backend_URL = `${backendUrl}`;

  isLoading: boolean = true;


  constructor(private userService: UserService, private http: HttpClient , private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    // this.loadJobData();
    this.fetchJobPosts(this.currentPage);
  }

  fetchJobPosts(page: number): void {
    this.http.get<any[]>(`${this.backend_URL}fetchjobpostadmin?page=${page-1}&empName=${this.searchEmpName}&jobTitle=${this.searchJobTitle}`)
      .subscribe(
        {
          next: (response: any) => {
            this.jobPosts = response.content;
            this.currentPage = response.currentPage + 1;
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching job posts:', error);
          }
        }
      );
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log("I am inside On Page change" + page)
      this.currentPage = page;
      this.fetchJobPosts(page);
    }
  }
  searchByDetails():void{
    this.currentPage = 1;
    this.fetchJobPosts(this.currentPage);
  }
  approveJob(jobId: string): void {
    this.http.put<any>(`${this.backend_URL}jobpostupdate/${jobId}`, {})
      .pipe(
        catchError((error) => {
          console.error('Error updating job post approval status:', error);
          // this.fetchJobPosts();
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          // Job post approval status updated successfully
          console.log('Job post approval status updated:', response);
          this.fetchJobPosts(this.currentPage);
          // You can perform any additional actions if needed
        }
      );
  }

  deleteJob(jobId: string): void {
    if (!jobId) return; // jobId is not available

    // Make HTTP DELETE request to delete the job
    this.http.delete(`${this.backend_URL}deleteJob/${jobId}`, { responseType: 'text' })
      .subscribe({
        next: (response: any) => {
          console.log('Job deleted successfully:', response);
          this.snackBar.open('Successfully Deleted the Job.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.fetchJobPosts(this.currentPage);
          // Optionally, navigate to another page or reload current page
        },
        error: (error: any) => {
          console.error('Error deleting job:', error);
          // Handle error (e.g., show an error message)
          this.snackBar.open('Error deleting job. Please try again later.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
  }

}
