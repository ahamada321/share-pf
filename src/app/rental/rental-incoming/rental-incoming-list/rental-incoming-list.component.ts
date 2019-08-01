import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../rental-detail/rental-detail-booking/services/booking.service';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import { Booking } from '../../rental-detail/rental-detail-booking/services/booking.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2'
import * as moment from "moment"


@Component({
    selector: 'app-rental-incoming-select-place-dialog',
    templateUrl: './dialog/rental-incoming-select-place-dialog.html',
    styleUrls: ['./dialog/rental-incoming-select-place-dialog.scss']
  
  })
  export class RentalIncomingSelectPlaceDialog implements OnInit {
    @Input() payment: any
    @Input() index: any
  
    dropdownList1 = [
      {"id":1,"itemName":"Aスタジオ"},
      {"id":2,"itemName":"Bスタジオ"}
    ];
    selectedItems1 = [
    ];
    dropdownSettings1 = {
      singleSelection: true,
      text:"予約スタジオを選択",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:""
    };
  
    constructor(private bookingService: BookingService,
                private paymentService: PaymentService,
                private dialogService: MatDialog,
                private dialogRef: MatDialogRef<RentalIncomingSelectPlaceDialog>,
                ) { }
  
    ngOnInit() {
    }
  
    onReProposal() {
      this.dialogRef.close(true);
    }
  
    onBookingReady() {
      let bookingData = this.payment.booking
      bookingData.status = "re-pending"
      // need to add studio info and comment
  
      this.bookingService.updateBooking(bookingData).subscribe(
        (newBookingData: any) => {
          this.acceptPayment()
        },
        (errorResponse: HttpErrorResponse) => {
          // this.errors = errorResponse.error.errors
        }
      )
    }
  
    private acceptPayment() {
      this.paymentService.acceptPayment(this.payment).subscribe(
        (json) => {
          Swal.fire({
            type: 'success',
            title: '予約確定しました！',
            confirmButtonClass: "btn btn-primary btn-lg",
            buttonsStyling: false,
            allowOutsideClick: false,
            timer: 5000
          }).then(() => {
            this.dialogService.closeAll()
          })
        },
        (errorResponse: HttpErrorResponse) => { }
      )
    }
  }
  
  
  @Component({
    selector: 'app-rental-incoming-dialog',
    templateUrl: './dialog/rental-incoming-dialog.html'
  })
  export class RentalIncomingDialog {
    @Input() payment: any
  
    constructor(private bookingService: BookingService,
                private dialogService: MatDialog ) { }
  
    onBookingReady(newBooking: Booking, currentBooking: Booking) {  
      Swal.fire({
        title: '以下の日時で再提案します',
        text: moment(newBooking.startAt).format("YYYY/MM/DD/HH:mm") + '〜' + moment(newBooking.endAt).format("HH:mm") + 'で提案しなおしますか？',
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
          let bookingData = currentBooking
          bookingData.oldStartAt = bookingData.startAt
          bookingData.oldEndAt = bookingData.endAt
          bookingData.startAt = newBooking.startAt
          bookingData.endAt = newBooking.endAt
          bookingData.status = "re-pending"
          if(result.value) {
            bookingData.comment = result.value
          }
          this.bookingService.updateBooking(bookingData).subscribe(
            (updatedBooking: Booking) => {
              this.payment.booking = updatedBooking
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
      })
    }
  }


@Component({
  selector: 'app-rental-incoming-list',
  templateUrl: './rental-incoming-list.component.html',
  styleUrls: ['./rental-incoming-list.component.scss']
})
export class RentalIncomingListComponent implements OnInit {
  @Input() filterExpired: boolean = false
  @Input() payments: any;

  constructor(  private paymentService: PaymentService,
                public dialogService: MatDialog ) { }

  ngOnInit() {
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }

  openSelectPlaceDialog(index, payment) {
    const dialogRef = this.dialogService.open(RentalIncomingSelectPlaceDialog, {autoFocus: false})
    dialogRef.componentInstance.payment = payment
    dialogRef.componentInstance.index = index

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.openDialog(index, payment)
      } else {
        // this.payments.splice(index, 1) // Update frontend UI
        //need to update frontend ui
      }
    })
  }

  openDialog(index, payment) {
    const dialogRef = this.dialogService.open(RentalIncomingDialog)
    dialogRef.componentInstance.payment = payment

    dialogRef.afterClosed().subscribe(result => {
      
    })
  }

  declineConfirmation(index, payment) {
    Swal.fire({
      title: 'お断りしますか？',
      // text: moment(bookingData.startAt).format("YYYY/MM/DD/HH:mm") + '〜' + moment(bookingData.endAt).format("HH:mm") + 'で提案しなおしますか？',
      input: 'textarea',
      inputPlaceholder: '希望に沿えない理由をメッセージで伝えることができます...',
      confirmButtonClass: "btn btn-primary btn-lg",
      cancelButtonClass: "btn btn-gray btn-lg",
      confirmButtonText: 'お断りする',
      // cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((result) => {
      if(!result.dismiss) {
        if(result.value) {
          payment.declineComment = result.value
        }
        Swal.fire({
          type: 'error',
          title: 'お断りしました！',
          confirmButtonClass: "btn btn-primary btn-lg",
          buttonsStyling: false,
          allowOutsideClick: false,
          timer: 5000
        }).then((result) => {
          this.declinePayment(index, payment)
        })
      }
    })
  }

  private declinePayment(index, payment) {
    this.paymentService.declinePayment(payment).subscribe(
      (json) => {
        // this.payments.splice(index, 1) // Update frontend UI
        // need to reflesh frontend ui
      },
      (errorResponse: HttpErrorResponse) => { }
    )
  }
}
