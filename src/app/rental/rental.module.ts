import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../common/modules/matmodule/matmodule';
import { ChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthGuard } from '../auth/service/auth.guard';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { RentalComponent } from './rental.component';
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list/rental-list-item/rental-list-item.component';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';
import { RentalEditComponent } from './rental-edit/rental-edit.component';
import { RentalBookingComponent } from './rental-booking/rental-booking.component';
import { RentalManageComponent } from './rental-manage/rental-manage.component';
import { RentalManageScheduleComponent, TimePickerModal } from './rental-manage/rental-manage-schedule/rental-manage-schedule.component';
import { RentalCreateComponent } from './rental-create/rental-create.component';
import { RentalRequestsComponent } from './rental-requests/rental-requests.component';
import { RentalRevenueComponent } from './rental-revenue/rental-revenue.component';
// import { RentalDetailUpdateComponent } from './rental-detail/rental-detail-update/rental-detail-update.component';
import { BottomNavbarComponent } from '../common/bottom-navbar/bottom-navbar.component';

import { GoogleMapsModule } from '../common/components/googlemaps/googlemaps.module';
import { PaymentModule } from '../common/components/payment/payment.module';
import { ReviewModule } from '../common/components/review/review.module';
import { EditableModule } from '../common/components/editable/editable.module';
import { BookingSelecterModule } from '../common/components/booking-selecter/booking-selecter.module';

import { RentalService } from './service/rental.service';
import { BookingService } from './rental-booking/services/booking.service';
import { BookingHelperService } from './rental-booking/services/booking.helper.service';
import { BarRatingModule } from 'ngx-bar-rating';
// import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';


const routes: Routes = [{
    path: 'rentals',
    component: RentalComponent,
    children: [
        { path: '', component: RentalListComponent },
        { path: 'new', component: RentalCreateComponent, canActivate: [AuthGuard] },
        { path: 'manage', component: RentalManageComponent, canActivate: [AuthGuard] },
        { path: 'requests', component: RentalRequestsComponent, canActivate: [AuthGuard] },
        { path: 'revenue', component: RentalRevenueComponent, canActivate: [AuthGuard] },
        { path: ':rentalId', component: RentalDetailComponent },
        { path: ':rentalId/booking', component: RentalBookingComponent, canActivate: [AuthGuard] },
        { path: ':rentalId/edit', component: RentalEditComponent, canActivate: [AuthGuard] },
        { path: ':rentalId/editschedule', component: RentalManageScheduleComponent, canActivate: [AuthGuard] },
    ]
}];

@NgModule({
    declarations: [
        RentalComponent,
        RentalListComponent,
        RentalListItemComponent,
        RentalDetailComponent,
        RentalBookingComponent,
        RentalManageComponent,
        RentalManageScheduleComponent,
        RentalCreateComponent,
        RentalEditComponent,
        RentalRequestsComponent,
        RentalRevenueComponent,
        // RentalDetailUpdateComponent, // This is replaced from RentalEditComponent.
        BottomNavbarComponent,
        TimePickerModal
      ],
      imports: [
          CommonModule,
          RouterModule.forChild(routes),
          FormsModule,
          ReactiveFormsModule,
          NgbModule,
          MaterialModule,
          EditableModule,
          ChartsModule,
          GoogleMapsModule,
          PaymentModule,
          ReviewModule,
          BarRatingModule,
          BookingSelecterModule,
          // ImageUploadModule
          FullCalendarModule,
          JwBootstrapSwitchNg2Module
        ],
      entryComponents: [TimePickerModal],
      providers: [
          RentalService,
          BookingService,
          BookingHelperService,
        ],
      bootstrap: []
})
export class RentalModule { }