import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApplyJob } from 'src/app/apply-job';
import { first } from 'rxjs/operators';
import { backendUrl, blogconst } from '../constant';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { JobPostService } from './job-post.service';
import { PostJob } from '../dashboardemp/alljobs/alljobs.component';
import { MatSnackBar } from '@angular/material/snack-bar';

// Define your API base URL as a constant variable
// const API_BASE_URL = '${API_BASE_URL}';
const API_BASE_URL = `${backendUrl}`;
const hustleURL = `${blogconst}`;
interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
  profile: String;
}
interface Employer {
  empid: Number;
  empfname: String;
  emplname: String;
  empcompany: String;
  empmailid: String;
  emppass: String;
  empphone: String;
  empcountry: String;
  empstate: String;
  empcity: String;
  descriptionemp: String;
}
interface Job {
  jobid: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
  payjobsup: string;
  empid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService  {

  // constructor(private snackBar: MatSnackBar){}
  http: any;
  private fetchUrl = `${backendUrl}fetchemployer`;
  fetchUserById(uid: string): Observable<User> {
    const url = `${backendUrl}fetchuserById/${uid}`;
    console.log("Request URL:", url); // Log the request URL
    return this.h1.get<User>(url);
  }
  getUserProfile() {
    throw new Error('Method not implemented.');
  }

  public errorMessage: string = '';
  apiUrl: any;
  companyNameUserService: string | null = null;
  jobNameUserService: string | null = null;
  empidUserService: string | null = null;
  jobidUserService: string | null = null;

  getUser() {
    throw new Error('Method not implemented.');
  }
  private jobTitleSource = new BehaviorSubject<string | null>(null);
  private companyNameSource = new BehaviorSubject<string | null>(null);
  private jobIdSource = new BehaviorSubject<string | null>(null);

  private empIdSource = new BehaviorSubject<string | null>(null);
  empId$ = this.empIdSource.asObservable();

  jobTitle$ = this.jobTitleSource.asObservable();
  jobId$ = this.jobIdSource.asObservable();
  companyName$ = this.companyNameSource.asObservable();

  setJobTitle(jobTitle: string) {
    this.jobTitleSource.next(jobTitle);
    this.jobTitle$.pipe(first()).subscribe(value => {
      this.jobNameUserService = value
    });
  }

  setEmpId(empId: string) {
    this.empIdSource.next(empId);
    this.empId$.pipe(first()).subscribe(value => {
      this.empidUserService = value
    });
  }
  setJobId(jobId: string) {
    this.jobIdSource.next(jobId);
    this.jobId$.pipe(first()).subscribe(value => {
      this.jobidUserService = value
    });
  }

  setCompanyName(companyName: string) {
    this.companyNameSource.next(companyName);
    this.companyName$.pipe(first()).subscribe(value => {
      this.companyNameUserService = value
    });
  }

  contactformurl = `${API_BASE_URL}insertfrontform`;
  inserturlc = `${API_BASE_URL}insertusermail`;
  logincheckurl = `${API_BASE_URL}logincheck`;
  logincheckurlgmail = `${API_BASE_URL}logincheckgmail`;
  insertgmail = `${API_BASE_URL}createOrGetUser`;

  fetchuserurl = `${API_BASE_URL}fetchuser`;
  updateUserurl = `${API_BASE_URL}updateUser`;
  insertusermailurl = `${API_BASE_URL}insertusermailgog`;
  deleteuseraccount = `${API_BASE_URL}`;
  // Employer
  inserturle = `${API_BASE_URL}insertemployer`;
  inserturlemail = `${API_BASE_URL}insertemployeremail`;
  employercheckurl = `${API_BASE_URL}logincheckemp`;
  employerdetailsfetchurl = `${API_BASE_URL}fetchemployer`;
  employerdetailsfetchurlName = `${API_BASE_URL}fetchemployerName`;
  employerdetailsfetchurlById = `${API_BASE_URL}fetchempById`;
  employerupdateurl = `${API_BASE_URL}updateEmployee`;
  deleteemployeraccount = `${API_BASE_URL}`;
  logincheckurlgmailemp = `${API_BASE_URL}employerLoginCheck`;
  insertgmailemp = `${API_BASE_URL}createOrGetEmployer`;
  // Job Post
  inserturljobpost = `${API_BASE_URL}jobpostinsert`;
  fetchjobposturl = `${API_BASE_URL}fetchjobpost`;
  fetchdisapprovejobpost = `${API_BASE_URL}fetchdisapprovejobpost`;

  // Contact
  inserturlcontact = `${API_BASE_URL}insertcontact`;
  fetchcontactdetails = `${API_BASE_URL}fetchcontact`;
  // Apply Job
  inserturlapplyjob = `${API_BASE_URL}insertapplyjob`;
  fetchapplyjobform = `${API_BASE_URL}fetchapplyform`;
  fetchapplyjobformnotify = `${API_BASE_URL}notificationforuser`;
  // Notification
  notificationurl = `${API_BASE_URL}insertnotification`;
  fetchnotificationurl = `${API_BASE_URL}fetchnotify`;

  // Resume Builder
  insert_resumeurl = `${API_BASE_URL}resumeinsert`;
  // Fetch Question
  fetchquestionpaperurl = `${API_BASE_URL}fetchquestion`;
  // Check Answer URL
  checkalanswere = `${API_BASE_URL}checkallanswer`;

  //Blog Content
  loginWithGoogleHustle = `${hustleURL}/google-auth`;
  constructor(private h1: HttpClient,private snackBar: MatSnackBar, private jobPostService: JobPostService, private router: Router, private auth: Auth, public cookie: CookieService) { }




  //Contact
  insertfrontform(formData: any) {
    return this.h1.post(this.contactformurl, formData);
  }


  //User 
  public insertusermail(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlc, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err, "get the error");
      }
    });
  }

  insertusermailgog(data: string) {

    // console.log("inside user google login");

    return this.h1.post(this.insertusermailurl, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        // console.log("data inserted");
      },
      error: (err: any) => {
        // console.log(err, "get the error");
      }
    })
  }
  // deleteUser(uid: string): Observable<any> {
  //   const urldu = `${this.deleteuseraccount}deactivate/${uid}`;
  //   return this.h1.delete(urldu);
  // }
  deactivateUser(uid: string): Observable<any> {
    const url = `${this.deleteuseraccount}deactivate/${uid}`;
    return this.h1.put(url, {});
  }

  // fetchuser() {
  //   return this.h1.get(this.fetchuserurl).pipe(catchError(this.handleError));
  // }
  // fetchuser(uid?:string,page?: number , name?:string) {
  //   const url = `${this.fetchuserurl}?page=${page}&name=${name}?uid=${uid}`;
  //   return this.h1.get(url).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  fetchuser(uid?: string, page?: number, name?: string) {
    let url = this.fetchuserurl;
    if (uid) {
      // If uid is provided, construct the URL with only uid
      url += `?uid=${uid}`;
    } else {
      // If uid is not provided, construct the URL with page and name
      url += `?page=${page}&name=${name}`;
    }
  
    return this.h1.get(url).pipe(
      catchError(this.handleError)
    );
  }


  checkUser(userName: string): Observable<any> {
    const url = `${API_BASE_URL}checkuser?userName=${userName}`;
    return this.h1.get(url);
  }


  //update user
  updateUser(data: any): Observable<any> {
    return this.h1.post(this.updateUserurl, data).pipe(
      catchError(this.handleEr)
    );
  }

  public logincheck(data: any) {
    return this.h1.post(this.logincheckurl, data).subscribe({
      next: (resp: any) => {
        if (resp && !resp.accdeactivate) {

          const mainres: User = resp;
          this.cookie.set('accessToken', resp.accessToken);
          this.cookie.set('uid', resp.uid);
          this.cookie.set('refreshToken', resp.refreshToken);

          const accessToken = resp.accessToken;
          AuthInterceptor.accessToken = accessToken;

          const isAuthenticated = resp.accessToken && resp.uid;

          if (isAuthenticated) {
            this.snackBar.open('Login Successfully.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            console.log("Inside authentication")
            this.router.navigate(['/dashboarduser']);
          } else if (resp && resp.error) {
            console.log("message")
            this.snackBar.open(resp.error, 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open('An unexpected error occurred. Please try again later.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            console.error('Unknown response format:', resp);
            this.router.navigate(['/login']);
          }
        } else {
          this.errorMessage = 'Your account is not activated. Please contact support for assistance.';
          console.log(this.errorMessage);
        }

      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Incorrect Credentials!', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      }
    });
  }


  public logincheckgmail(userName: string) {
    const data = { userName }; // Wrap the username in an object

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1.post(this.logincheckurlgmail, data, { headers }).subscribe({
      next: (resp: any) => {

        // console.log(resp);
        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: User = resp;
        // console.log(`Login response from the server: ${mainres}`);

        // Store the access token and uid in cookies
        this.cookie.set('accessToken', resp.accessToken);
        this.cookie.set('uid', resp.uid);
        this.cookie.set('refreshToken', resp.refreshToken);
        const accessToken = resp.accessToken; 
        AuthInterceptor.accessToken = accessToken;

        const isAuthenticated = resp.accessToken && resp.uid;
        if (isAuthenticated) {
          this.snackBar.open('Login Successfully.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          this.router.navigate(['/dashboarduser']);
        } else {
          this.router.navigate(['/login']);
        }
        // console.log("Data checked");
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Incorrect Credentials', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      }
    });
  }

  public logincheckgmailBLOG(userName: string) {
    const data = { userName }; // Wrap the username in an object

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1.post(this.loginWithGoogleHustle, data, { headers }).subscribe({
      next: (resp: any) => {

        const mainres: User = resp;

        this.cookie.set('accessToken', resp.access_token);
        // this.cookie.set('uid', resp.uid);

        const accessToken = resp.access_token;
        AuthInterceptor.accessToken = accessToken;

        const isAuthenticated = resp.accessToken;
        if (isAuthenticated) {

          this.snackBar.open('Login Successful!', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate([`/postblog/${accessToken}`]);
        } else {
          this.snackBar.open('Incorrect Credentials!', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/blogs']);
        }
      },
      error: (err: any) => {
        // console.log(err);
        this.snackBar.open('Incorrect Credentials!', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      }
    });
  }



  fetchapplyformbyjobid(empid: string, jobid: string): Observable<any> {
    const url = `${API_BASE_URL}fetchapplyformbyjobid?empid=${empid}&jobid=${jobid}`;
    return this.h1.get(url).pipe(
      catchError(error => {
        console.error('Error fetching apply form by job id:', error);
        return throwError('Failed to fetch apply form by job id');
      })
    );
  }

  createOrGetUser(userName: any, userFirstName: any) {
    const requestBody = { userName, userFirstName };
    console.log(requestBody);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1
      .post<Map<string, Object>>(`${API_BASE_URL}createOrGetUser`, requestBody, {
        headers,
        observe: 'response', // to access the full HTTP response, including headers
      })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status === 200) {
              // API call was successful
              const responseBody = response.body;
              console.log('API Response:', responseBody);

              // You can access the data from the response as needed, e.g., responseBody.accessToken
              const accessToken = responseBody.accessToken;
              const uid = responseBody.uid;

              // Handle the response data here
              if (accessToken && uid) {
                // console.log("Access Token Generated" + accessToken);
                const mainres: User = response;
                // console.log(`Login response from the server: ${mainres}`);

                // Store the access token and uid in cookies
                this.cookie.set('accessToken', accessToken);
                this.cookie.set('uid', uid);
                this.cookie.set('refreshToken', responseBody.refreshToken);
                // console.log("refresh token saved ", responseBody.refreshToken);
                // Inside your logincheckgmail function

                AuthInterceptor.accessToken = accessToken;
                // Check if both accessToken and uid are present to determine authentication
                const isAuthenticated = accessToken && uid;
                // User data is available, do something with it
                if (isAuthenticated) {
                  this.snackBar.open('Login Successful!', 'Close', {
                    duration: 10000, // Duration in milliseconds
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                  this.router.navigate(['/dashboarduser']);
                } else {
                  this.snackBar.open('Incorrect Credentials!', 'Close', {
                    duration: 10000, // Duration in milliseconds
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                  this.router.navigate(['/login']);
                }
              } else {
                // Handle the case when the API response does not contain the expected data
              }
            } else {
              // Handle non-200 status codes here (e.g., error responses)
            }
          },
          error: (error: any) => {
            // Handle HTTP error or client-side error here
            // console.error('API Error:', error);
          }
        }
      );
  }


  //Employer
  // deleteEmployer(empid: string): Observable<any> {
  //   const urlde = `${this.deleteemployeraccount}deleteEmployer/${empid}`;
  //   return this.h1.put(urlde);
  // }
  // deleteEmployer(empid: string): Observable<any> {
  //   const url = `${API_BASE_URL}empldeactivate/${empid}`;
  //   return this.h1.put(url, {});
  // }
  deleteEmployer(empid: string): Observable<any> {
    const url = `${API_BASE_URL}empldeactivate/${empid}`;
    return this.h1.put(url, {});
  }


  checkEmployer(empmailid: string): Observable<any> {
    const url = `${API_BASE_URL}checkEmployer?empmailid=${empmailid}`;
    return this.h1.get(url);
  }

  //update employer data
  updateEmployee(data: any): Observable<any> {
    return this.h1.post(this.employerupdateurl, data).pipe(
      catchError(this.handleEr)
    );
  }
  private handleEr(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.error(errorMessage);
    return throwError(errorMessage);
  }

  employeeID: string = '';

  logincheckemp(data: any) {
    // console.log(data);

    return this.h1.post(this.employercheckurl, data).subscribe({
      next: (resp: any) => {
        if (resp && !resp.accempldeactivate) {
          // console.log("Access Token Generated" + resp.accessToken);
          const mainres: Employer = resp;
          // console.log(`Login response from the server: ${mainres}`);
          this.cookie.set('emp', resp.empid);
          this.cookie.set('accessToken', resp.accessToken);
          this.cookie.set('refreshToken', resp.refreshToken);
          console.log("Employee ID is: ", resp.empid);
          this.employeeID = resp.empid;
          // console.log("Refresh token saved ", resp.refreshToken);
          // Inside your logincheckgmail function
          const accessToken = resp.accessToken; // Assuming this is where you get the access token
          AuthInterceptor.accessToken = accessToken;
          const isAuthenticated = resp.accessToken && resp.empid;

          if (isAuthenticated) {
            // console.log("Server responded with an object of employer");
            this.snackBar.open('Login Successfully.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/dashboardemp']);
          } else {
            this.snackBar.open('Incorrect Credentials.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/employer']);
          }
        } else {
          this.errorMessage = 'Your account is not activated. Please contact support for assistance.';
          console.log(this.errorMessage);
        }
      },
      error: (err: any) => {
        this.snackBar.open('Incorrect Credentials!', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/employer']);
      }
    });
  }

  createOrGetEmployer(empmailid: string, empfname: string) {
    const requestBody = { empmailid, empfname };
    console.log(requestBody);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1
      .post<Map<string, Object>>(`${API_BASE_URL}createOrGetEmployer`, requestBody, {
        headers,
        observe: 'response',
      })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status === 200) {
              const responseBody = response.body;
              const accessToken = responseBody.accessToken;
              const empid = responseBody.empid;
              console.log("AccessToken", accessToken);
              console.log("empid", empid);
              if (accessToken && empid) {
                const mainres: Employer = response;
                this.cookie.set('emp', empid);
                this.cookie.set('accessToken', accessToken);
                this.cookie.set('refreshToken', responseBody.refreshToken);
                console.log('Refresh Token Saved:', responseBody.refreshToken);
                AuthInterceptor.accessToken = accessToken;
                const isAuthenticated = accessToken && empid;
                if (isAuthenticated) {
                  console.log("Server responded with an object of employer");
                  this.snackBar.open('Login Successful!', 'Close', {
                    duration: 10000, // Duration in milliseconds
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                  this.router.navigate(['/dashboardemp']);
                } else {
                  this.snackBar.open('Incorrect Credentials!', 'Close', {
                    duration: 10000, // Duration in milliseconds
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                  this.router.navigate(['/employer']);
                }
              } else {
                // Handle the case when the API response does not contain the expected data
              }
            } else {
              // Handle non-200 status codes here (e.g., error responses)
            }
          },
          error: (error: any) => {
            // Handle HTTP error or client-side error here
            // console.error('API Error:', error);
          }
        }
      );
  }

  employerLoginCheck(empmailid: string) {
    const data = { empmailid };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.h1.post(this.logincheckurlgmailemp, data, { headers }).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: Employer = resp;
        // console.log(`Login response from server: ${mainres}`);
        this.cookie.set('emp', resp.empid);
        this.cookie.set('accessToken', resp.accessToken); // Store access token in a cookie
        this.cookie.set('refreshToken', resp.refreshToken);
        // console.log("refresh token saved ", resp.refreshToken);
        // Inside your logincheckgmail function
        const accessToken = resp.accessToken; // Assuming this is where you get the access token
        AuthInterceptor.accessToken = accessToken;
        // Check if both accessToken and empid are present to determine authentication
        // Check if both accessToken and empid are present to determine authentication
        const isAuthenticated = resp.accessToken && resp.empid;

        if (isAuthenticated) {
          this.snackBar.open('Login Successfully.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboardemp']);
        } else {
          // Handle other response statuses or errors
          this.snackBar.open('Email does not exist...Please register!!.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/employer']);
        }
      },
      error: (err: any) => {
        this.snackBar.open('Email does not exist...Please register!!', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/employer']);
      }
    });
  }




  public insertemployer(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturle, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }


  public insertemployeremail(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlemail, data).subscribe({
      next: (resp: any) => {
        // console.log("email is getting inserted");
        // console.log(resp);
        this.router.navigate(['/dashboardemp/profilemep']);

        // console.log("Data inserted mail");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }


  fetchemployerName() {
    return this.h1.get(this.employerdetailsfetchurlName);
  }

  fetchemployer(page?: number , companyName?:string , name?:string) {
    const url = `${this.employerdetailsfetchurl}?page=${page}&companyName=${companyName}&name=${name}`;
    return this.h1.get(url).pipe(
      catchError(this.handleError)
    );
  }
  fetchEmployerById(empid:string){
    const url = `${this.employerdetailsfetchurlById}/${empid}`;
    return this.h1.get(url).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: any): Observable<never> {

    // console.error('An error occurred:', error);

    // Return an observable with an error message or perform other error handling tasks.
    return throwError('Something went wrong. Please try again later.');
  }

  //Job Post

  public jobpostinsert(data: any): Observable<any> {
    return this.h1.post(this.inserturljobpost, data, { responseType: 'text' });
  }



  // fetchjobpost() {
  //   return this.h1.get(this.fetchjobposturl);
  // }

  fetchJobPostsWithStatus(uid: string | null): Observable<any> {
    const url = uid ? `${API_BASE_URL}fetchjobpoststatus?uid=${uid}` : this.apiUrl;
    return this.h1.get(url);
  }

  fetchJobPostsWithStatuscheck(uid: string | null, page?: number): Observable<any> {
    const url = uid ? `${API_BASE_URL}fetchjobpoststatuscheck?uid=${uid}&page=${page}` : `${API_BASE_URL}fetchjobpoststatuscheck?page=${page}`;
    return this.h1.get(url);
  }
  fetchJobPostsWithStatusDup(uid: string | null, page: number): Observable<any> {
    const url = uid ? `${API_BASE_URL}fetchjobpoststatus?uid=${uid}&page=${page}` : `${API_BASE_URL}fetchjobpoststatus?page=${page}`;
    return this.h1.get(url);
  }
  // fetchjobpost(empid?: string): Observable<PostJob[]> {
  //   const url = empid ? `${this.fetchjobposturl}?empid=${empid}` : this.fetchjobposturl;
  //   return this.h1.get<PostJob[]>(url);
  // }
  fetchjobpost(empid?: string, page?: number, searchCompany?: string): Observable<PostJob[]> {
    let url = this.fetchjobposturl;
    if (empid) {
      url += `?empid=${empid}`;
    }
    if (page) {
      url += empid ? `&page=${page}` : `?page=${page}`;
    }
    if (searchCompany) {
      url += empid || page ? `&searchCompany=${searchCompany}` : `?searchCompany=${searchCompany}`;
    }
    return this.h1.get<PostJob[]>(url);
  }
  fetchEmployer(
    empid?: string,
    page: number = 0,
    size: number = 10,
    name?: string,
    companyName?: string,
    uid?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      

    if (empid) {
      params = params.set('empid', empid);
    }
    if (name) {
      params = params.set('name', name);
    }
    if (companyName) {
      params = params.set('companyName', companyName);
    }
    if (uid) {
      params = params.set('uid', uid);
    }

    return this.h1.get<any>(this.fetchUrl, { params });
  }

  // fetchjobpost(empid?: string): Observable<Job[]> {
  //   const url = empid ? `${this.fetchjobposturl}?empid=${empid}` : this.fetchjobposturl;
  //   return this.h1.get<Job[]>(url);
  // }


  fetchDisapprovejobpostadmin(empid?: string): Observable<PostJob[]> {
    const url = empid ? `${this.fetchdisapprovejobpost}?empid=${empid}` : this.fetchjobposturl;
    return this.h1.get<PostJob[]>(url);
  }

  //Conatct
  public insertcontact(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlcontact, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  fetchcontact(page?:number) {
    return this.h1.get(`${this.fetchcontactdetails}?page=${page}`);
  }


  //Appply form data
  fetchapplyform(empid?: string, pageNumber?: number, jobTitle?: string, jobStatus?: string, uid?: String) {
    let params = new HttpParams();

    if (empid) {
      params = params.set('empid', empid);
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      params = params.set('page', pageNumber);
    }
    if (jobTitle && jobTitle.trim() !== '') {
      params = params.set('jobTitle', jobTitle);
    }
    if (jobStatus && jobStatus.trim() !== '') {
      params = params.set('jobStatus', jobStatus);
    }
    if (uid && uid.trim() !== '') {
      params = params.set('uid', uid.toString());
    }

    return this.h1.get(this.fetchapplyjobform, { params });
  }


  fetchapplyformnotify(uid: string | null) {
    const url = uid ? `${this.fetchapplyjobformnotify}?uid=${uid}` : this.fetchapplyjobformnotify;
    return this.h1.get(url);
  }

  //update apply form by employer 
  updateProfileUpdate(application: ApplyJob): Observable<ApplyJob> {
    return this.h1.post<ApplyJob>(
      `${API_BASE_URL}updateProfileUpdate`,
      application
    );
  }
  //insert apply form data
  public insertapplyjob(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlapplyjob, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        localStorage.removeItem('applyJobFormData');
        // console.log("Data inserted");
      },
      error: (err: any) => {
        this.snackBar.open('You have already apply for this from this account once...', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // console.log(err);
      }
    });
  }

  //insert notification
  public insertnotification(data: any) {
    // console.log("done");
    return this.h1.post(this.notificationurl, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);

        // console.log("Data inserted");
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  fetchnotify(): Observable<any[]> {
    return this.h1.get<any[]>(this.fetchnotificationurl);
  }


  //Insert Resume
  public resumeinsert(data: any): Observable<any> {
    // console.log(data);
    // console.log("done");

    return this.h1.post(this.insert_resumeurl, data);
  }




  //fetch question paper fetchquestionpaperurl
  fetchquestion() {
    return this.h1.get(this.fetchquestionpaperurl);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  public checkallanswer(userAnswers: any[]) {
    const url = this.checkalanswere;

    return this.h1.post(url, userAnswers).subscribe({
      next: (resp: any) => {
        if (resp) {
          // If response is true
          this.router.navigate(['/dashboarduser/applyjob']);
          this.snackBar.open('Answers checked successfully. You passed!', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          // If response is false
          this.router.navigate(['/dashboarduser']);
          this.snackBar.open('Answers checked. Unfortunately, you did not pass. Try again.', 'Close', {
            duration: 10000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err: any) => {
        // Handle error and navigate to the appropriate route
        console.error(err);
        this.router.navigate(['/dashboarduser/']);
        this.snackBar.open('Error checking answers. Please try again.', 'Close', {
          duration: 10000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateSavedJobStatus(jobid: string, uid: string): Observable<any> {
    const url = `${API_BASE_URL}update-status?jobid=${jobid}&uid=${uid}&status=${status}`;
    return this.h1.put(url, {});
  }


  addQuestion(jobid: string, questionData: any): Observable<any> {
    const url = `${API_BASE_URL}add?jobid=${jobid}`;
    return this.h1.post(url, questionData);
  }
  checkJobIdExists(jobid: string): Observable<boolean> {
    const url = `${API_BASE_URL}checkjobid?jobid=${jobid}`;
    return this.h1.get<boolean>(url);
  }
  checkAlreadyApplied(jobid: string, uid: string) {
    const url = `${API_BASE_URL}check-application?jobid=${jobid}&uid=${uid}`;
    return this.h1.get(url, { responseType: 'text' });
  }


  fetchQuestionsByJobId(jobid: string): Observable<any> {
    const url = `${API_BASE_URL}fetchquestionbyjobid?jobid=${jobid}`;
    return this.h1.get(url);
  }

  deleteUserStatus(uid: string, juid: string): Observable<boolean> {
    const url = `${API_BASE_URL}deleteUserStatus?uid=${uid}&juid=${juid}`;
    return this.h1.delete<boolean>(url);
  }

  updateViewCheck(uid: string, juid: string): Observable<string> {
    const url = `${API_BASE_URL}updateViewCheck?uid=${uid}&juid=${juid}`;
    return this.h1.put<string>(url, {});
  }

  getEmployerFullName(empid: string): Observable<string> {
    const url = `${API_BASE_URL}employer/fullname?empid=${empid}`;
    return this.h1.get<any>(url).pipe(
      catchError((error: any) => {
        let errorMessage = 'An error occurred while fetching employer full name.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        throw new Error(errorMessage);
      })
    );
  }

  getUserFullName(uid: string): Observable<string> {
    const url = `${API_BASE_URL}user/fullname?uid=${uid}`;
    return this.h1.get<any>(url).pipe(
      catchError((error: any) => {
        let errorMessage = 'An error occurred while fetching user full name.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        throw new Error(errorMessage);
      })
    );
  }



}
