import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { RentalModule } from './rental/rental.module';
import { UserModule } from './user/user.module';
import { PresentationModule } from './presentation/presentation.module';
import { HomeModule } from './home/home.module';
import { PresentationComponent } from './presentation/presentation.component';
import { Page404Component } from './page404/page404.component';
import { TermsOfServiceComponent } from './terms-service/terms-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FAQComponent } from './faq/faq.component';
import { ContactFormComponent } from './contactform/contactform.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'landing',          component: LandingComponent },
  { path: 'presentation',         component: PresentationComponent },
  { path: 'terms',         component: TermsOfServiceComponent },
  { path: 'privacy',         component: PrivacyPolicyComponent },
  { path: 'faq',         component: FAQComponent },
  { path: 'contactform',         component: ContactFormComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: Page404Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot(),
    HomeModule,
    RentalModule,
    UserModule,
    PresentationModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
