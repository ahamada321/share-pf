import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AuthModule } from './auth/auth.module';
import { RentalModule } from './rental/rental.module';
import { UserModule } from './user/user.module';

import { PresentationModule } from './static-page/presentation/presentation.module';
import { HomeModule } from './static-page/home/home.module';
import { HomeComponent } from './static-page/home/home.component';
import { LandingComponent } from './static-page/landing/landing.component';
import { PresentationComponent } from './static-page/presentation/presentation.component';
import { Page404Component } from './static-page/page404/page404.component';
import { TermsOfServiceComponent } from './static-page/terms-service/terms-service.component';
import { PrivacyPolicyComponent } from './static-page/privacy-policy/privacy-policy.component';
import { FAQComponent } from './static-page/faq/faq.component';
import { PartnershipComponent } from './static-page/partnership/partnership.component';
import { UserguideComponent } from './static-page/userguide/userguide.component';
import { UsersVoiceComponent } from './static-page/usersvoice/usersvoice.component';
import { ResultsComponent } from './static-page/results/results.component';
import { AboutUsComponent } from './static-page/aboutus/aboutus.component';
import { ContactformModule } from './form/contactform.module';
import { ContactFormComponent } from './form/contactform/contactform.component';
import { TrialFormComponent } from './form/trialform/trialform.component';


const routes: Routes = [
  { path: 'home',         component: HomeComponent },
  { path: 'landing',      component: LandingComponent },
  // { path: 'presentation', component: PresentationComponent },
  { path: 'terms',        component: TermsOfServiceComponent },
  { path: 'privacy',      component: PrivacyPolicyComponent },
  { path: 'faq',          component: FAQComponent },
  { path: 'contactform',  component: ContactFormComponent },
  { path: 'trialform',  component: TrialFormComponent },
  // { path: 'partnership',  component: PartnershipComponent },
  { path: 'partnership',  component: PresentationComponent },
  { path: 'userguide',  component: UserguideComponent },
  { path: 'usersvoice',  component: UsersVoiceComponent },
  { path: 'results',  component: ResultsComponent },
  { path: 'aboutus',  component: AboutUsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: "btn btn-danger btn-round btn-lg",
      cancelButtonClass: "btn btn-gray btn-lg",
    }),
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    HomeModule,
    RentalModule,
    UserModule,
    PresentationModule,
    ContactformModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
