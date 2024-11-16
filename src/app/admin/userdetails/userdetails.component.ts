import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  data: any;
  private backend_URL = `${backendUrl}`;
  currentPage = 1;
  // itemsPerPage = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchByName: string = '';

  constructor(private b1: UserService, private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    this.fetchUserFunc(this.currentPage)
  }

  fetchUserFunc(page:number ):void{
    console.log("The value of page is: "+page)
    this.b1.fetchuser('',page-1,this.searchByName).subscribe({
      next: (response: any) => {
        this.data = response.users;
        this.currentPage = response.currentPage+1;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }
  performSearchAndFetchJobs(): void {
    this.currentPage = 1;
    this.fetchUserFunc(this.currentPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log("I am inside On Page change"+page)
      this.currentPage = page;
      this.fetchUserFunc(page);
    }
  }
  sendNotification(userId: string) {
    // Navigate to the notification component with the user ID as a parameter
    this.router.navigate(['/admin/notify/', userId]);
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.backend_URL}users/${userId}`).subscribe({
      next: () => {
        console.log('User account deactivated successfully');
        // Optionally, update UI or perform other actions upon successful deletion
      },
      error: (error) => {
        console.error('Error deactivating user account:', error);
        // Handle error scenarios
      }
    });
  }

  toggleUserActivation(uid: string): void {
    this.http.put(`${this.backend_URL}deactivate/${uid}`, {}).subscribe({
      next: () => {
        console.log(`User account ${uid} ${this.getUserById(uid).accdeactivate ? 'activated' : 'deactivated'} successfully`);
        // Update the user's accdeactivate status in the UI
        this.getUserById(uid).accdeactivate = !this.getUserById(uid).accdeactivate;
      },
      error: (error) => {
        console.error(`Error toggling user activation status for user ${uid}:`, error);
        // Handle error scenarios
      }
    });
  }

  getUserById(userId: string): any {
    return this.data.find((user: any) => user.uid === userId);
  }
}
