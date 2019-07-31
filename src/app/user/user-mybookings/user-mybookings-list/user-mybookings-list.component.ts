import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.model';
import { Review } from 'src/app/common/components/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-user-mybookings-list',
  templateUrl: './user-mybookings-list.component.html',
  styleUrls: ['./user-mybookings-list.component.scss']
})
export class UserMyBookingsListComponent implements OnInit {
  @Input() filterFinished: boolean = false
  @Input() bookings: Booking[]
  bookingDeleteIndex: number = undefined

  constructor(private bookingService: BookingService,
              private paymentService: PaymentService,
              public dialogService: MatDialog ) { }

  ngOnInit() {
  }

  reviewHandler(index: number, review: Review) {
    this.bookings[index]['review'] = review // Update Frontend
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }
}
