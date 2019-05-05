import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/common/modules/matmodule/matmodule';


import { BookingService } from './services/booking.service';
import { BookingHelperService } from './services/booking.helper.service';
// import { Daterangepicker } from 'ng2-daterangepicker';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';




@NgModule({
    declarations: [

    ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        // Daterangepicker,
        // NgxDaterangepickerMd.forRoot(),
    ],
      providers: [
        BookingService,
        BookingHelperService,
    ],
      bootstrap: []
})
export class RentalDetailBookingModule { }