import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import Peer from "peerjs";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { backendUrl } from "src/app/constant";
import { MatSnackBar } from "@angular/material/snack-bar";
import { io, Socket } from "socket.io-client";

class SendMessage {
  messageTo!: string;
  messageFrom!: string;
  message!: string;
}
@Component({
  selector: "app-videocall",
  templateUrl: "./videocall.component.html",
  styleUrls: ["./videocall.component.css"],
})
export class VideocallComponent implements OnInit {
  message: SendMessage = new SendMessage(); // Initialize an empty message
  uid!: string | null;
  socket!: Socket;
  empid!: string;

  messageForm!: any;
  messages!: SendMessage[];
  private backend_URL = `${backendUrl}`;
  @ViewChild("roomInput", { static: true })
  roomInput!: ElementRef<HTMLInputElement>;
  @ViewChild("localVideo", { static: true })
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild("remoteVideo", { static: true })
  remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild("notification", { static: true })
  notification!: ElementRef<HTMLElement>;
  @ViewChild("entryModal", { static: true })
  entryModal!: ElementRef<HTMLElement>;

  PRE = "Orage";
  SUF = "video";
  room_id!: string;
  local_stream: MediaStream | undefined;
  screenStream: MediaStream | undefined;
  peer: Peer | null = null; // Use Peer from the imported library
  currentPeer: any = null;
  screenSharing = false;
  audioMuted: boolean = false;
  videoMuted: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  endCall: boolean = false;

  ngOnInit(): void {
    this.empid = this.cookie.get("emp");
    console.log("checking the emmpid", this.empid);

    this.uid = this.route.snapshot.paramMap.get("uid");
    // console.log("uid:", this.uid);
    // Get the "to" value from the cookie (assuming "empemailid" is the cookie name)
    this.message.messageFrom = this.cookie.get("emp");
    // console.log(this.message.messageFrom);
    // console.log(this.uid);

    this.fetchMessages();
    this.messageForm = this.formBuilder.group({
      messageFrom: [this.message.messageFrom, Validators.required],
      messageTo: [this.uid, Validators.required],
      message: [this.message.message, Validators.required],
    });
    this.loadScript("assets/video-call.js").then(() => {
      // The script has been loaded and executed.
      // You can now call functions and use variables from the script.
    });

    this.initSocketConnection();
  }
  fetchMessages() {
    // Fetch previous messages from the server
    this.http
      .get<SendMessage[]>(`${this.backend_URL}fetchMessages`)
      .subscribe((messages: SendMessage[]) => {
        // Filter messages to only include the relevant ones
        this.messages = messages.filter(
          (message) =>
            (message.messageTo === this.uid &&
              message.messageFrom === this.message.messageFrom) ||
            (message.messageTo === this.message.messageFrom &&
              message.messageFrom === this.uid)
        );

        // If relevant messages are found, set the previousMessage field
        if (this.messages.length > 0) {
          this.messageForm.patchValue({
            previousMessage: this.messages[this.messages.length - 1].message,
          });
        }
      });
  }

  initSocketConnection() {
    // Check if both `empid` and `uid` are available
    if (!this.empid || !this.uid) {
      // console.error('Empid or uid is missing.');
      return;
    }

    // Establish socket connection with query parameters
    this.socket = io("https://job4jobless.in:4400", {
      transports: ["websocket"],
      autoConnect: false,
      query: {
        id: this.empid, // Set the empid as sourceId
        targetId: this.uid ? this.uid : "", // Set the uid as targetId
      },
    });

    // Handle socket events
    this.socket.on("connect_error", (error: any) => {
      // console.error('Socket Error:', error);
    });
    -this.socket.on("message", (message: SendMessage) => {
      console.log("Message is: ", message);
      // console.log('Received message:', message);
      this.messages.push(message);
    });

    this.socket.on("connect", () => {
      // console.log('Socket connected');
      // console.log('Source ID:', this.empid);
      // console.log('Target ID:', this.uid);
    });

    // Connect the socket
    this.socket.connect();
  }

  toggleAudio() {
    this.audioMuted = !this.audioMuted;
    const audioTracks = this.local_stream?.getAudioTracks();
    audioTracks?.forEach((track) => (track.enabled = !this.audioMuted));
  }

  toggleVideo() {
    this.videoMuted = !this.videoMuted;
    const videoTracks = this.local_stream?.getVideoTracks();
    videoTracks?.forEach((track) => (track.enabled = !this.videoMuted));
  }

  sendMessage() {
    if (this.messageForm.valid) {
      //      const messageToSend = this.messageForm.value;

      const messageToSend = {
        messageTo: this.uid,
        messageFrom: this.empid,
        message: this.messageForm.value.message,
        //        isSender: this.fullName  // Set isSender based on juname
      };

      console.log("Sending message:", messageToSend);

      this.socket.emit("message", messageToSend);

      // Make an HTTP POST request to send the message
      this.http
        .post<SendMessage>(`${this.backend_URL}send`, messageToSend)
        .subscribe({
          next: (response: any) => {
            // console.log('Message sent successfully:', response);
            // Optionally, reset the form
            this.messageForm.patchValue({
              message: "",
              previousMessage: response.message, // Set previousMessage to the sent message
            });
            this.fetchMessages();
          },
          error: (err: any) => {
            // console.error('Error sending message:', err);
          },
        });
    }
  }
  createRoom() {
    // console.log('Creating Room');
    const roomInput = this.roomInput.nativeElement.value.trim();
    if (!roomInput) {
      this.snackBar.open("Please enter room number", "Close", {
        duration: 10000, // Duration in milliseconds
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      return;
    }
    // this.endCall=true;
    this.room_id = this.PRE + roomInput + this.SUF;
    this.peer = new Peer(this.room_id);
    this.peer.on("open", (id: any) => {
      // console.log('Peer Connected with ID: ', id);
      this.hideModal();
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true }) // Updated getUserMedia
        .then((stream: MediaStream) => {
          this.local_stream = stream;
          this.setLocalStream(this.local_stream);
          this.endCall = true;
        })
        .catch((err: any) => {
          // console.log(err);
        });
      this.endCall = true;
      this.notify("Waiting for peer to join.");
    });
    this.peer.on("call", (call: any) => {
      if (this.local_stream) {
        call.answer(this.local_stream);
        call.on("stream", (stream: MediaStream) => {
          this.setRemoteStream(stream);
          this.endCall = true;
        });
        this.currentPeer = call;
      }
    });
  }
  confirmEndCall() {
    if (confirm("Are you sure you want to end the call?")) {
      // Close the current Peer connection
      if (this.peer) {
        this.peer.disconnect();
        this.peer.destroy();
      }

      // Optionally, stop local and remote streams
      if (this.local_stream) {
        this.local_stream.getTracks().forEach((track) => track.stop());
      }

      this.room_id = "";
      // User clicked OK, navigate to the specific URL
      this.router.navigate(["dashboardemp/empmessage"]); // Replace '/specific-url' with your desired URL
    } else {
      // User clicked Cancel, do nothing or handle accordingly
    }
  }
  setLocalStream(stream: MediaStream) {
    const video = this.localVideo.nativeElement;
    video.srcObject = stream;
    video.muted = true;
    video.play();
  }

  setRemoteStream(stream: MediaStream) {
    const video = this.remoteVideo.nativeElement;
    video.srcObject = stream;
    video.play();
  }

  hideModal() {
    this.entryModal.nativeElement.hidden = true;
  }

  notify(msg: string) {
    const notification = this.notification.nativeElement;
    notification.innerHTML = msg;
    notification.hidden = false;
    setTimeout(() => {
      notification.hidden = true;
    }, 3000);
  }

  joinRoom() {
    // console.log('Joining Room');
    const room = this.roomInput.nativeElement.value.trim();
    if (!room) {
      this.snackBar.open("Please enter room number", "Close", {
        duration: 10000, // Duration in milliseconds
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      return;
    }
    this.room_id = this.PRE + room + this.SUF;
    this.hideModal();
    this.peer = new Peer();
    this.peer.on("open", (id: string) => {
      // console.log('Connected with Id: ' + id);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true }) // Updated getUserMedia
        .then((stream: MediaStream) => {
          this.local_stream = stream;
          this.setLocalStream(this.local_stream);
          this.notify("Joining peer");
          const call = this.peer!.call(this.room_id, stream); // Use non-null assertion here
          call.on("stream", (stream: MediaStream) => {
            this.setRemoteStream(stream);
          });
          this.currentPeer = call;
        })
        .catch((err: any) => {
          // console.log(err);
        });
    });
  }

  startScreenShare() {
    if (this.screenSharing) {
      this.stopScreenSharing();
    }
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream: MediaStream) => {
        this.screenStream = stream;
        const videoTrack = this.screenStream?.getVideoTracks()[0]; // Add a type guard here
        if (videoTrack) {
          videoTrack.onended = () => {
            this.stopScreenSharing();
          };
          if (this.peer) {
            const sender = this.currentPeer?.peerConnection
              .getSenders()
              .find((s: any) => {
                return s.track.kind == videoTrack.kind;
              });
            sender?.replaceTrack(videoTrack); // Add type guards here
            this.screenSharing = true;
          }
          // console.log(this.screenStream);
        }
      });
  }

  stopScreenSharing() {
    if (!this.screenSharing) return;
    const videoTrack = this.local_stream?.getVideoTracks()[0]; // Add a type guard here
    if (videoTrack) {
      if (this.peer) {
        const sender = this.currentPeer?.peerConnection
          .getSenders()
          .find((s: any) => {
            return s.track.kind == videoTrack.kind;
          });
        sender?.replaceTrack(videoTrack); // Add type guards here
      }
      this.screenStream?.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      this.screenSharing = false;
    }
  }

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = this.renderer.createElement("script");
      script.src = scriptUrl;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error: any) => {
        reject(error);
      };
      this.renderer.appendChild(document.body, script);
    });
  }
  // Toggle full-screen for the local video
  toggleFullScreen() {
    const localVideoElement = this.localVideo.nativeElement as HTMLVideoElement;

    if (localVideoElement.requestFullscreen) {
      if (!document.fullscreenElement) {
        localVideoElement.requestFullscreen().catch((err) => {
          // console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }
}
