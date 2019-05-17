import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Booking } from '../services/booking.model'
import { Rental } from 'src/app/rental/service/rental.model';

import { AuthService } from 'src/app/auth/service/auth.service';
import { BookingService } from '../services/booking.service';
import { BookingHelperService } from '../services/booking.helper.service';
import * as moment from 'moment-timezone'
import Swal from 'sweetalert2'


@Component({
  // warning: few browsers support shadow DOM encapsulation at this time
  encapsulation: ViewEncapsulation.None,

  selector: 'app-booking-with-time',
  templateUrl: './booking-with-time.component.html',
  styleUrls: ['./booking-with-time.component.scss']
})
export class BookingWithTimeComponent implements OnInit {

  @Input() rental: Rental

  user: any
  today: string = moment().tz("Asia/Tokyo").format("YYYY-MM-DD")
  newBooking: Booking
  modalRef: any
  daterange: any = {}
  selected: any = {}
  bookedOutDateTimes: any[] = []
  errors: any[] = []

  isAutoBooking: boolean = false

  sgMail: any
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  options: any = {
      locale: { format: Booking.DATE_FORMAT },
      alwaysShowCalendars: false,
      //isInvalidDate: ,
      opens: 'left'
  };

  locale: any = {
    applyLabel: 'ok', 
    format: Booking.DATE_FORMAT 
  };


  constructor(private helper: BookingHelperService, 
              private modalService: NgbModal, 
              private bookingService: BookingService,
              public auth: AuthService) { }

  ngOnInit() {
    this.newBooking = new Booking()
    this.getUser()
  }

  private addNewBookedDateTimes(bookingData: any) { // Update UI of frontend.
    this.rental.bookings.push(bookingData)
  }

  getUser() {
    const userId = this.auth.getUserId()
    this.auth.getUserById(userId).subscribe(
      (user) => {
        this.user = user
        this.isAllowAutoBooking()
      },
      (err) => { }
    )
  }

  isAllowAutoBooking() {
    this.isAutoBooking = this.user.isAutoBooking
  }

  // This envoke from daterange picker.
  selectedDate(value: any, datepicker?: any) {

    // any object can be passed to the selected event and it will be passed back here
    this.newBooking.startAt = this.helper.formatBookingDate(value.start)
    this.newBooking.endAt = this.helper.formatBookingDate(value.end)
    this.newBooking.days = -(value.start.diff(value.end, 'days'))
    this.newBooking.totalPrice = this.newBooking.days * this.rental.hourlyPrice

    // or manupulat your own internal property
    // this.daterange.start = value.start;
    // this.daterange.end = value.end;
    // this.daterange.label = value.label;
  }

  onPaymentConfirmed(paymentToken: any) {
    this.newBooking.paymentToken = paymentToken
  }

  createBooking() {
    this.newBooking.rental = this.rental
    this.bookingService.createBooking(this.newBooking).subscribe(
      (newBooking: any) => {
        this.addNewBookedDateTimes(newBooking) // Update front UI
        this.modalRef.close()
        this.showSwal('success')
        this.newBooking = new Booking()
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
        
      }
    )
  }

  selectDateTime(startAt, endAt){
    this.newBooking.startAt = moment(startAt, "HH").tz("Asia/Tokyo").format()
    this.newBooking.endAt = moment(endAt, "HH").subtract(1, 'seconds').tz("Asia/Tokyo").format()

    this.newBooking.totalPrice = 1000 // Fix me!
    //this.newBooking.days = -(startAt.diff(endAt, 'hours'))
    //this.newBooking.totalPrice = this.newBooking.days * this.rental.hourlyPrice
  }

  isValidBooking(startAt, endAt) {
    let isValid = false
    const rentalBookings = this.rental.bookings

    const reqStart = moment(startAt, "HH").tz("Asia/Tokyo")
    const reqEnd = moment(endAt, "HH").subtract(1, 'seconds').tz("Asia/Tokyo")

    const isPastDateTime = reqStart.diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
    if(isPastDateTime) {
      return false
    }
    if(rentalBookings && rentalBookings.length == 0) {
      return true
    } 
    else {
        isValid = rentalBookings.every(function(booking) {
          const acturalStart = moment(booking.startAt)
          const acturalEnd = moment(booking.endAt)

          return ((acturalStart<reqStart && acturalEnd<reqStart) || (reqEnd<acturalStart && reqEnd<acturalEnd))

        })
      return isValid
    }
  }

  openConfirmModal(content) {
    this.errors = []
    this.modalRef = this.modalService.open(content)
  }

  showSwal(type) {
    if (type == 'success') {
      Swal.fire({
            position: 'top-end',
            title: '予約申込完了！',
            text: '商品オーナーからのお返事をお待ちください',
            type: 'success',
            showConfirmButton: false,
            timer: 5000
        })
    }
  }
}
