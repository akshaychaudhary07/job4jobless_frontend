import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { Router } from '@angular/router';


interface SubadminDetails {
  subadminid: string;
  subadminame: string;
  subadminmail: string;
  manageUsers: boolean;
  manageEmployers: boolean;
  postJob: boolean;
  applyJob: boolean;
  manageBlogs: boolean;
  pushNotification: boolean;
  approveJobDetails: boolean;
}


@Component({
  selector: 'app-subadmindetails',
  templateUrl: './subadmindetails.component.html',
  styleUrls: ['./subadmindetails.component.css']
})
export class SubadmindetailsComponent implements OnInit {
  private backend_URL = `${backendUrl}`;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  loadNextPage() {
    this.currentPage++;
  }

  loadPreviousPage() {
    this.currentPage--;
  }

  dataSource: MatTableDataSource<SubadminDetails> = new MatTableDataSource<SubadminDetails>([]);
  displayedColumns: string[] = ['subadminame', 'subadminmail', 'manageUsers', 'manageEmployers', 'postJob', 'applyJob', 'manageBlogs', 'pushNotification', 'approveJobDetails', 'actions', 'actionsa'];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchSubAdminData(this.currentPage);
  }

  // fetchSubAdminData(): void {
  //   this.http.get<SubadminDetails[]>(`${this.backend_URL}subadmindetails/all`).subscribe(data => {
  //     this.dataSource = new MatTableDataSource<SubadminDetails>(data);
  //   });
  // }
  fetchSubAdminData(page: number): void {
    this.http.get<any>(`${this.backend_URL}subadmindetails/all?page=${page - 1}`).subscribe(
      {
        next: (response: any) => {
          const subAdmins = response.content || [];
          this.dataSource = new MatTableDataSource<SubadminDetails>(subAdmins);
          this.currentPage = response.currentPage + 1;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        },
        error: (error: any) => {
          console.error('Error fetching sub-admin data:', error);
        }
      }
    );
  }
  deleteSubAdmin(id: string) {
    if (confirm('Are you sure you want to delete this subadmin?')) {
      this.http.delete(`${this.backend_URL}subadmindetails/${id}`).subscribe(
        (response) => {
          console.log('Subadmin deleted successfully:', response);
          // Optionally, you can refresh the data table after deletion
          this.fetchSubAdminData(this.currentPage);
        },
        (error) => {
          console.error('Error deleting subadmin:', error);
          // Handle error (e.g., display error message)
        }
      );
    }

  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log("I am inside On Page change"+page)
      this.currentPage = page;
      this.fetchSubAdminData(page);
    }
  }

  redirectToUpdateSubadmin(id: string) {
    this.router.navigate(['/admin/updatesubadmin', id]);
  }
}
