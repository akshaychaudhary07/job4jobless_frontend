import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-set-question',
  templateUrl: './set-question.component.html',
  styleUrls: ['./set-question.component.css']
})
export class SetQuestionComponent implements OnInit {
  jobid!: string;
  initialJobid!: string;
  questionForm!: FormGroup;
  currentQuestionIndex: number = 0;
  private questionCounter = 0;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private b1:UserService,
    private router:Router,
    private snackBar:MatSnackBar
    // private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobid = params['jobid'];
      this.initialJobid = this.jobid; 
// console.log(this.jobid);
      // Initialize the form with jobid as a hidden field
      this.initializeForm();
    });
  }

  initializeForm(): void {
    // Create the form with validation rules
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      optionA: [null, Validators.required],
      optionB: [null, Validators.required],
      optionC: [null, Validators.required],
      optionD: [null, Validators.required],
      correctAnswer: ['', Validators.required],
      jobid: [this.jobid, Validators.required]
    });
  }
  submitForm(): void {
    if (this.questionForm.valid && this.currentQuestionIndex < 5) {
      const questionData = {
        jobid: this.jobid,
        ...this.questionForm.value
      };
  
      this.b1.addQuestion(this.jobid, questionData).subscribe(
        (response: any) => {
          // console.log('Question added successfully:', response);
  
          this.currentQuestionIndex++;
          this.questionForm.reset({ jobid: this.initialJobid });
  
          if (this.currentQuestionIndex < 5) {
            // If there are more questions, submit the next one
            // this.submitForm();
          } else {
            // console.log('All 5 questions added. Redirecting...');
            this.snackBar.open('Login Successfully.', 'Close', {
              duration: 10000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/dashboardemp/alljobs']);
          }
        },
        (error) => {
          // console.error('Error adding question:', error);
        }
      );
    } else if (this.currentQuestionIndex === 5) {
      // console.log('All 5 questions already added. Redirecting...');
      this.router.navigate(['/dashboardemp/alljobs']);
    } else {
      // console.error('Form is invalid.');
    }
  }
  

  skipQuestion(): void {
    this.router.navigate(['/dashboardemp/alljobs']);
  }
}
