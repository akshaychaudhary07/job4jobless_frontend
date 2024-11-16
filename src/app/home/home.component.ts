import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../constant';
import { CanonicalService } from '../canonical.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jobPosts: any[] = [];
  showAll: boolean = false;

  contactForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private b1: UserService, 
    private canonicalService: CanonicalService, 
    private router: Router, 
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Set the carousel to auto-play every 5 seconds
    this.runCarousel();
    this.fetchJobTitles();
    this.canonicalService.setCanonicalURL();
  }

  fetchJobTitles() {
    this.http.get<any>(`${backendUrl}fetchjobpost`).subscribe(
      {
        next: (response: any) => {
          this.jobPosts = response.jobPosts || [];
          console.log('Fetched job posts:', this.jobPosts);
        },
        error: (error: any) => {
          console.error('Error fetching job posts:', error);
        }
      }
    );
  }

  runCarousel() {
    const interval = 5000; // 5 seconds interval (adjust as needed)

    setInterval(() => {
      document.querySelector('#carouselExample')?.classList.add('next');
      setTimeout(() => {
        document.querySelector('#carouselExample')?.classList.remove('next');
      }, 700); 
    }, interval);
  }

  companies = [
    { name: 'Amazon', logo: 'Bestfit1.svg.png' },
    { name: 'IBM', logo: 'Bestfit6.svg.png' },
    { name: 'Netflix', logo: 'Bestfit8.png' },
    { name: 'Genpact', logo: 'Bestfit2logo.svg.png' },
    { name: 'Alphabet', logo: 'Bestfit3.svg.png' },
    { name: 'Microsoft', logo: 'Bestfit4.svg.png' },
    { name: 'Apple', logo: 'Bestfit5logo.png' },
    { name: 'LG', logo: 'LGlogo.png' },
  ];
  initialDisplayCount = 4;
  showMore = false;

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
  navigateToJobPage(jobTitle: string) {
    this.router.navigate(['/findjobpage'], { queryParams: { title: jobTitle } });
  }
}
