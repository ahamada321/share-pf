import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MaterialModule } from '../common/modules/matmodule/matmodule';
import { ChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthGuard } from '../auth/service/auth.guard';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { BarRatingModule } from 'ngx-bar-rating';

import { RentalComponent } from './rental.component';
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list/rental-list-item/rental-list-item.component';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';
import { RentalEditComponent } from './rental-edit/rental-edit.component';
import { RentalBookingComponent } from './rental-detail/rental-detail-booking/rental-booking.component';
import { RentalManageComponent } from './rental-manage/rental-manage.component';
import { RentalManageScheduleComponent, TimePickerModal } from './rental-manage/rental-manage-schedule/rental-manage-schedule.component';

import { RentalIncomingComponent } from './rental-incoming/rental-incoming.component';
import { RentalIncomingListComponent, RentalIncomingDialog, RentalIncomingSelectPlaceDialog } from './rental-incoming/rental-incoming-list/rental-incoming-list.component';
import { RentalBookingsComponent } from './rental-bookings/rental-bookings.component';
import { RentalBookingsListComponent } from './rental-bookings/rental-bookings-list/rental-bookings-list.component';

import { RentalNewComponent } from './rental-new/rental-new.component';
import { RentalRevenueComponent } from './rental-revenue/rental-revenue.component';
// import { RentalDetailUpdateComponent } from './rental-detail/rental-detail-update/rental-detail-update.component';
import { BottomNavbarComponent } from '../common/bottom-navbar/bottom-navbar.component';
import { GoogleMapsModule } from '../common/components/googlemaps/googlemaps.module';
import { PaymentModule } from '../common/components/payment/payment.module';
import { ReviewModule } from '../common/components/review/review.module';
import { EditableModule } from '../common/components/editable/editable.module';
import { BookingSelecterModule } from '../common/components/booking-selecter/booking-selecter.module';

import { RentalService } from './service/rental.service';
import { BookingService } from './rental-detail/rental-detail-booking/services/booking.service';
import { BookingHelperService } from './rental-detail/rental-detail-booking/services/booking.helper.service';
// import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';


const routes: Routes = [{
    path: 'rentals',
    component: RentalComponent,
    children: [
        { path: '', component: RentalListComponent },
        { path: 'new', component: RentalNewComponent, canActivate: [AuthGuard] },
        { path: 'manage', component: RentalManageComponent, canActivate: [AuthGuard] },
        { path: 'manage/incoming', component: RentalIncomingComponent, canActivate: [AuthGuard] }, // OEM mode
        { path: 'manage/bookings', component: RentalBookingsComponent, canActivate: [AuthGuard] }, // OEM mode
        { path: 'revenue', component: RentalRevenueComponent, canActivate: [AuthGuard] },
        { path: ':rentalId', component: RentalDetailComponent },
        { path: ':rentalId/booking', component: RentalBookingComponent, canActivate: [AuthGuard] }, // Going to replace to "createbooking"
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
        RentalIncomingComponent,
        RentalIncomingListComponent,
        RentalIncomingDialog,
        RentalIncomingSelectPlaceDialog,
        RentalManageComponent,
        RentalBookingsComponent,
        RentalBookingsListComponent,
        RentalManageScheduleComponent,
        RentalNewComponent,
        RentalEditComponent,
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
          AngularMultiSelectModule,
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
      entryComponents: [
        RentalIncomingDialog,
        RentalIncomingSelectPlaceDialog,
        TimePickerModal
      ],
      providers: [
          RentalService,
          BookingService,
          BookingHelperService,
      ],
      bootstrap: []
})
export class RentalModule { }