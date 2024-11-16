import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { blogconst } from '../constant';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { uploadImageAWS } from '../aws';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-createblog',
  templateUrl: './createblog.component.html',
  styleUrls: ['./createblog.component.css']
})
export class CreateblogComponent {
  blogForm: FormGroup;
  private apiUrl = `${blogconst}/create-blog`;
  // imgUrl: any;
  uploadedimage: any;
  selectedFile: File | null = null;
  tagStrings: string[] = [];
  loading: boolean = false;
  isLoading: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router
  ) 
  {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      des: ['', Validators.required],
      banner: ['',Validators.required],
      // tags: this.fb.array([''],[Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]),
      tags: this.fb.array([this.fb.control('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)])]),
      content: ['', Validators.required],
      draft: [false]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      // console.log("Token in CreateBlog component:", token);
    });
  }


  createBlogData(blogData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, blogData, { headers }).pipe(
      catchError(error => {
        console.error('Server error:', error);
        return of('Server error occurred');
      })
    );
  }
  onFileSelected(event: any) {
    const imageName: File = event.target.files[0];

    if (imageName) {
      uploadImageAWS(imageName)
        .then((url) => {
          if (url) {
            this.uploadedimage=url;
            // console.log(url, "checking the url");
          } else {
            // console.log("checking the error");
          }
        }
        )
        .catch((err) => {
          // console.log(err.message);
        }
        );
    }


  }
  uploadImage(imageName: string): Promise<any> {
    const body = { imageName };
    return this.http.post<any>(`${blogconst}/upload-image`, body).toPromise();
  }


  get tags(): FormArray {
    return this.blogForm.get('tags') as FormArray;
  }

  addTag(): void {
    const lastTagControl = this.tags.at(this.tags.length - 1);
    if (lastTagControl.value.trim() !== '') {
      this.tags.push(this.fb.control(''));
      this.updateTagStrings();
    }
  }
  
  updateTagStrings(): void {
    const tagValues = this.tags.controls.map(control => control.value.trim()).filter(value => value !== '');
    this.tagStrings = tagValues;
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
    // Update the array of tag strings
    this.updateTagStrings();
  }

  createBlog(): void {
    this.loading = true; 
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      // console.log("Token in CreateBlog component:", token);
      const blogData = {
        title: this.blogForm.value.title,
        des: this.blogForm.value.des,
        banner: this.uploadedimage,
        // tags: this.blogForm.value.tags.join(', '), // Convert array to string
        tags: [...this.tagStrings],
        content: this.blogForm.value.content,
        draft: this.blogForm.value.draft,
      };
  
      console.log("Blo/g data:", blogData);
  
      if (this.blogForm.valid) {
        this.isLoading = true;
        this.createBlogData(blogData, token).subscribe(
          {
            next: (response) => {
              console.log('Blog created successfully:', response);
              this.blogForm.reset();
              this.isLoading = false;
              this.snackBar.open('Blog Created Successfully', 'Close', {
                duration: 10000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.router.navigate([`/postblog/${token}`]);
  
            },
            error: (error) => {
              // console.error('Error creating blog:', error);
            },
            complete: () => {
              this.loading = false; // Set loading to false
            }
          }
        );
      } else {
        console.error('Invalid blog data');
        this.isLoading = false;
        this.snackBar.open('Invalid data', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
  
  goToPostBlog(): void {
    // Fetch the token from the query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log("Token in CreateBlog component:", token);
      // Navigate to the postblog component with the token
      this.router.navigate([`/postblog/${token}`]);
    });
  }
}


