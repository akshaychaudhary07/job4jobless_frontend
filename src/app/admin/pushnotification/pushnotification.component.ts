import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pushnotification',
  templateUrl: './pushnotification.component.html',
  styleUrls: ['./pushnotification.component.css']
})
export class PushnotificationComponent implements OnInit {
  title: string = '';
  body: string = '';
  options: any[] = [];
  selectedValues: any[] = [];
  error: string | null = null;
  show: boolean = false;
  color: string | undefined;
  form!: FormGroup;
  token!: string;
  selectedTokens: string[] = [];
  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchTokens();
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      token: [[]]
    });
  }

  deleteToken(): void {
    this.selectedTokens.pop(); // Remove the last item from the array
  }
  fetchTokens(): void {
    this.http.get<any>('https://job4jobless.in:4000/api/gettoken')
      .subscribe(
        {
          next: (response) => {
            // this.options = response?.result?.token || [];
            // this.options = response?.result?.token || [];
            this.options = response?.result?.token?.map((tokenObj: { token: any; }) => tokenObj.token) || [];
          },
          error: (error) => {
            console.error('Error fetching options:', error);
          }
        }
      );
  }
  onTokenSelection(event: any): void {
    const selectedValues = Array.from(event.target.selectedOptions)
      .map((option: any) => option.value)
      .filter((value: string) => !this.selectedTokens.includes(value));
   
    this.selectedTokens = [...this.selectedTokens, ...selectedValues];
    console.log('Selected Tokens:', this.selectedTokens);
  }

  handleSubmit(): void {
    if (this.form.valid) {
      console.log("Form data is: ", this.form.value);
      // const formData = this.form.value;
      const formData = {
        title: this.form.value.title,
        body: this.form.value.body,
        token: this.selectedTokens
      };
 
      console.log("Form data is: ", formData)
      this.http.post<any>('https://job4jobless.in:4000/api/sendmsg', formData)
        .subscribe({
          next: response => {
            console.log("Response is: ", response)
            if (response) {
              console.log('Message is:', response);
              // Handle success
            } else {
              console.log('No message received from server');
              // Handle case where response data is undefined
            }
          },
          error: error => {
            console.error('Error sending message:', error);
            this.error = 'Error sending message. Please try again.';
          }
        });
    } else {
      console.log('Form is invalid');
      // Handle invalid form
    }
  }

  closeErrorPopup(): void {
    this.show = false;
  }
}
