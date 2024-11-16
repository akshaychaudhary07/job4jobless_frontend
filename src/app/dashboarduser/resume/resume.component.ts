

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/auth/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  @ViewChild('resumeCanvas', { static: false }) resumeCanvas: ElementRef<HTMLCanvasElement> | undefined;
  resumeForm!: FormGroup;
  currentStep = 1;
  isSubmitting = false;
  totalSteps: number = 2;

  constructor(private fb: FormBuilder, private http: UserService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      heading: ['', Validators.required],
      skills: ['', Validators.required],
      experience:['', Validators.required],
      education: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.loadFormDataFromLocalStorage();
  }
  editorContent: string = '';
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      console.log("Inside the Next Step")
      if (this.currentStep === 1) {
        const heading = this.resumeForm.get('heading');
        const skills = this.resumeForm.get('skills');
      

        if (heading?.value && skills?.value) {
          console.log("All required fields are valid....");
          // this.formValues = this.myformsubmission.value;
          this.currentStep++;
          this.saveFormDataToLocalStorage();

        } else {
          console.log("One or more required fields are empty.");
        }
      }
      else if (this.currentStep === 2) {
        console.log("I am inside step number 2")
        const experience = this.resumeForm.get('experience');
        const education = this.resumeForm.get('education');
      
        const description = this.resumeForm.get('description');
        if (experience?.value && education?.value && description?.value) {
          console.log("All required fields are valid....");
          this.currentStep++;
          this.saveFormDataToLocalStorage();
        } else {
          console.log("One or more required fields are empty.");
        }
      }
    }
    else {
      // this.submitResume();
      this.saveFormDataToLocalStorage();
      this.currentStep++;
      return;
    }
  }

  prevStep() {
    this.saveFormDataToLocalStorage();
    this.currentStep--;
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    outline: true,
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  submitResume() {
    if (this.resumeForm.valid && !this.isSubmitting) {
      const resumeData = this.resumeForm.value;
      const canvas = this.resumeCanvas?.nativeElement;
      const context = canvas?.getContext('2d');

      if (canvas && context) {
        canvas.width = 800;
        canvas.height = 500;
        context.font = '20px Arial';
        // context.fillText('Name: ' + resumeData.rname, 50, 50);
        // context.fillText('Email: ' + resumeData.rmail, 50, 100);
        // context.fillText('Phone: ' + resumeData.rphone, 50, 150);
        // context.fillText('Experience: ' + resumeData.experience, 50, 200);
        // context.fillText('Skills: ' + resumeData.skills, 50, 250);
        // context.fillText('Project Link: ' + resumeData.projectlink, 50, 300);
        // context.fillText('Description: ' + resumeData.description, 50, 350);

        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.open();
          // pdfWindow.document.write('<html><body>');
          // // pdfWindow.document.write('<img src="' + canvas.toDataURL() + '"/>');
          // // pdfWindow.document.write('<p [innerHTML]="resumeData.description"></p>');
          // pdfWindow.document.write('<div>' + resumeData.description + '</div>');
          // pdfWindow.document.write('</body></html>');
          pdfWindow.document.write('<html><head>');
          pdfWindow.document.write('<style>');
          pdfWindow.document.write(`
            .container {
              width: 100%;
              max-width: 800px; /* Adjust as needed */
              margin: 0 auto;
              padding: 20px;
            }
          
            .flex-container {
              display: flex;
              flex-wrap: wrap;
            }
          
            .col-md-3, .col-md-6 {
              padding: 10px;
              border: 1px solid #ccc; /* Add border for better visibility */
            }
          
            .col-md-3 {
              flex: 0 0 25%; /* Set width of col-md-3 to 25% of the container */
            }
          
            .col-md-6 {
              flex: 0 0 50%; /* Set width of col-md-6 to 50% of the container */
            }
          `);
          pdfWindow.document.write('</style>');
          pdfWindow.document.write('</head><body>');
          
          pdfWindow.document.write('<div class="container">');
          pdfWindow.document.write('<div>');
  
          pdfWindow.document.write('<div>' + resumeData.heading + '</div>');
          pdfWindow.document.write('</div>'); // col-md-12
          
          pdfWindow.document.write('<div class="flex-container">');
          pdfWindow.document.write('<div class="col-md-3">');
          pdfWindow.document.write('<h2>Skills</h2>');
          pdfWindow.document.write('<div>' + resumeData.skills + '</div>');
          pdfWindow.document.write('</div>'); // col-md-3
          
          pdfWindow.document.write('<div class="col-md-6">');
          pdfWindow.document.write('<h2>Education</h2>');
          
          // First Row
          pdfWindow.document.write('<div class="row">');
          pdfWindow.document.write('<div class="col-md-12">');
          pdfWindow.document.write('<div>' + resumeData.education + '</div>');
          pdfWindow.document.write('</div>'); // col-md-12
          pdfWindow.document.write('</div>'); // End of First Row
          pdfWindow.document.write('<h2>Experience</h2>');
          // Second Row
          pdfWindow.document.write('<div class="row">');
          pdfWindow.document.write('<div class="col-md-12">');
          pdfWindow.document.write('<div>' + resumeData.experience + '</div>');
          pdfWindow.document.write('</div>'); // col-md-12
          pdfWindow.document.write('</div>'); // End of Second Row
          
          pdfWindow.document.write('</div>'); // col-md-6
          pdfWindow.document.write('</div>'); // End of flex-container
          
          pdfWindow.document.write('</div>'); // flex-container
       
          pdfWindow.document.write('<div>');
          pdfWindow.document.write('<h2>Description</h2>');
          pdfWindow.document.write('<div>' + resumeData.heading + '</div>');
          pdfWindow.document.write('</div>'); // col-md-12
          pdfWindow.document.write('</div>'); // container
          pdfWindow.document.write('</body></html>');
          pdfWindow.document.close();

          setTimeout(() => {
            pdfWindow.print();
          }, 500);
        } else {
          console.error('Failed to open a new window for the PDF.');
        }
        

        this.isSubmitting = true;
        this.http.resumeinsert(resumeData).subscribe(
          (response) => {
            this.resumeForm.reset();
            localStorage.removeItem('resumeFormData');
          },
          (error) => {
            console.error('Failed to submit data to backend:', error);
            this.isSubmitting = false;
          }
        );
      } else {
        console.error('Canvas or context is not available.');
      }
    }
  }
  stripHtmlTags(htmlString: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.innerText;
  }

  loadFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('resumeFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.resumeForm.patchValue(formData);
    }
  }

  saveFormDataToLocalStorage() {
    localStorage.setItem('resumeFormData', JSON.stringify(this.resumeForm.value));
  }


}


