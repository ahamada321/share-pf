import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { RentalService } from '../../service/rental.service';
import { BookingService } from './services/booking.service';
import { BookingHelperService } from './services/booking.helper.service';
// import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { Rental } from '../../service/rental.model';
import { Booking } from './services/booking.model';
import { HttpErrorResponse } from '@angular/common/http';

import { MatStepper } from '@angular/material';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-rental-booking',
  templateUrl: './rental-booking.component.html',
  styleUrls: ['./rental-booking.component.scss']
})
export class RentalBookingComponent implements OnInit, OnDestroy {
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    @ViewChild('stepper') stepper: MatStepper;

    selectedCourse: number = 1
    isSelectedDateTime: boolean = false
    chosenCourseTime: number = 60

    isChangeBtnClicked: boolean = false
  
    rental: Rental
    newBooking: Booking
    paymentToken: string
    // stripeCustomerId: string = ""
    customer: any
    
    errors: any[] = []


    constructor(
        private route: ActivatedRoute,
        private rentalService: RentalService,
        private router: Router,
        private _formBuilder: FormBuilder,
        private helper: BookingHelperService,
        private bookingService: BookingService,
        private auth: MyOriginAuthService,

    ) { }

    ngOnInit() {
        this.getStripeCustomerInfo()

        // Think it is better to pass id from before page.
        this.route.params.subscribe(
            (params) => {
                this.getRental(params['rentalId'])
        })

        // Also adding exception logic in app.component.ts
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    ngOnDestroy() {
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
      }

    getRental(rentalId: string) {
        this.rentalService.getRentalById(rentalId).subscribe(
            (rental: Rental) => {
                this.rental = rental
            }
        )
    }

    getStripeCustomerInfo() {
        const userId = this.auth.getUserId()
        this.auth.getUserById(userId).subscribe(
            (user) => {
                this.customer = user.customer
                //this.getUserLast4()
            },
            (err) => { }
        )
      }

    onCourseSelected(course: number){
        this.selectedCourse = course
        if(course === 1) this.chosenCourseTime = 60
        if(course === 2) this.chosenCourseTime = 90
        this.stepper.next();
    }

    onBookingReady(newBooking: Booking) {
        this.newBooking = newBooking
        this.stepper.next();
    }

    onPaymentConfirmed(paymentToken: string) {
        this.paymentToken = paymentToken
        this.isChangeBtnClicked = false
    }

    createBooking() {
        this.newBooking.paymentToken = this.paymentToken

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
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-danger btn-lg',
              cancelButton: 'btn btn-lg'
            },
            buttonsStyling: false,
          })

        swalWithBootstrapButtons.fire({
            title: '予約申込完了！',
            text: '商品オーナーからのお返事をお待ちください',
            type: 'success',
            // showConfirmButton: false,
            timer: 5000
        }).then((result) => {
            //this.newBookingCreated.emit(newBooking)
            this.router.navigate(['/user/pending'])
        })
      }
}
