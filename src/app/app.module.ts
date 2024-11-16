import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FindjobComponent } from './findjob/findjob.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceComponent } from './service/service.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {CookieService} from 'ngx-cookie-service'
import { environment } from 'src/environments/environment';
import { UpdateProfilePopupComponent } from './update-profile-popup/update-profile-popup.component';
import { CheckotpComponent } from './checkotp/checkotp.component';
import { OtpexpiredComponent } from './otpexpired/otpexpired.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { CheckotpuserComponent } from './checkotpuser/checkotpuser.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { Job4joblesspComponent } from './job4joblessp/job4joblessp.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { FinjobpageComponent } from './finjobpage/finjobpage.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { MessagingService } from './firebase/messaging.service';
import { CoresearchComponent } from './coresearch/coresearch.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { SearchfiltersComponent } from './searchfilters/searchfilters.component';
import { HeadlineComponent } from './headline/headline.component';
import { FloatingbannerComponent } from './floatingbanner/floatingbanner.component';
import { JobcardsComponent } from './jobcards/jobcards.component';
import { MobileappComponent } from './mobileapp/mobileapp.component';
import { PolicypageComponent } from './policypage/policypage.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { BloglistComponent } from './bloglist/bloglist.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IonicModule } from '@ionic/angular';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { PostblogComponent } from './postblog/postblog.component';
import { TrendingblogsComponent } from './trendingblogs/trendingblogs.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CreateblogComponent } from './createblog/createblog.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ForgetblogpassComponent } from './forgetblogpass/forgetblogpass.component';
import { SubscriptionComponent } from './subscriptionUser/subscription.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MatIconModule } from '@angular/material/icon';
import { CompaniesComponent } from './companies/companies.component';
import { TestimonialSliderComponent } from './testimonial-slider/testimonial-slider.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FindjobComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ServiceComponent,
    LoginComponent,
    RegisterComponent,
    UpdateProfilePopupComponent,
    CheckotpComponent,
    OtpexpiredComponent,
    ResetpassComponent,
    CheckotpuserComponent,
    ResetpasswordComponent,
    Job4joblesspComponent,
    PagenotfoundComponent,
    FinjobpageComponent,
    CoresearchComponent,
    SearchboxComponent,
    SearchfiltersComponent,
    HeadlineComponent,
    FloatingbannerComponent,
    JobcardsComponent,
    MobileappComponent,
    PolicypageComponent,
    TermsComponent,
    PrivacypolicyComponent,
    AdminloginComponent,
    BlogsComponent,
    BlogComponent,
    BloglistComponent,
    BlogCardComponent,
    PostblogComponent,
    TrendingblogsComponent,
    CreateblogComponent,
    ForgetblogpassComponent,
    SubscriptionComponent,
    HomePageComponent,
    CompaniesComponent,
    TestimonialSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    IonicModule,
    MatSidenavModule,
    AngularEditorModule,
    MatIconModule,
SlickCarouselModule,
    ToastrModule.forRoot()
    // NgbModule
  ],
  providers: [CookieService,MessagingService,{
    provide:HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent],
  
})

export class AppModule { }
