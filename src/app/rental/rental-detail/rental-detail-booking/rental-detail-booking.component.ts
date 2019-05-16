import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment-timezone';
import { RentalService } from '../../service/rental.service';
import { BookingHelperService } from './services/booking.helper.service';
import { BookingService } from './services/booking.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { Rental } from '../../service/rental.model';
import { Booking } from './services/booking.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import {NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


//t = current time
//b = start value
//c = change in value
//d = duration
var easeInOutQuad = function(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
@Component({
  selector: 'app-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
    chosenCourse: number = 0
    chosenDateTime: boolean = false // have to change name to datetimeSelected

    chosenCourseTime: number = 60
    timeTables: any = []

    // Date picker params
    @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
    selectedDate: NgbDateStruct
    minDate: NgbDateStruct
    maxDate: NgbDateStruct 

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

            router.events.subscribe(s => {
                if (s instanceof NavigationEnd) {
                    const tree = router.parseUrl(router.url);
                    if (tree.fragment) {
                        const element = document.querySelector("#" + tree.fragment);
                        if (element) { element.scrollIntoView(); }
                    }
                }
            });
         }
    
    @HostListener('window:scroll', ['$event'])
    updateNavigation() {
        // const contentSections = document.getElementsByClassName('cd-section') as HTMLCollectionOf<any>;
        // const navigationItems = document.getElementById('cd-vertical-nav').getElementsByTagName('a');

        // for (let i = 0; i < contentSections.length; i++) {
        //     const activeSection: any = parseInt(navigationItems[i].getAttribute('data-number')) - 1;

        //     if ( ( contentSections[i].offsetTop - window.innerHeight/2 < window.pageYOffset ) && ( contentSections[i].offsetTop + contentSections[i].scrollHeight - window.innerHeight/2 > window.pageYOffset ) ) {
        //         navigationItems[activeSection].classList.add('is-selected');
        //     }else {
        //         navigationItems[activeSection].classList.remove('is-selected');
        //     }
        // }
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

    getRental(rentalId: string) {
        this.rentalService.getRentalById(rentalId).subscribe(
            (rental: Rental) => {
                this.rental = rental
            }
        )
    }

    chooseCourse(courseName) {
        this.chosenCourse = courseName
        if(courseName === 1) this.chosenCourseTime = 30
        else if(courseName === 2) this.chosenCourseTime = 60
        else if(courseName === 3) this.chosenCourseTime = 60
        else if(courseName === 4) this.chosenCourseTime = 60

        this.smoothScroll('select-date')
    }

    smoothScroll(target) {
        const targetScroll = document.getElementById(target);
        this.scrollTo(document.documentElement, targetScroll.offsetTop, 1250);
    }
    scrollTo(element, to, duration) {
        const start = element.scrollTop
        const change = to - start
        let currentTime = 0
        const increment = 20;

        let animateScroll = function(){
            currentTime += increment;
            element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    ngAfterViewInit(){
        this.updateNavigation();
    }

    initDateTables() {
        const tempDates = []
        const mEndAt = moment({ hour:20, minute:30 })
        let mStartAt = moment({ hour:9, minute:0 })

        while(mStartAt < mEndAt) {
            tempDates.push(moment(mStartAt))
            mStartAt = mStartAt.add(30, 'minutes')
        }
        tempDates.push(mEndAt)

        this.timeTables = tempDates
    }

    onDateSelect(event: NgbDateStruct) {
        const selectedMonth = event.month - 1
        const selectedDate = event.day

        const tempDates = []
        const mEndAt = moment({ hour:20, minute:30 }).set({ 'month': selectedMonth, 'date': selectedDate})
        let mStartAt = moment({ hour:9, minute:0 }).set({ 'month': selectedMonth, 'date': selectedDate})

        while(mStartAt < mEndAt) {
            tempDates.push(moment(mStartAt))
            mStartAt = mStartAt.add(30, 'minutes')
        }
        tempDates.push(mEndAt)

        this.timeTables = tempDates
        this.chosenDateTime = false
    }

    selectDateTime(startAt){
        const endAt = moment(startAt).add(this.chosenCourseTime, 'minute')

        this.newBooking.startAt = moment(startAt).format()
        this.newBooking.endAt = endAt.subtract(1, 'seconds').format()

        this.newBooking.courseTime = this.chosenCourseTime
        this.newBooking.totalPrice = this.rental.hourlyPrice * (this.chosenCourseTime / 60)

        this.chosenDateTime = true
        this.smoothScroll('paying-method')
    }

    isPastDateTime(startAt) {
        return moment(startAt).diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
    }

    isValidBooking(startAt) {
        let isValid = false
        const rentalBookings = this.rental.bookings

        const reqStart = moment(startAt)
        const endAt = moment(startAt).add(this.chosenCourseTime, 'minute')
        const reqEnd = endAt.subtract(1, 'seconds')

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
