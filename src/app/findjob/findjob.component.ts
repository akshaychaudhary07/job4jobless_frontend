import { Component, OnInit,ViewEncapsulation,EventEmitter, Output  } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Job {
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
  payjobsup: string;
}
@Component({
  selector: 'app-findjob',
  templateUrl: './findjob.component.html',
  styleUrls: ['./findjob.component.css'],
  animations: [
    trigger('fadeInOut', [
        state('in', style({ opacity: 1, transform: 'scale(1)' })),
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate('1s ease-in-out')
        ]),
    ]),
],
})
export class FindjobComponent implements OnInit{
  @Output() search = new EventEmitter<string>();
  searchForm!: FormGroup;

  constructor(private router: Router, private b1: UserService) {}
 

  ngOnInit(): void {

  }
  submitSearch() {
    if (this.searchForm) {
      const searchInputControl = this.searchForm.get('searchInput');
      if (searchInputControl) {
        const searchTerm = searchInputControl.value;
        this.search.emit(searchTerm);
      } else {
        console.error('searchInput control is null or undefined.');
      }
    } else {
      console.error('searchForm is null or undefined.');
    }
  }
  clearSearch() {
    if (this.searchForm) {
      const searchInputControl = this.searchForm.get('searchInput');
      if (searchInputControl) {
        searchInputControl.setValue('');
        this.submitSearch();
      }
    }
  }
  

}
