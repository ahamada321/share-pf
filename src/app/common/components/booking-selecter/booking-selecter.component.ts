import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import {NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { RentalService } from 'src/app/rental/service/rental.service';
import { BookingService } from 'src/app/rental/rental-booking/services/booking.service';
import { Rental } from 'src/app/rental/service/rental.model';
import { Booking } from 'src/app/rental/rental-booking/services/booking.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-booking-selecter',
  templateUrl: './booking-selecter.component.html',
  styleUrls: ['./booking-selecter.component.scss']
})
export class BookingSelecterComponent implements OnInit {

  // Date picker params
  selectedDate: NgbDateStruct
  minDate: NgbDateStruct
  maxDate: NgbDateStruct 

  @Input() rental: Rental
  @Input() chosenCourseTime: number
  @Output() newBookingInfo = new EventEmitter()
  @Output() chosenDateTime = new EventEmitter()

  timeTables: any = []

  newBooking: Booking


  constructor(
    private calendar: NgbCalendar,
    private bookingService: BookingService,
    private route: ActivatedRoute,
  ) {
    // Initilize ngbDatepicker
    this.selectedDate = calendar.getToday()
    this.minDate = calendar.getToday()
    this.maxDate = calendar.getNext(calendar.getToday(), 'd', 14 - 1 )
  }

  ngOnInit() {
    this.timeTables = this.initTimeTable()
    this.newBooking = new Booking()

  }

  isPastDateTime(startAt) {
    return moment(startAt).diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
  }

  initTimeTable() {
    let mTimeTables = []
    const mEndAt = moment({ hour:21, minute:0 })
    let mStartAt = moment({ hour:9, minute:0 })

    while(mStartAt < mEndAt) {
        if(!this.isPastDateTime(mStartAt)){
            mTimeTables.push(moment(mStartAt))
        }
        mStartAt.add(30, 'minutes')
    }

    return mTimeTables
}

onDateSelect(event: NgbDateStruct) {
  const selectedMonth = event.month - 1
  const selectedDate = event.day

  let mTimeTables = []
  const mEndAt = moment({ hour:21, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate})
  let mStartAt = moment({ hour:9, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate})

  while(mStartAt < mEndAt) {
      if(!this.isPastDateTime(mStartAt)){
          mTimeTables.push(moment(mStartAt))
      }
      mStartAt.add(30, 'minutes')
  }

  this.timeTables = mTimeTables
  this.chosenDateTime.emit(false)

}

isValidBooking(startAt) {
  let isValid = false
  const rentalBookings = this.rental.bookings

  const reqStart = moment(startAt)
  const reqEnd = moment(startAt).add(this.chosenCourseTime, 'minute').subtract(1, 'minute')

  if(rentalBookings && rentalBookings.length === 0) {
      return true
  } 
  else {
      isValid = rentalBookings.every(function(booking) {
          const existingStart = moment(booking.startAt)
          const existingEnd = moment(booking.endAt)
          // return ((existingStart<reqStart && existingEnd<reqStart) || (reqEnd<existingStart && reqEnd<existingEnd))
          return (existingEnd<reqStart || reqEnd<existingStart) 
        })
    return isValid
    }
  }

  selectDateTime(startAt){
    this.newBooking.startAt = moment(startAt).format()
    this.newBooking.endAt = moment(startAt).add(this.chosenCourseTime, 'minute').subtract(1, 'minute').format()
  
    this.newBooking.courseTime = this.chosenCourseTime
    this.newBooking.totalPrice = this.rental.hourlyPrice * (this.chosenCourseTime / 60)
  
    this.chosenDateTime.emit(true)
  
    this.newBookingInfo.emit(this.newBooking)
  }

    
}
