import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { AdminserviceService } from '../adminauth/adminservice.service';

@Component({
  selector: 'app-enquirydetails',
  templateUrl: './enquirydetails.component.html',
  styleUrls: ['./enquirydetails.component.css']
})
export class EnquirydetailsComponent implements OnInit {

  data: any;
  dcontacts: any[] = [];

  currentPage: number = 1;
  directCurrentPage: number = 1
  itemsPerPage: number = 3;
  totalItems: number = 0;
  totalPage: number = 0;
  directTotalItems: number = 0;
  directTotalPage: number = 0;
  constructor(private b1: UserService, private adminauth: AdminserviceService) { }

  ngOnInit(): void {    
    this.fetchEnquiryData(this.currentPage)
    this.fetchData(this.directCurrentPage);
  }

  fetchEnquiryData(page: number) {
    let response = this.b1.fetchcontact(page - 1);
    response.subscribe((data1: any) => {
      this.data = data1.contacts,
        this.currentPage = data1.currentPage + 1,
        this.totalItems = data1.totalItems;
        this.totalPage = data1.totalPages;
    });
  }

  fetchData(page:number) {
    let response=this.adminauth.fetchContacts(page-1);
    response.subscribe((data1: any) => {
      this.dcontacts = data1.directContacts,
        this.directCurrentPage = data1.currentPage + 1,
        this.directTotalItems = data1.totalItems;
        this.directTotalPage = data1.totalPages;
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPage) {
      console.log("I am inside On Page change" + page)
      this.currentPage = page;
      this.fetchEnquiryData(page);
    }
  }

  onPageChangeDirect(page: number): void {
    if (page >= 1 && page <= this.totalPage) {
      console.log("I am inside On Page change" + page)
      this.directCurrentPage = page;
      this.fetchData(page);
    }
  }


  openContactOption(contactNumber: string) {
    // Check if the phone number is valid (you can add more validation)
    if (/^\d+$/.test(contactNumber)) {
      // Phone number contains only digits, so it's suitable for dialing
      window.location.href = 'tel:' + contactNumber; // Open the phone dialer
    } else if (contactNumber.startsWith('+')) {
      // If the phone number starts with '+', assume it's an international number and open WhatsApp
      window.location.href = 'https://api.whatsapp.com/send?phone=' + contactNumber;
    } else {
      // Handle other cases or show an error message
      console.error('Invalid contact number:', contactNumber);
    }
  }

}
