import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
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
  timeTables: any = []
  newBooking: Booking
  isDateBlock_flg: boolean = false

  // Date picker params
  selectedDate: NgbDateStruct
  minDate: NgbDateStruct
  maxDate: NgbDateStruct 

  @Input() rental: Rental
  @Input() chosenCourseTime: number
  @Output() newBookingInfo = new EventEmitter()
  @Output() chosenDateTime = new EventEmitter()

  constructor(
    private calendar: NgbCalendar,
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {
    // Initilize ngbDatepicker
    this.selectedDate = calendar.getToday()
    this.minDate = calendar.getToday()
    this.maxDate = calendar.getNext(calendar.getToday(), 'd', 14 - 1 )
  }

  ngOnInit() {
    this.onDateSelect(this.selectedDate)
    this.newBooking = new Booking()

  }

  onDateSelect(date: NgbDateStruct) {
    this.isDateBlock_flg = false
    this.iskDateBlock(date)
    const d = new Date(date.year, date.month -1, date.day)
    const selectedDay = d.getDay()

    let mTimeTables = []
    let mEndAt = null
    let mStartAt = null

    if(selectedDay==0 && this.rental.businesshour_enabled_sun) { // Sunday
      mEndAt = moment(this.rental.businesshour_endTime_sun).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_sun).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==1 && this.rental.businesshour_enabled_mon) { // Monday
      mEndAt = moment(this.rental.businesshour_endTime_mon).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_mon).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==2 && this.rental.businesshour_enabled_tue) {
      mEndAt = moment(this.rental.businesshour_endTime_tue).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_tue).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==3 && this.rental.businesshour_enabled_wed) {
      mEndAt = moment(this.rental.businesshour_endTime_wed).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_wed).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==4 && this.rental.businesshour_enabled_thu) {
      mEndAt = moment(this.rental.businesshour_endTime_thu).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_thu).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==5 && this.rental.businesshour_enabled_fri) {
      mEndAt = moment(this.rental.businesshour_endTime_fri).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_fri).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }
    if(selectedDay==6 && this.rental.businesshour_enabled_sat) {
      mEndAt = moment(this.rental.businesshour_endTime_sat).set({'year': date.year, 'month': date.month -1, 'date': date.day})
      mStartAt = moment(this.rental.businesshour_startTime_sat).set({'year': date.year, 'month': date.month -1, 'date': date.day})
    }

    while(mStartAt < mEndAt) {
        if(!this.isPastDateTime(mStartAt)){
            mTimeTables.push(moment(mStartAt))
        }
        mStartAt.add(30, 'minutes')
    }
    this.timeTables = mTimeTables
    this.chosenDateTime.emit(false)
  }

  private isPastDateTime(startAt) {
    return moment(startAt).diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
  }

  iskDateBlock (selectedDate: NgbDateStruct) {
    const selected_date = moment(selectedDate).subtract(1, 'month').format('YYYY-MM-DD') // Subtract 1 month to adapt NgbDateStruct to moment()

    for(let booking of this.rental.bookings) {
      if(booking.status === 'block') {
        if(selected_date === moment(booking.startAt).format('YYYY-MM-DD')) {
          this.isDateBlock_flg = true
        }
      }
    }
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
        isValid = rentalBookings.every((booking) => {
          const existingStart = moment(booking.startAt)
          const existingEnd = moment(booking.endAt)
          // return ((existingStart<reqStart && existingEnd<reqStart) || (reqEnd<existingStart && reqEnd<existingEnd))
          return (existingEnd<reqStart || reqEnd<existingStart) 
        })
      return isValid
    }
  }

  selectDateTime(startAt) {
    this.newBooking.startAt = moment(startAt).format()
    this.newBooking.endAt = moment(startAt).add(this.chosenCourseTime, 'minute').subtract(1, 'minute').format()
  
    this.newBooking.courseTime = this.chosenCourseTime
    this.newBooking.totalPrice = this.rental.hourlyPrice * (this.chosenCourseTime / 60)
  
    this.chosenDateTime.emit(true)
    this.newBookingInfo.emit(this.newBooking)
  }

}
