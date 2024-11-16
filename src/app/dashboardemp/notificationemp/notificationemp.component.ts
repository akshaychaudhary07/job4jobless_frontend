import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApplyJob } from 'src/app/apply-job';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-notificationemp',
  templateUrl: './notificationemp.component.html',
  styleUrls: ['./notificationemp.component.css']
})
export class NotificationempComponent implements OnInit {
  backend_URL =`${backendUrl}`;
  notifications: any[] = [];
  empId: string = "0";
  isLoading: boolean = true;
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'Waiting';
  selectedOption: string = '';
  isOpen: boolean = false;
  options: string[] = ['Selected', 'Reviewed', 'Waiting', 'Rejected'];
  empDetail: any;
  abc: any;
  logval: any;
  data: ApplyJob[] = [];
  filteredData: ApplyJob[] = [];
  public chatEmail: string = "";
  isTableVisible: boolean = false;
  exportedData: string = '';
  jobTitleFilter: string = '';
  currentPage = 1;
  totalPages!: number;
  totalItems!: number;

  // Function to toggle the table visibility
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  // Define a property to keep track of the expanded user profile
  expandedUser: any | null = null;
  constructor(private notificationService: UserService, public cookie: CookieService,private router:Router) {}

  ngOnInit(): void {
      this.empId = this.cookie.get('emp');
      let response = this.notificationService.fetchEmployerById(this.empId);
      response.subscribe((data1: any) => {
        this.empDetail = data1;
        this.abc = this.empDetail.empid;
        console.log("Employee Details are: " + JSON.stringify(this.empDetail, null, 2));
        console.log("Value of ABC is: " + this.abc);
        this.fetchJobapplieddetails(this.currentPage);
      });
      this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.fetchnotify().subscribe({
      next: (response: any) => {
        this.notifications = response.filter((notification: any) => {
          return notification.notifyuid === this.empId;
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        // console.error('Error fetching notifications:', err);
        this.isLoading = false;
      }
    });
  }

  refreshNotifications(): void {
    this.fetchNotifications();
  }

  fetchJobapplieddetails(pageNumber:number) {
    console.log("Employee ID in notification is: "+this.abc)
    let response: any = this.notificationService.fetchapplyform(this.abc,pageNumber-1,'',this.selectedStatus);
    response.subscribe((data1: any) => {
      // this.data = data1.filter((applyjobf: any) => applyjobf.empid == this.empId);
      const jobPosts = Array.isArray(data1.jobPosts) ? data1.jobPosts : [];

      this.totalPages = data1.totalPages;
      this.totalItems = data1.totalItems;
      this.currentPage = data1.currentPage + 1;
      if (Array.isArray(jobPosts)) {
        this.data = jobPosts.filter((applyjobf: any) => applyjobf.empid == this.abc);

        // Sort the data by sendTime in descending order
        this.filteredData = this.data
          .sort((a: ApplyJob, b: ApplyJob) => {
            const dateA = new Date(a.sendTime || 0);
            const dateB = new Date(b.sendTime || 0);
            return dateB.getTime() - dateA.getTime();
          });

        // this.filteredData = this.data;
        console.log('Filtered Data:', this.filteredData);
        console.log("Total Items are: "+this.totalItems);
        console.log("Total pages are: "+this.totalPages);
        console.log("Current Page is: "+this.currentPage);
      }else {
        console.error('Invalid data format received:', data1);
      }

      // Filter the data based on selectedStatus
      console.log("The selected status is: "+this.selectedStatus)
      this.filterApplications(this.selectedStatus);
    });
  }
  // filterApplications(status: string) {
  //   this.selectedStatus = status;
  //   if (status === 'All') {
  //     this.filteredData = this.data; 
  //     console.log("Value of filtered data is in application is: "+this.filteredData);
  //   } else {
  //     this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
  //     console.log("Value of filtered data is in application is: "+this.filteredData);
  //   }
  // }
  filterApplications(status: string) {
    this.selectedStatus = "Waiting";
    // Filter the data array to include only applications with profileupdate value 'Waiting'
    console.log("Value of this.data is: "+JSON.stringify(this.data, null, 2))
    this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    console.log("Filtered data in filterApplications is: ", this.filteredData);
  }
  

  filterByJobTitle() {
    if (!this.jobTitleFilter) {
      this.filteredData = this.data; // Display all applications when the filter is empty
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) =>
        application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
      );
    }
  }

  navigateToMessage(uid: string) {
    // Use the passed email as a parameter when navigating
    this.router.navigate(['/dashboardemp/empmessage/', uid]);
  }

  navigateToVideo(uid: string) {
    this.router.navigate(['/dashboardemp/videocall/', uid]);
  }

  // Define the showMoreInfo method
  showMoreInfo(user: any) {
    // Toggle the expandedUser property to show/hide additional information
    this.expandedUser = this.expandedUser === user ? null : user;
  }

  updateProfileUpdate(application: ApplyJob) {
    // Update the 'profileupdate' field of the selected 'application'
    application.profileupdate = application.selectedOption;
    console.log("The selected option is:"+application.selectedOption)

    // Make an HTTP request to update the 'profileupdate' field in the database
    this.notificationService.updateProfileUpdate(application).subscribe((updatedApplication: any) => {
      //this.fetchJobapplieddetails();
      this.fetchJobapplieddetails(this.currentPage);
    });
  }

  toggleDropdown(application: any) {
    application.isOpen = !application.isOpen;
  }

  // selectOption(application: any, option: string) {
  //   this.selectedOption = option; // Update the selected option
  //   application.isOpen = false;
  //   // console.log('Selected option:', this.selectedOption); 
  // }
  selectOption(application: any, option: string, statusInput: HTMLInputElement) {
    application.selectedOption = option; // Update the selected option
    application.isOpen = false;

    // Set the value of the corresponding input field to the selected option
    if (statusInput) {
        statusInput.value = option;
    }
}


  generateTablePDF() {
    const table = document.getElementById('dataTable');
    if (table) {
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.open();
        pdfWindow.document.write('<html><body>');
        pdfWindow.document.write('<table>' + table.innerHTML + '</table>');
        pdfWindow.document.write('</body></html>');
        pdfWindow.document.close();

        // Optionally, give it a moment to load and then print
        setTimeout(() => {
          pdfWindow.print();
        }, 500);
      } else {
        // console.error('Failed to open a new window for the PDF.');
      }
    } else {
      // console.error('Table element is not available.');
    }
  }

  // Function to convert data to CSV format
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return header + '\n' + rows.join('\n');
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.loadJobs(page);
      this.fetchJobapplieddetails(page)
    }
  }
}