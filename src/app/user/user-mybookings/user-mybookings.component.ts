import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.model';
import { Review } from 'src/app/common/components/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-user-mybookings',
  templateUrl: './user-mybookings.component.html',
  styleUrls: ['./user-mybookings.component.scss']
})
export class UserMyBookingsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = []
  bookingDeleteIndex: number = undefined

  constructor(private bookingService: BookingService,
              private paymentService: PaymentService,
              public dialogService: MatDialog ) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.getUserBookings()
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getUserBookings() {
    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings
      },
      () => { }
    )
  }

  reviewHandler(index: number, review: Review) {
    this.bookings[index]['review'] = review // Update Frontend
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }

}
