import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardempRoutingModule } from './dashboardemp-routing.module';
import { DashboardempComponent } from './dashboardemp.component';
import { PostjobComponent } from './postjob/postjob.component';
import { AlljobsComponent } from './alljobs/alljobs.component';
import { ProfilemepComponent } from './profilemep/profilemep.component';
import { EmpmessageComponent } from './empmessage/empmessage.component';

import { HeaderdashboardempComponent } from './headerdashboardemp/headerdashboardemp.component';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { ApplieduserdetailsComponent } from './applieduserdetails/applieduserdetails.component';
import { GeinfoformComponent } from './geinfoform/geinfoform.component';
import { UpdateempprofileComponent } from './updateempprofile/updateempprofile.component';
import { NotificationempComponent } from './notificationemp/notificationemp.component';
import { VideocallComponent } from './videocall/videocall.component';
import { UpdatejobComponent } from './updatejob/updatejob.component';
import { SetQuestionComponent } from './set-question/set-question.component';
import { DisapprovejobComponent } from './disapprovejob/disapprovejob.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UpdatedisjobComponent } from './updatedisjob/updatedisjob.component';
@NgModule({
  declarations: [
    DashboardempComponent,
    PostjobComponent,
    AlljobsComponent,
    ProfilemepComponent,
    EmpmessageComponent,

    HeaderdashboardempComponent,
     ApplieduserdetailsComponent,
     GeinfoformComponent,
     UpdateempprofileComponent,
     NotificationempComponent,
     VideocallComponent,
     UpdatejobComponent,
     SetQuestionComponent,
     DisapprovejobComponent,
     UpdatedisjobComponent
  ],
  imports: [
    CommonModule,
    DashboardempRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    AngularEditorModule,
    FormsModule
  ]
})
export class DashboardempModule { }
