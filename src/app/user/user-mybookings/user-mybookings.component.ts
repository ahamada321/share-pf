import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from 'src/app/rental/rental-booking/services/booking.model';
import { BookingService } from 'src/app/rental/rental-booking/services/booking.service';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-user-mybookings',
  templateUrl: './user-mybookings.component.html',
  styleUrls: ['./user-mybookings.component.scss']
})
export class UserMyBookingsComponent implements OnInit, OnDestroy {

  bookings: Booking[] = []
  bookingDeleteIndex: number = undefined


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

  isExpired(startAt) {
    return moment(startAt).diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
  }

  deleteBooking(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(
      (deletedBooking) => {
        this.bookings.splice(this.bookingDeleteIndex, 1)
        this.showSwalSuccess()
      },
      (err) => { }
    )
  }

  deleteConfirmation(bookingId: string) {
    Swal.fire({
      title: '予約をキャンセルしますか?',
      text: "担当トレーナー承認前なのでキャンセルが可能です",
      type: 'warning',
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.deleteBooking(bookingId)
      } else if (result.dismiss === Swal.DismissReason.cancel) { }
    })
  }

  showSwalSuccess() {
    Swal.fire({
        title: 'Booking is canseled',
        text: '予約はキャンセルされました。',
        // type: 'success',
        confirmButtonClass: 'btn btn-danger btn-lg',
        buttonsStyling: false
    })
  }
}
