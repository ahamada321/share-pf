import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from "moment"


@Component({
  selector: 'app-rental-manage-bookings',
  templateUrl: './rental-manage-bookings.component.html',
  styleUrls: ['./rental-manage-bookings.component.scss']
})
export class RentalManageBookingsComponent implements OnInit, OnDestroy {
  payments: any[]

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.getPaidPayments()
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getPaidPayments() {
    this.paymentService.getPaidPayments().subscribe(
      (payments: any) => {
        this.payments = payments
      },
      (errorResponse: HttpErrorResponse) => { }
    )
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }
}
