import { Component, OnInit, ViewChild } from '@angular/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment-timezone';
import { RentalService } from '../../service/rental.service';
import { BookingHelperService } from './services/booking.helper.service';
import { BookingService } from './services/booking.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { Rental } from '../../service/rental.model';
import { Booking } from './services/booking.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import {NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
    @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
    timeTables: any = []
    courseSelected: boolean = false

    // Date picker params
    selectedDate: NgbDateStruct
    minDate: NgbDateStruct
    maxDate: NgbDateStruct 

    defaultCourseTime = new FormControl('30')
    selectedCourseTime: number = 30


    rental: Rental
    newBooking: Booking

    errors: any[] = []


    calendarPlugins = [timeGridPlugin]; // important!


    constructor(
        private formBuilder: FormBuilder,
        private rentalService: RentalService,
        private helper: BookingHelperService,
        private bookingService: BookingService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private calendar: NgbCalendar
         ) {
            this.selectedDate = calendar.getToday()
            this.minDate = calendar.getToday()
            this.maxDate = calendar.getNext(calendar.getToday(), 'd', 14 - 1 )
         }

    ngOnInit() {
        this.initDateTables()
        this.newBooking = new Booking()
        // this.isAllowAutoBooking()
        this.route.params.subscribe(
            (params) => {
              this.getRental(params['rentalId'])
            })
    }

    initDateTables() {
        this.timeTables = [
            moment({ hour:9, minute:0 }),
            moment({ hour:9, minute:30 }),
            moment({ hour:10, minute:0 }),
            moment({ hour:10, minute:30 }),
            moment({ hour:11, minute:0 }),
            moment({ hour:11, minute:30 }),
            moment({ hour:12, minute:0 }),
            moment({ hour:12, minute:30 }),
            moment({ hour:13, minute:0 }),
            moment({ hour:13, minute:30 }),
            moment({ hour:14, minute:0 }),
            moment({ hour:14, minute:30 }),
            moment({ hour:15, minute:0 }),
            moment({ hour:15, minute:30 }),
            moment({ hour:16, minute:0 }),
            moment({ hour:16, minute:30 }),
            moment({ hour:17, minute:0 }),
            moment({ hour:17, minute:30 }),
            moment({ hour:18, minute:0 }),
            moment({ hour:18, minute:30 }),
            moment({ hour:19, minute:0 }),
            moment({ hour:19, minute:30 }),
            moment({ hour:20, minute:0 }),
            moment({ hour:20, minute:30 }),
        ]
    }

    getRental(rentalId: string) {
        this.rentalService.getRentalById(rentalId).subscribe(
            (rental: Rental) => {
                this.rental = rental
            }
        )
    }

    onDateSelect(event: NgbDateStruct) {
        const selectedMonth = event.month - 1
        const selectedDate = event.day

        this.timeTables = [
            moment({ hour:9, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:9, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:10, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:10, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:11, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:11, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:12, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:12, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:13, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:13, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:14, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:14, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:15, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:15, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:16, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:16, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:17, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:17, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:18, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:18, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:19, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:19, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:20, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate}),
            moment({ hour:20, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate}),
        ]

        this.courseSelected = false
    }

    courseChanged(event) {
        this.courseSelected = false
    }

    calEndtime(startAt, courseTime: number) {
        return moment(startAt).add(courseTime, 'minute')
    }

    selectDateTime(startAt, endAt, selectedCourseTime){
        // this.newBooking.startAt = moment(startAt, "HH").tz("Asia/Tokyo").format()
        // this.newBooking.endAt = moment(endAt, "HH").subtract(1, 'seconds').tz("Asia/Tokyo").format()
        this.newBooking.startAt = startAt.format()
        this.newBooking.endAt = endAt.subtract(1, 'seconds').format()

        this.newBooking.courseTime = selectedCourseTime
        this.newBooking.totalPrice = this.rental.hourlyPrice * (selectedCourseTime / 60)

        //this.newBooking.totalPrice = this.newBooking.days * this.rental.hourlyPrice

        // Toggle to next tab
        // $('#wizardProfile a[href="#account"]').tab('show'); // Due to merge paper-kit

        this.courseSelected = true
    }

    isValidBooking(startAt, endAt) {
        let isValid = false
        const rentalBookings = this.rental.bookings

        const reqStart = moment(startAt)
        const reqEnd = moment(endAt).subtract(1, 'seconds')

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

    onPaymentConfirmed(paymentToken: any) {
        this.newBooking.paymentToken = paymentToken
    }

    createBooking() {
        this.newBooking.rental = this.rental
        this.bookingService.createBooking(this.newBooking).subscribe(
          (newBooking: any) => {
            this.addNewBookedDateTimes(newBooking) // Update front UI
            this.newBooking = new Booking()
            this.showSwalSuccess()
          },
          (errorResponse: HttpErrorResponse) => {
            this.errors = errorResponse.error.errors
            
          }
        )
    }

    private addNewBookedDateTimes(bookingData: any) { // Update UI of frontend.
        this.rental.bookings.push(bookingData)
    }

    showSwalSuccess() {
        Swal.fire({
            title: '予約申込完了！',
            text: '商品オーナーからのお返事をお待ちください',
            type: 'success',
            showConfirmButton: false,
            timer: 5000
        }).then((result) => {
            //this.newBookingCreated.emit(newBooking)
            this.router.navigate(['/rentals/' + this.rental._id])
        })
      }

}
