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
import { LandingComponent } from './static-page/landing/landing.component';
import { Page404Component } from './static-page/page404/page404.component';
import { TermsOfServiceComponent } from './static-page/terms-service/terms-service.component';
import { PrivacyPolicyComponent } from './static-page/privacy-policy/privacy-policy.component';
import { FAQComponent } from './static-page/faq/faq.component';
import { PartnershipComponent } from './static-page/partnership/partnership.component';
import { UserguideComponent } from './static-page/userguide/userguide.component';
import { UsersVoiceComponent } from './static-page/usersvoice/usersvoice.component';
import { ResultsComponent } from './static-page/results/results.component';
import { AboutUsComponent } from './static-page/aboutus/aboutus.component';


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
    ResultsComponent,
    AboutUsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
