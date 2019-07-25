import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-booking/services/booking.model';
import { Review } from 'src/app/common/components/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-pending-dialog',
  templateUrl: './user-pending-dialog.html'
})
export class UserPendingDialog {
  @Input() booking: Booking

  constructor(private bookingService: BookingService,
              public dialogService: MatDialog ) { }

  onBookingReady(newBooking: Booking) {
    let bookingData = this.booking
    bookingData.oldStartAt = bookingData.startAt
    bookingData.oldEndAt = bookingData.endAt
    bookingData.startAt = newBooking.startAt
    bookingData.endAt = newBooking.endAt
    bookingData.status = "pending"

    Swal.fire({
      title: '以下の日時で再提案します',
      text: moment(bookingData.startAt).format("YYYY/MM/DD/HH:mm") + '〜' + moment(bookingData.endAt).format("HH:mm") + 'で提案しなおしますか？',
      // input: 'textarea',
      // inputPlaceholder: '希望日時に沿えない理由をメッセージで伝えることができます...',
      confirmButtonClass: "btn btn-primary btn-lg",
      cancelButtonClass: "btn btn-gray btn-lg",
      // cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((result) => {
      if(!result.dismiss) {
        // if(result.value) {
        //   bookingData.comment = result.value
        // }
        this.bookingService.updateBooking(bookingData).subscribe(
          (newBookingData: any) => {
            // this.payment.booking = bookingData // ← emitじゃね？
            this.showSwalSuccess()
          },
          (errorResponse) => {
            debugger
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
  selector: 'app-user-pending',
  templateUrl: './user-pending.component.html',
  styleUrls: ['./user-pending.component.scss']
})
export class UserPendingComponent implements OnInit, OnDestroy {
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

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }

  private deleteBooking(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(
      (deletedBooking) => {
        this.bookings.splice(this.bookingDeleteIndex, 1) // Update Frontend
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
      confirmButtonClass: 'btn btn-danger btn-lg',
      cancelButtonClass: 'btn btn-gray btn-lg',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.deleteBooking(bookingId)
      } else if (result.dismiss === Swal.DismissReason.cancel) { }
    })
  }

  showSwalSuccess() {
    Swal.fire({
        title: '予約キャンセルされました',
        text: '担当トレーナー承認前なのでご登録クレジットカードに請求はされません。トレーナーにご迷惑にならぬよう予約後のキャンセルはできる限りしないようお願いいたします。',
        type: 'error',
        confirmButtonClass: 'btn btn-danger btn-lg',
        buttonsStyling: false,
        allowOutsideClick: false
    })
  }

  acceptPayment(payment) {
    const body = {
      _id: payment
    }
    this.paymentService.acceptPayment(body).subscribe(
      (json) => {
        this.getUserBookings()
      },
      (errorResponse) => { }
    )
  }

  openDialog(booking) {
    const dialogRef = this.dialogService.open(UserPendingDialog)
    dialogRef.componentInstance.booking = booking
    dialogRef.afterClosed().subscribe(result => {
      this.getUserBookings()
    })
  }
}
