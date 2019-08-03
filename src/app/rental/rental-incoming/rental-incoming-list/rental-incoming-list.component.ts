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

  onItemSelect(item:any){
    // console.log(item);
    // console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any){
      // console.log(items);
  }
  onDeSelectAll(items: any){
      // console.log(items);
  }

  onReProposal() {
    this.dialogRef.close(true)
  }

  onBookingReady() {
    let bookingData = this.payment.booking
    bookingData.status = "re-pending"
    // need to add studio info and comment

    this.bookingService.updateBooking(bookingData).subscribe(
      (updatedBooking) => {
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
          this.dialogRef.close()
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
              private dialogRef: MatDialogRef<RentalIncomingDialog>,
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
          (updatedBooking) => {
            this.showSwalSuccess()
          },
          (errorResponse: HttpErrorResponse) => {
            // this.errors = errorResponse.error.errors
          }
        )
      }
    })
  }

  private showSwalSuccess() {
    Swal.fire({
      type: 'success',
      title: '予約日時を再提案しました！',
      confirmButtonClass: "btn btn-primary btn-lg",
      buttonsStyling: false,
      allowOutsideClick: false,
      timer: 5000
    }).then((result) => {
      this.dialogRef.close()
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
                private dialogService: MatDialog ) { }

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

    dialogRef.afterClosed().subscribe((isReproposal) => {
      if(isReproposal) { this.openDialog(index, payment) }
    })
  }

  openDialog(index, payment) {
    const dialogRef = this.dialogService.open(RentalIncomingDialog)
    dialogRef.componentInstance.payment = payment
    dialogRef.afterClosed().subscribe(result => {
      this.getPendingPayments() // Update frontend UI.
    })
  }

  private getPendingPayments() {
    this.paymentService.getPendingPayments().subscribe(
      (payments: any) => {
        this.payments = payments
      },
      (errorResponse: HttpErrorResponse) => { }
    )
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
        this.payments.splice(index, 1) // Update frontend UI
      },
      (errorResponse: HttpErrorResponse) => { }
    )
  }
}
