import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Booking } from '../rental-booking/services/booking.model';
import { BookingService } from '../rental-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import * as moment from "moment"


@Component({
  selector: 'app-rental-incoming-dialog',
  templateUrl: './rental-incoming-dialog.html'
})
export class RentalIncomingDialog {
  @Input() payment: any

  constructor(private bookingService: BookingService,
              private dialogService: MatDialog ) { }

  onBookingReady(newBooking: Booking) {
    let bookingData = this.payment.booking
    bookingData.oldStartAt = bookingData.startAt
    bookingData.oldEndAt = bookingData.endAt
    bookingData.startAt = newBooking.startAt
    bookingData.endAt = newBooking.endAt
    bookingData.status = "re-pending"

    Swal.fire({
      title: '以下の日時で再提案します',
      text: moment(bookingData.startAt).format("YYYY/MM/DD/HH:mm") + '〜' + moment(bookingData.endAt).format("HH:mm") + 'で提案しなおしますか？',
      input: 'textarea',
      inputPlaceholder: '希望日時に沿えない理由をメッセージで伝えることができます...',
      confirmButtonClass: "btn btn-primary btn-lg",
      cancelButtonClass: "btn btn-gray btn-lg",
      // cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((result) => {
      if(!result.dismiss) {
        if(result.value) {
          bookingData.comment = result.value
        }
        this.bookingService.updateBooking(bookingData).subscribe(
          (newBookingData: any) => {
            this.showSwalSuccess()
          },
          (errorResponse: HttpErrorResponse) => {
            // this.errors = errorResponse.error.errors
          }
        )
      }
    })
  }

  showSwalSuccess() {
    Swal.fire({
      type: 'success',
      title: '予約日時を再提案しました！',
      confirmButtonClass: "btn btn-primary btn-lg",
      buttonsStyling: false,
      allowOutsideClick: false,
      timer: 5000
    }).then((result) => {
      this.dialogService.closeAll()
    // this.router.navigate(['/login'])
    })
  }
}


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

  acceptPayment(index, payment) {
    this.paymentService.acceptPayment(payment).subscribe(
      (json) => {
        this.payments.splice(index, 1) // Update frontend UI
      },
      (errorResponse: HttpErrorResponse) => { }
    )
  }

  declinePayment(index, payment) {
    this.paymentService.declinePayment(payment).subscribe(
      (json) => {
        this.payments.splice(index, 1) // Update frontend UI
      },
      (errorResponse: HttpErrorResponse) => { }
    )
  }

  openDialog(payment) {
    const dialogRef = this.dialogService.open(RentalIncomingDialog)
    dialogRef.componentInstance.payment = payment

    dialogRef.afterClosed().subscribe(result => {
      this.getPendingPayments()
    })
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }
}
