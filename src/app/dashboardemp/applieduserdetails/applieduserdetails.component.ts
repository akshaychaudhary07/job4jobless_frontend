import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { ApplyJob } from 'src/app/apply-job';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-applieduserdetails',
  templateUrl: './applieduserdetails.component.html',
  styleUrls: ['./applieduserdetails.component.css']
})
export class ApplieduserdetailsComponent implements OnInit {
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'All';
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

  isLoading: boolean = true;

  backend_URL = `${backendUrl}`;

  // Function to toggle the table visibility
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  // Define a property to keep track of the expanded user profile
  expandedUser: any | null = null;

  constructor(private router: Router, private formbuilder: FormBuilder, private b1: UserService, public cookie: CookieService) { }

  empId: string | undefined;

  ngOnInit(): void {
      this.empId = this.cookie.get('emp');

      // let response = this.b1.fetchemployer();
      let response = this.b1.fetchEmployerById(this.empId);
      response.subscribe((data1: any) => {
        this.empDetail = data1;
        this.abc = this.empDetail.empId;
        this.fetchJobapplieddetails(this.currentPage);

      });
  }

  // Fetch and filter job applications
  // fetchJobapplieddetails() {
  //   let response: any = this.b1.fetchapplyform();
  //   response.subscribe((data1: any) => {
  //     this.data = data1.filter((applyjobf: any) => applyjobf.empid == this.empId);

  //     // Sort the data by sendTime in descending order
  //     this.filteredData = this.data
  //       .sort((a: ApplyJob, b: ApplyJob) => {
  //         const dateA = new Date(a.sendTime || 0);
  //         const dateB = new Date(b.sendTime || 0);
  //         return dateB.getTime() - dateA.getTime();
  //       });

  //     // Initially, display all applications
  //     this.filteredData = this.data;
  //   });
  // }
  fetchJobapplieddetails(pageNumber: number, juTitle?: string) {
    this.isLoading = true;
    let response: any = this.b1.fetchapplyform(this.empId, pageNumber - 1, juTitle);
    response.subscribe((data1: any) => {
      // Ensure you are accessing the correct property from the response
      const jobPosts = Array.isArray(data1.jobPosts) ? data1.jobPosts : [];

      this.totalPages = data1.totalPages;
      this.totalItems = data1.totalItems;
      this.currentPage = data1.currentPage + 1;

      if (Array.isArray(jobPosts)) {
        this.data = jobPosts.filter((applyjobf: any) => applyjobf.empid == this.empId);

        // Sort the data by sendTime in descending order
        this.filteredData = this.data
          .sort((a: ApplyJob, b: ApplyJob) => {
            const dateA = new Date(a.sendTime || 0);
            const dateB = new Date(b.sendTime || 0);
            return dateB.getTime() - dateA.getTime();
          });
        this.isLoading = false
        // this.filteredData = this.data;
      } else {
        console.error('Invalid data format received:', data1);
      }
    }, (error: any) => {
      console.error('Error fetching applied jobs:', error);
    });
  }

  filterApplications(status: string) {
    this.selectedStatus = status;
    if (status === 'All') {
      this.filteredData = this.data; // Display all applications
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.loadJobs(page);
      this.fetchJobapplieddetails(page, this.jobTitleFilter)
    }
  }

  // Filter data by job title
  // filterByJobTitle() {
  //   if (!this.jobTitleFilter) {
  //     this.filteredData = this.data; // Display all applications when the filter is empty
  //   } else {
  //     this.filteredData = this.data.filter((application: ApplyJob) =>
  //       application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
  //     );
  //   }
  // }
  filterByJobTitle() {
    // if (!this.jobTitleFilter) {
    //   this.filteredData = this.data; 
    // } else {
    //   this.filteredData = this.data.filter((application: ApplyJob) =>
    //     application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
    //   );
    // }
    this.currentPage = 1;
    this.fetchJobapplieddetails(this.currentPage, this.jobTitleFilter)
  }

  navigateToMessage(uid: string, juname: string) {
    // Use both the uid and juname parameters when navigating
    this.router.navigate(['/dashboardemp/empmessage/', uid], { queryParams: { juname: juname } });
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
    application.profileupdate = this.selectedOption;

    this.b1.updateProfileUpdate(application).subscribe((updatedApplication: any) => {

    });
  }

  toggleDropdown(application: any) {
    application.isOpen = !application.isOpen;
  }

  selectOption(application: any, option: string) {
    this.selectedOption = option; // Update the selected option
    application.isOpen = false;
    // console.log('Selected option:', this.selectedOption); 
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
}