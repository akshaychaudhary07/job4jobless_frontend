// empmessage.component.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { backendUrl } from 'src/app/constant';
import { UserService } from 'src/app/auth/user.service';

interface SendMessage {
  messageTo: string;
  messageFrom: string;
  message: string;
  isSender:String;
  sendTime:Date;
}

@Component({
  selector: 'app-empmessage',
  templateUrl: './empmessage.component.html',
  styleUrls: ['./empmessage.component.css']
})
export class EmpmessageComponent implements OnInit {
  messageForm: FormGroup;
  messages: SendMessage[] = [];
  socket!: Socket;
  empid: string;
  uid: string | null;
  juname!: string | null; 
  private backend_URL = `${backendUrl}`;
  employerFullName!: string;
  fullName!: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private b1:UserService
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.empid = this.cookie.get('emp');
    this.uid = this.route.snapshot.paramMap.get("uid");
    this.initSocketConnection();
  }

  ngOnInit(): void {
    this.empid = this.cookie.get('emp');
    this.route.queryParams.subscribe(params => {
       this.juname = params['juname'];
      // console.log(this.juname);
      // Use juname in your component logic
    });
    // Fetch employer full name
    this.fetchFullName();

    this.fetchMessages();

  }
  fetchFullName(): void {
    this.b1.getEmployerFullName(this.empid).subscribe(
      (response: any) => {
        if (response.fullName) {
          this.fullName = response.fullName;
          // console.log(this.fullName);
        } else {
          this.fullName = 'Employer not found';
        }
      },
      (error: any) => {
        // console.error('Error fetching employer full name:', error.message);
        this.fullName = error.message;
      }
    );
  }
  
  initSocketConnection() {
    // Check if both `empid` and `uid` are available
    if (!this.empid || !this.uid) {
      // console.error('Empid or uid is missing.');
      return;
    }
  
    // Establish socket connection with query parameters
    this.socket = io('https://job4jobless.in:4400', {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        id: this.empid, // Set the empid as sourceId
        targetId: this.uid ? this.uid : ''   // Set the uid as targetId
      }
    });
  
    // Handle socket events
    this.socket.on('connect_error', (error: any) => {
      // console.error('Socket Error:', error);
    });-
  
    this.socket.on('message', (message: SendMessage) => {
      console.log("Message is: ",message);
      // console.log('Received message:', message);
      this.messages.push(message);
    });
  
    this.socket.on('connect', () => {
      // console.log('Socket connected');
      // console.log('Source ID:', this.empid);
      // console.log('Target ID:', this.uid);
    });
  
    // Connect the socket
    this.socket.connect();
  }
  
  
  fetchMessages() {
    this.http.get<SendMessage[]>(`${this.backend_URL}fetchMessages`).subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter(
        (message) =>
          (message.messageTo === this.uid && message.messageFrom === this.empid) ||
          (message.messageTo === this.empid && message.messageFrom === this.uid)
      );

      if (this.messages.length > 0) {
        this.messageForm.patchValue({
          message: this.messages[this.messages.length - 1].message,
        });
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid && this.uid) {
      const messageToSend = {
        messageTo: this.uid,
        messageFrom: this.empid,
        message: this.messageForm.value.message,
        isSender: this.fullName  // Set isSender based on juname
      };

      // console.log('Sending message:', messageToSend);

      this.socket.emit('message', messageToSend);

      this.http.post<SendMessage>(`${this.backend_URL}send`, messageToSend).subscribe({
        next: (response: any) => {
          // console.log('API Response:', response);
          this.messageForm.patchValue({
            message: '',
          });
          this.fetchMessages();
        },
        error: (err: any) => {
          // console.error('Error sending message:', err);
        },
      });
    }
  }
}
