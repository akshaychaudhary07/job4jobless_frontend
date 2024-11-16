import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindjobComponent } from './findjob/findjob.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployerModule } from './employer/employer.module';
import { CheckotpComponent } from './checkotp/checkotp.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { CheckotpuserComponent } from './checkotpuser/checkotpuser.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { Job4joblesspComponent } from './job4joblessp/job4joblessp.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { authGuard } from './auth.guard';
import { FinjobpageComponent } from './finjobpage/finjobpage.component';
import { FindjobuComponent } from './dashboarduser/findjobu/findjobu.component';
import { PolicypageComponent } from './policypage/policypage.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { BloglistComponent } from './bloglist/bloglist.component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { PostblogComponent } from './postblog/postblog.component';
import { TrendingblogsComponent } from './trendingblogs/trendingblogs.component';
import { CreateblogComponent } from './createblog/createblog.component';
import { ForgetblogpassComponent } from './forgetblogpass/forgetblogpass.component';
import { SubscriptionComponent } from './subscriptionUser/subscription.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CompaniesComponent } from './companies/companies.component';
const routes: Routes = [
  // {
  //   path: '', component: FindjobComponent
  // },
  {
    path: '', component: HomePageComponent
  },
  {
    path: 'findjobs', component: FindjobComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'about-us', component: AboutComponent
  },
  {
    path: 'companies', component: CompaniesComponent
  },

  { path: 'findjobpage', component: FinjobpageComponent , pathMatch: 'full' },
  {
    path: 'contact-us', component: ContactComponent
  },
  {
    path: 'checkotp/:uid', component: CheckotpComponent
  },
  {
    path:'subscription', component:SubscriptionComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path:'terms' , component:TermsComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'resetpass', component: ResetpassComponent
  },
  {
    path: 'blogs', component: BlogsComponent
  },
  {
    path: 'checkotpuser/:uid', component: CheckotpuserComponent
  },
  {
    path: 'resetpassword', component: ResetpasswordComponent
  },
  {
    path: 'blog/:id', component: BlogComponent
  },
  {
    path: 'bloglist', component: BloglistComponent
  },
  {
    path: 'trendingblogs', component: TrendingblogsComponent
  },
  {
    path: 'forgetblogpassword', component: ForgetblogpassComponent
  },
  {
    path: 'blog-cards', component: BlogCardComponent
  },
  {
    path: 'postblog/:token', component: PostblogComponent
  },
  {
    path: 'createblog', component: CreateblogComponent
  },
  {
    path: 'employer',
    loadChildren: () => import('./employer/employer.module').then(m => m.EmployerModule)
  },
  {
    path: 'dashboarduser',
    loadChildren: () => import('./dashboarduser/dashboarduser.module').then(m => m.DashboarduserModule),
    canActivate: [authGuard]
  },
  {
    path:'privacy-policy' , component:PrivacypolicyComponent
  },
  {
    path: 'dashboardemp',
    loadChildren: () => import('./dashboardemp/dashboardemp.module').then(m => m.DashboardempModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard]
  },
  {
    path:'adminlogin' , component:AdminloginComponent
  },
  {
    path: '**', // This route will match any URL
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
