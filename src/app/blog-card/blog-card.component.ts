import { Component, OnInit , Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';


interface Blog {
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  approved:boolean;
}

declare var $: any;


@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {
[x: string]: any;
  private blog_const = `${blogconst}`;
  blogs: any;
  trendingBlogs: any;
  pageState: string = "home";
  loading: boolean = false;
  quote: string = '';
  isloading: boolean = true;
  searchQuery: string = '';
  filteredBlogs: any[] = [];

  loginform!: FormGroup;
  public passwordVisible: boolean = false;


  quotes: string[] = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    // Add other quotes here
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private b1: UserService, private userservice: UserService , private router :Router) { }

  ngOnInit(): void {
    this.setQuote(this.getRandomQuote());
    this.fetchLatestBlogs(1); // Load page 1 when the component initializes

    this.loginform = this.fb.group({
      userName: ['', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/) ]],
      userPassword: ['', Validators.required],
    });
  }

  getRandomQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  setQuote(quote: string): void {
    this.quote = quote;
  }

  fetchLatestBlogs(page: number): void {
    this.isloading=true;
    this.loading = true;
    this.http.post<any>(`${this.blog_const}/latest-blogs-approved`, { page }).subscribe(data => {
      console.log('Latest Blogs Response:', data);
      if (this.blogs && page > 1) {
        this.blogs = [...this.blogs, ...data.blogs.slice(0, 5)];
        console.log("Blogs are: ",this.blogs)
        this.isloading=false
      } else {
        // Set blogs for the first page
        this.isloading=false;
        this.blogs = data.blogs.slice(0, 5);
      }
      this.isloading=false;
      this.loading = false;
    }, error => {
      console.error('Error fetching latest blogs:', error);
      this.loading = false;
      this.isloading=false;
    });
  }


  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }






  filterBlogs() {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, display all blogs
      this.filteredBlogs = this.blogs;
    } else {
      // Filter blogs based on search query in the title
      this.filteredBlogs = this.blogs.filter((blog:any) =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  @Input() state: any; // Replace 'any' with the appropriate type for 'state'
  @Input() fetchDataFun: any; // Replace 'any' with the appropriate type for 'fetchDataFun'



  fetchData(): void {
    if (typeof this.fetchDataFun === 'function') {
      this.fetchDataFun({ page: this.state.page + 1 });
    }
  }

  
  loadMoreBlogs(): void {
    if (!this.blogs) {
      this.blogs = []; // Initialize blogs array if it's undefined
    }
  
    const nextPage = Math.ceil(this.blogs.length / 5) + 1; // Calculate the next page number
  
    this.fetchLatestBlogs(nextPage);
  }

  navigateToBlogDetails(blogId: string): void {
    // Navigate to BlogDetailsComponent with the blog ID as a parameter
    this.router.navigate(['/blog/', blogId]);
  }
}