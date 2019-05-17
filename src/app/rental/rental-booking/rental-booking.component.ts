import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RentalService } from '../service/rental.service';
import { BookingHelperService } from './services/booking.helper.service';
import { BookingService } from './services/booking.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { Rental } from '../service/rental.model';
import { Booking } from './services/booking.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'


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
  selector: 'app-rental-booking',
  templateUrl: './rental-booking.component.html',
  styleUrls: ['./rental-booking.component.scss']
})
export class RentalBookingComponent implements OnInit {
    chosenCourse: number = 0
    chosenDateTime: boolean = false
    chosenCourseTime: number = 60
  
    rental: Rental
    newBooking: Booking
    stripeCustomerId: string
    errors: any[] = []

    calendarPlugins = [timeGridPlugin]; // important!


    constructor(
        private route: ActivatedRoute,
        private rentalService: RentalService,
        private router: Router,
        private formBuilder: FormBuilder,
        private helper: BookingHelperService,
        private bookingService: BookingService,
        private auth: AuthService,

    ) {
        // Animation part
        router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                const tree = router.parseUrl(router.url);
                if (tree.fragment) {
                    const element = document.querySelector("#" + tree.fragment);
                    if (element) { element.scrollIntoView(); }
                }
            }
        })
    }

    ngOnInit() {
        // Think it is better to pass id from before page.
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

    onSelectedDateTime(newBooking: Booking) {
        this.newBooking = newBooking
        this.smoothScroll('paying-method')
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

    chooseCourse(chosenCourse) {
        this.chosenCourse = chosenCourse
        this.smoothScroll('select-date')
    }

    onPaymentConfirmed(stripeCustomerId: string) {
        this.stripeCustomerId = stripeCustomerId
    }

    createBooking() {
        this.newBooking.paymentToken = this.stripeCustomerId
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
