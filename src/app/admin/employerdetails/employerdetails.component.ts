import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';


@Component({
  selector: 'app-employerdetails',
  templateUrl: './employerdetails.component.html',
  styleUrls: ['./employerdetails.component.css']
})
export class EmployerdetailsComponent implements OnInit{
  
  data:any;
  private backend_URL = `${backendUrl}`;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchEmpName: string = '';
  searchCmpName: string = '';


  constructor(private b1:UserService,private router:Router , private http: HttpClient){}
  
  ngOnInit(): void {
   this.fetchEmployeesFunc(this.currentPage)  
  }
  fetchEmployeesFunc(page:number):void{
    console.log("The value of page is: "+page)
    this.b1.fetchemployer(page-1,this.searchCmpName,this.searchEmpName).subscribe({
      next: (response: any) => {
        this.data = response.employees;
        this.currentPage = response.currentPage+1;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        console.error('Error fetching employees:', error);
      }
    });
  }
  searchByDetails():void{
    this.currentPage = 1;
    this.fetchEmployeesFunc(this.currentPage);
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log("I am inside On Page change"+page)
      this.currentPage = page;
      this.fetchEmployeesFunc(page);
    }
  }
  sendNotificationemp(empId:string){
       // Navigate to the notification component with the user ID as a parameter
    this.router.navigate(['/admin/notify/', empId]);
  }

  toggleUserActivation(empid: string): void {
    this.http.put(`${this.backend_URL}empldeactivate/${empid}`, {}).subscribe({
      next: () => {
        console.log(`User account ${empid} ${this.getEmployeeById(empid).accempldeactivate ? 'activated' : 'deactivated'} successfully`);
        // Update the user's accdeactivate status in the UI
        this.getEmployeeById(empid).accempldeactivate = !this.getEmployeeById(empid).accempldeactivate;
      },
      error: (error) => {
        console.error(`Error toggling user activation status for user ${empid}:`, error);
        // Handle error scenarios
      }
    });
  }
  infoPage(jobid:string):void
  {
    this.router.navigate(['/infoPage']);
  }
  getEmployeeById(empid: string): any {
    return this.data.find((user: any) => user.empid === empid);
  }
  truncateDescription(description: string): string {
    if (!description) {
      return ''; // Return empty string if description is null or undefined
    }
  
    const words = description.split(' ');
    if (words.length > 50) {
      return words.slice(0, 30).join(' ') + '...';
    } else {
      return description;
    }
  }
  
}