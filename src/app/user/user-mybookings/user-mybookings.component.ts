import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/rental/rental-booking/services/booking.model';
import { BookingService } from 'src/app/rental/rental-booking/services/booking.service';


@Component({
  selector: 'app-user-mybookings',
  templateUrl: './user-mybookings.component.html',
  styleUrls: ['./user-mybookings.component.scss']
})
export class UserMyBookingsComponent implements OnInit {

  bookings: Booking[] = []
  payments: any[]

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings
      },
      () => {
      }
    )
  }

  deleteBooking(bookingId) {
    this.bookingService.deleteBooking(bookingId).subscribe(
      (deletedBooking) => {
        //this.showSwal('success')
      },
      (err) => { }
    )
  }
}
