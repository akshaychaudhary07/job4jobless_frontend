import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { UserService } from 'src/app/auth/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { backendUrl } from 'src/app/constant';

// Define SendMessage model
export class SendMessage {
  constructor(
    public messageTo: string,
    public messageFrom: string,
    public message: string
  ) {}
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  empidMap: { [key: string]: string } = {};
  employerNames: { [messageFrom: string]: string } = {};
  messages: SendMessage[] = [];
  selectedUser: string | null = null;
  filteredMessages: SendMessage[] = [];
  userID: string | null = null;
  userData1: any;
  abc: string | null = null;
  newMessage: string = '';
  socket!: Socket;
  messageForm: FormGroup;
  fetchedEmployerData: any; // Declare fetchedEmployerData as a class member
  allEmployerNames: string[] = [];

  private backend_URL=`${backendUrl}`;
  uid!: string;
  fullName: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public cookie: CookieService,
    private b1: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.userID = this.cookie.get('uid');
    this.abc = this.route.snapshot.paramMap.get('empid');

    this.initSocketConnectionForUser(this.userID); // Initialize socket connection for the user
    this.fetchMessages(); // Fetch messages for the user
    this.loadEmployerNames();
  }

  ngOnInit(): void {

    this.userID = this.cookie.get('uid');
    this.uid = this.cookie.get('uid');
    this.fetchFullName();
    this.loadEmployerNames();
  }

  fetchFullName(): void {
    this.b1.getUserFullName(this.uid).subscribe(
      (response: any) => {
        if (response.fullName) {
          this.fullName = response.fullName;
          // console.log(this.fullName);
        } else {
          this.fullName = 'User not found';
        }
      },
      (error: any) => {
        // console.error('Error fetching user full name:', error.message);
        this.fullName = error.message;
      }
    );
  }
  

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  selectUser(user: string): void {
    this.selectedUser = user;
    this.fetchMyMessages(); // Fetch messages for the selected user
  }
  
  initSocketConnectionForUser(userId: string): void {
    if (!this.userID) {
      // console.error('UserID is missing.');
      return;
    }
  
    this.socket = io('https://job4jobless.in:4400', {
      query: {
        id: this.cookie.get('uid'), // Send the user's ID as 'id' query parameter
        targetId: userId
      }
    });
  
    this.socket.on('message', (message: SendMessage) => {
      // console.log('Received message:', message);
      this.messages.push(message);
      this.filterMessages(); // Update filteredMessages when a new message is received
      this.cdr.detectChanges(); // Trigger change detection
    });
  
    this.socket.on('connect', () => {
      // console.log('Socket connected');
      // console.log('Source ID:', this.userID);
      // console.log('Target ID:', userId);
    });
  }
    
  fetchMessages(): void {
    const uniqueNames = new Set<string>();
    if (!this.userID) {
      // console.error('UserID is missing.');
      return;
    }

    this.http.get<SendMessage[]>(`${this.backend_URL}fetchMessages`).subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter((message) => {
        if (!uniqueNames.has(message.messageFrom) && (message.messageTo == this.userID)) {
          uniqueNames.add(message.messageFrom);
          return message.messageTo === this.userID;
        }
        return false;
      });
      this.loadEmployerNames();

      if (this.messages.length > 0) {
        this.messageForm.patchValue({
          message: this.messages[this.messages.length - 1].message,
        });
      }
      this.filterMessages(); // Update filteredMessages after fetching messages
    });
  }

  loadEmployerNames() {
    const uniqueMessageFromValues = Array.from(new Set(this.messages.map((message) => message.messageFrom)));

    this.b1.fetchemployerName().subscribe((employerData: any) => {
      if (Array.isArray(employerData)) {
        for (const messageFrom of uniqueMessageFromValues) {
          const matchingEmployer = employerData.find((employer: any) => employer.empid === messageFrom);
          if (matchingEmployer) {
            // Matching employer found, store the name in employerNames
            this.employerNames[messageFrom] = matchingEmployer.empfname;
          }
        }
      } else {
        // console.error('Received employer data is not an array');
      }
    });
  }


  fetchMyMessages() {
    // console.log("show the value",this.selectedUser);
    this.http.get<SendMessage[]>(`${this.backend_URL}fetchMessages`).subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter(
        (message) =>
          (message.messageTo === this.selectedUser && message.messageFrom === this.userID) ||
          (message.messageTo === this.userID && message.messageFrom === this.selectedUser)
      );

      if (this.messages.length > 0) {
        this.messageForm.patchValue({
          message: this.messages[this.messages.length - 1].message,
        });
      }
    });
  }

  sendMessage(): void {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageTo = this.selectedUser;
      const message = this.newMessage;

      if (this.socket) {
        const data = {
          messageTo,
          messageFrom: this.cookie.get('uid'),
          message
        };
        this.socket.emit('message', data);

        const sentMessage = new SendMessage(messageTo, this.cookie.get('uid'), message);
        this.messages.push(sentMessage);
        this.filterMessages();
        this.newMessage = ''; // Clear input field
      }

      const messageToSend = new SendMessage(messageTo, this.cookie.get('uid'), message);
      this.http.post<SendMessage>(`${this.backend_URL}send`, messageToSend).subscribe({
        next: (response: SendMessage) => {
       
        },
        error: (err: any) => {
          // console.error('Error sending message:', err);
        }
      });
    }
  }
  getMessageStyle(message: any) {
    if (message.messageFrom === this.uid) {
      return { backgroundColor: 'lightblue' };
    } else {
      return { backgroundColor: 'white' };
    }
  }
  
  startVideoCall(): void {
    if (this.selectedUser) {
      this.router.navigate(['/dashboarduser/videocall', this.selectedUser]);
    }
  }

  // Function to update filteredMessages based on selected user
  filterMessages(): void {
    if (!this.userID || !this.selectedUser) {
      // console.error('UserID or selectedUser is missing.');
      return;
    }

    this.filteredMessages = this.messages.filter(message =>
      (message.messageFrom === this.selectedUser && message.messageTo === this.userID) ||
      (message.messageFrom === this.userID && message.messageTo === this.selectedUser)
    );
  }
}
