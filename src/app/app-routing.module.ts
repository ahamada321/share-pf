import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { RentalModule } from './rental/rental.module';
import { UserModule } from './user/user.module';
import { PresentationModule } from './presentation/presentation.module';
import { PresentationComponent } from './presentation/presentation.component';
import { Page404Component } from './page404/page404.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'landing',          component: LandingComponent },
  { path: 'presentation',         component: PresentationComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: Page404Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot(),
    AuthModule,
    RentalModule,
    UserModule,
    PresentationModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
