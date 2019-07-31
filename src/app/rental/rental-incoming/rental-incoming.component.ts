import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from "moment"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-rental-incoming',
  templateUrl: './rental-incoming.component.html',
  styleUrls: ['./rental-incoming.component.scss']
})
export class RentalIncomingComponent implements OnInit, OnDestroy {
  payments: any[]

  constructor(
    private paymentService: PaymentService,
    public dialogService: MatDialog ) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

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
      (errorResponse: HttpErrorResponse) => { }
    )
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }
}
