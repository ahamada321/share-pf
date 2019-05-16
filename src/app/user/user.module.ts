import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserMyBookingsComponent } from './user-mybookings/user-mybookings.component';
import { FormatDatePipe } from '../common/pipes/format-date.pipe';
import { FormatTimePipe } from '../common/pipes/format-time.pipe';




const routes: Routes = [{
    path: 'user',
    component: UserComponent,
    children: [
        { path: 'profile', component: UserProfileComponent },
    // { path: ':rentalId/edit', component: RentalDetailUpdateComponent }
        { path: 'mybookings', component: UserMyBookingsComponent },
        { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
}];

@NgModule({
    declarations: [
        UserComponent,
        UserProfileComponent,
        UserMyBookingsComponent,   
        FormatDatePipe,
        FormatTimePipe,     
      ],
      imports: [
          CommonModule,
          RouterModule.forChild(routes),
          FormsModule,
          ReactiveFormsModule,
          NgbModule,
        ],
      providers: [
        ],
      bootstrap: []
})
export class UserModule { }