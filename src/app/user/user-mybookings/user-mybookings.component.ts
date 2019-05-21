import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from 'src/app/rental/rental-booking/services/booking.model';
import { BookingService } from 'src/app/rental/rental-booking/services/booking.service';


@Component({
  selector: 'app-user-mybookings',
  templateUrl: './user-mybookings.component.html',
  styleUrls: ['./user-mybookings.component.scss']
})
export class UserMyBookingsComponent implements OnInit, OnDestroy {

  bookings: Booking[] = []
  payments: any[]

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings
      },
      () => {
      }
    )
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
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
