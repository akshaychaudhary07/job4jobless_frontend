import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { ApplyJob } from 'src/app/apply-job';
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
}
@Component({
  selector: 'app-myjobs',
  templateUrl: './myjobs.component.html',
  styleUrls: ['./myjobs.component.css']
})
export class MyjobsComponent implements OnInit {
  showFloatingGif = false;
  userData1!: any;
  abc: any;
  user: any;
  showDetails = false;
  jobTitleFilter: string = '';
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'All';
  selectedOption: string = '';
  isOpen: boolean = false;
  options: string[] = ['Selected', 'Reviewed', 'Waiting', 'Rejected'];
  empDetail: any;
  currentPage = 1;
  totalPages!: number;
  isLoading: boolean = true;

  logval: any;
  data: ApplyJob[] = [];
  filteredData: ApplyJob[] = [];
  public chatEmail: string = "";
  isTableVisible: boolean = false;
  exportedData: string = '';
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  expandedUser: any | null = null;
  constructor(public cookie: CookieService, private b1: UserService, private router: Router, private elRef: ElementRef, private renderer: Renderer2) { }

  userID: string = "0";
  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    let response = this.b1.fetchuser(this.userID,0);
    response.subscribe((data1: any) => {
      const uuid = this.userID;
      // this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.userData1 = data1.users;
      this.abc = this.userData1.userName;
      this.fetchJobapplieddetails(this.currentPage);
    });
  }

  fetchJobapplieddetails(page: number, juTitle?: string , jobStatus?:string) {
    let response: any = this.b1.fetchapplyform(undefined, page - 1, juTitle, jobStatus, this.userID);
    response.subscribe((data: any) => {
      // this.data = data.jobPosts;
      // this.totalPages = data.totalPages;
      // this.currentPage = data.currentPage + 1;
      // this.filteredData = this.data.sort((a: any, b: any) => {
      //   const dateA = new Date(a.sendTime || 0);
      //   const dateB = new Date(b.sendTime || 0);

      //   return dateB.getTime() - dateA.getTime(); 
      // });
      const jobPosts = Array.isArray(data.jobPosts) ? data.jobPosts : [];

      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage + 1;

      if (Array.isArray(jobPosts)) {
        this.data = jobPosts.filter((applyjobf: any) => applyjobf.uid == this.userID);

        this.filteredData = this.data
          .sort((a: ApplyJob, b: ApplyJob) => {
            const dateA = new Date(a.sendTime || 0);
            const dateB = new Date(b.sendTime || 0);
            return dateB.getTime() - dateA.getTime();
          });

        // this.filteredData = this.data;
      } else {
        console.error('Invalid data format received:', data);
      }
    });

  }
  filterApplications(status: string) {
    this.selectedStatus = status;
    this.jobTitleFilter=''
    this.currentPage=1
    if (status === 'All') {
      this.filteredData = this.data;
      this.fetchJobapplieddetails(this.currentPage);
    } else {
      // this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
      this.fetchJobapplieddetails(this.currentPage , undefined,this.selectedStatus)
    }
  }
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

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchJobapplieddetails(page)
    }
  }

  showMoreInfo(user: ApplyJob): void {
    this.expandedUser = this.expandedUser === user ? null : user;
  }
  getStatusSegmentStyle(status: string): any {
    let width = '25%'; // Default width for each segment
    switch (status) {
      case 'Waiting':
        width = '25%';
        break;
      case 'Reviewed':
        width = '50%';
        break;
      case 'Selected':
        width = '75%';
        break;
      case 'Rejected':
        width = '100%';
        break;
    }
    return { width: width };
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
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return header + '\n' + rows.join('\n');
  }
  navigateTo() {
    this.router.navigate(['/dashboarduser']);
  }
}
