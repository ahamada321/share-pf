import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { UserMyBookingsComponent } from './user-mybookings/user-mybookings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

import { FormatDatePipe } from '../common/pipes/format-date.pipe';
import { FormatTimePipe } from '../common/pipes/format-time.pipe';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';


const routes: Routes = [{
    path: 'user',
    component: UserComponent,
    children: [
        { path: 'settings', component: UserSettingsComponent },
    // { path: ':rentalId/edit', component: RentalDetailUpdateComponent }
        { path: 'mybookings', component: UserMyBookingsComponent },
        { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
}];

@NgModule({
    declarations: [
        UserComponent,
        UserMyBookingsComponent, 
        UserProfileComponent,  
        UserSettingsComponent,
        FormatDatePipe,
        FormatTimePipe,         
      ],
      imports: [
          CommonModule,
          RouterModule.forChild(routes),
          FormsModule,
          ReactiveFormsModule,
          NgbModule,
          JwBootstrapSwitchNg2Module,
          ImageUploadModule
        ],
      providers: [
        ],
      bootstrap: []
})
export class UserModule { }