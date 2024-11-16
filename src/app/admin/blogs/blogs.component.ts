import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { UserService } from '../auth/user.service';

interface Blog {
  _id: string;
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  approved: boolean;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {

  private blog_const = `${blogconst}`;
  blogs: any;
  pageState: string = "home";
  loading: boolean = false;
  showButtonContent: boolean = false;
  isLoading: boolean = true;
  isloading: boolean = false; 
  isLoadingMore: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchLatestBlogs(1);
  }


  fetchLatestBlogs(page: number): void {
    // this.loading = true;
    this.http.post<any>(`${this.blog_const}/latest-blogs`, { page }).subscribe(
    {
      next:  (data) => {
        console.log('Latest Blogs Response:', data);
        this.isLoading = false; 
        this.isLoadingMore=false;
        if (this.blogs && page > 1) {
          console.log("hello sir");
          // Append new blogs to the existing list
          this.blogs = [...this.blogs, ...data.blogs.slice(0, 5)];
        } else {
          // Set blogs for the first page
          console.log("hello");
          this.blogs = data.blogs.slice(0, 5);
        }
        this.loading = false;
        this.isLoadingMore=false;
      },
      error:(error) => {
        console.error('Error fetching latest blogs:', error);
        this.loading = false;
        this.isLoadingMore=false;
      }
    }
    );
  }
  

  loadMoreBlogs(): void {
    this.isLoadingMore = true;
    if (!this.blogs) {
      this.blogs = []; // Initialize blogs array if it's undefined
    }
    const nextPage = (this.blogs.length / 5) + 1; // Calculate the next page based on the current number of blogs
    this.fetchLatestBlogs(nextPage);
  }

  // toggleButtonContent(): void {
  //   this.showButtonContent = !this.showButtonContent;
  // }
  toggleButtonContent(index: number): void {
    this.blogs[index].showContent = !this.blogs[index].showContent;
  }

  toggleButtonActivate(index: number): void {
    this.isloading = true;

    const blog = this.blogs[index];
    const blogId = blog._id;
    blog.isloading = true;

    // Update the isActive property immediately to provide instant feedback to the user
    blog.isActive = !blog.isActive;
  
    // Call the server API to toggle the approval status
    this.http.put<any>(`${this.blog_const}/toggle-approval/${blogId}`, {}).subscribe({
      next: response => {
        blog.isloading = false;
        // this.isloading = false;
        // console.log('Blog approval status toggled:', response);
        blog.isActive = response.blog.approved;
  
        blog.approved = response.blog.approved ? 'Deactivate' : 'Activate';
        this.fetchLatestBlogs(1);
      },
      error: error => {
        blog.isloading = false;
        console.error('Failed to toggle blog approval status:', error);
        blog.isActive = !blog.isActive;
      }
    });
  }  
}
