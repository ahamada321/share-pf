import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';

import { AuthModule } from './auth/auth.module';
import { LandingComponent } from './landing/landing.component';
import { Page404Component } from './page404/page404.component';
import { TermsOfServiceComponent } from './terms-service/terms-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FAQComponent } from './faq/faq.component';
import { ContactFormComponent } from './contactform/contactform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartnershipComponent } from './partnership/partnership.component';
import { UserguideComponent } from './userguide/userguide.component';
import { UsersVoiceComponent } from './usersvoice/usersvoice.component';
import { ResultsComponent } from './results/results.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    Page404Component,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,
    FAQComponent,
    PartnershipComponent,
    UserguideComponent,
    UsersVoiceComponent,
    ResultsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    NgbModule.forRoot(),
    AuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
