import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { RentalModule } from './rental/rental.module';
import { FullCalendarModule } from '@fullcalendar/angular';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'user-profile',     component: ProfileComponent },
  { path: 'landing',          component: LandingComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot(),
    AuthModule,
    RentalModule,
    FullCalendarModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
