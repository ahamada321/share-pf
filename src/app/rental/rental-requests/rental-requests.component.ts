import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from '../rental-booking/services/booking.model';
import { BookingService } from '../rental-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';


@Component({
  selector: 'app-rental-requests',
  templateUrl: './rental-requests.component.html',
  styleUrls: ['./rental-requests.component.scss']
})
export class RentalRequestsComponent implements OnInit, OnDestroy {

  bookings: Booking[] = []
  payments: any[]

  constructor(private bookingService: BookingService,
              private paymentService: PaymentService ) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings
      },
      () => { }
    )
    this.getPendingPayments()
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments().subscribe(
      (payments: any) => {
        this.payments = payments
      },
      () => {

      }
    )
  }

  acceptPayment(payment) {
    this.paymentService.acceptPayment(payment).subscribe(
      (json) => {
        // Update frontend UI
        payment.status ='paid'
      },
      (err) => {
      }
    )
  }

  declinePayment(payment) {
    this.paymentService.declinePayment(payment).subscribe(
      (json) => {
        // Update frontend UI
        payment.status ='declined'
      },
      (err) => {
      }
    )
  }
}
