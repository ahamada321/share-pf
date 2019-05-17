// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { Rental } from 'src/app/rental/service/rental.model';
import { Booking } from '../../services/booking.model'
import { BookingService } from '../../services/booking.service';
import { BookingHelperService } from '../../services/booking.helper.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalService } from 'src/app/rental/service/rental.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2'

declare const $: any;

@Component({
    selector: 'app-booking-with-time-wizard',
    templateUrl: 'booking-with-time-wizard.component.html',
    styleUrls: ['booking-with-time-wizard.component.scss']
})

export class BookingWithTimeWizardComponent implements OnInit /*, OnChanges*/, AfterViewInit {
    @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
    //@Output() newBookingCreated = new EventEmitter()

    rental: Rental
    newBooking: Booking
    errors: any[] = []
    courseSelected: boolean = false
    isAutoBooking: boolean = false
    defaultDate = new FormControl(new Date())
    defaultCourseTime = new FormControl('30')
    selectedCourseTime: number = 30

    minDate: Date
    maxDate: Date 

    user: any
    timeTables: any = []


    constructor(private formBuilder: FormBuilder,
                private rentalService: RentalService,
                private helper: BookingHelperService,
                private bookingService: BookingService,
                private route: ActivatedRoute,
                private auth: AuthService,
                private router: Router,
                 ) {}

    getRental(rentalId: string) {
        this.rentalService.getRentalById(rentalId).subscribe(
            (rental: Rental) => {
                this.rental = rental
            }
        )
    }

    isAllowAutoBooking() {
        const userId = this.auth.getUserId()
        this.auth.getUserById(userId).subscribe(
            (user) => {
                this.user = user
                this.isAutoBooking = this.user.isAutoBooking
            },
            (err) => { }
        )
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

    changedDateTables(event: MatDatepickerInputEvent<Date>) {
        const selectedMonth = moment(event.value).get('month')
        const selectedDate = moment(event.value).get('date')

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

    ngOnInit() {
        this.minDate = new Date()
        this.maxDate = new Date()
        this.maxDate.setDate((new Date).getDate() + (14-1))

        this.initDateTables()
        this.newBooking = new Booking()
        this.isAllowAutoBooking()
        this.route.params.subscribe(
            (params) => {
              this.getRental(params['rentalId'])
            })

    //   this.type = this.formBuilder.group({
    //     // To add a validator, we must first convert the string value into an array. 
    //     // The first item in the array is the default value if any, then the next item in the array is the validator. 
    //     // Here we are adding a required validator meaning that the firstName attribute must have a value in it.
    //     firstName: [null, Validators.required],
    //     lastName: [null, Validators.required],
    //     email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    //    });

        // Wizard Initialization
        const $cardWizard = $('.card-wizard')
        $cardWizard.bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            'hide': $('#address').val(),

            onInit: function(tab: any, navigation: any, index: any){
              // check number of tabs and fill the entire row
              let $total = navigation.find('li').length;
              let $wizard = navigation.closest('.card-wizard');

              let $first_li = navigation.find('li:first-child a').html();
              let $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
              $('.card-wizard .wizard-navigation').append($moving_div);

              $total = $wizard.find('.nav li').length;
             let  $li_width = 100/$total;

              let total_steps = $wizard.find('.nav li').length;
              let move_distance = $wizard.width() / total_steps;
              let index_temp = index;
              let vertical_level = 0;

              let mobile_device = $(document).width() < 600 && $total > 3;

              if(mobile_device){
                  move_distance = $wizard.width() / 2;
                  index_temp = index % 2;
                  $li_width = 50;
              }

              $wizard.find('.nav li').css('width',$li_width + '%');

              let step_width = move_distance;
              move_distance = move_distance * index_temp;

              let $current = index + 1;

              if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                  move_distance -= 8;
              } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                  move_distance += 8;
              }

              if(mobile_device){
                  let x: any = index / 2;
                  vertical_level = parseInt(x);
                  vertical_level = vertical_level * 38;
              }

              $wizard.find('.moving-tab').css('width', step_width);
              $('.moving-tab').css({
                  'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                  'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

              });
              $('.moving-tab').css('transition','transform 0s');
           },

            onTabClick : () => {
                // If wanna disable, add some codes to return false
                if (this.courseSelected) {
                    return true;
                } else {
                    return false;
                }
            },
            onNext: function(tab, navigation, index) {
                // If wanna disable, add some codes to return false
                if (false) {
                    return false;
                } else {
                    return true;
                }
            },

            onTabShow: function(tab: any, navigation: any, index: any) { // Tab movement included
                let $total = navigation.find('li').length;
                let $current = index + 1;

                const $wizard = navigation.closest('.card-wizard');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                    $($wizard).find('.btn-start').hide();
                } else if ($current == 1) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').hide();
                    $($wizard).find('.btn-start').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                    $($wizard).find('.btn-start').hide();
                }

                const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                setTimeout(function(){
                    $('.moving-tab').text(button_text);
                }, 150);

                const checkbox = $('.footer-checkbox');

                if ( index !== 0 ) {
                    $(checkbox).css({
                        'opacity':'0',
                        'visibility':'hidden',
                        'position':'absolute'
                    });
                } else {
                    $(checkbox).css({
                        'opacity':'1',
                        'visibility':'visible'
                    });
                }
                $total = $wizard.find('.nav li').length;
                let  $li_width = 100/$total;

                let total_steps = $wizard.find('.nav li').length;
                let move_distance = $wizard.width() / total_steps;
                let index_temp = index;
                let vertical_level = 0;

                let mobile_device = $(document).width() < 600 && $total > 3;

                if(mobile_device){
                    move_distance = $wizard.width() / 2;
                    index_temp = index % 2;
                    $li_width = 50;
                }

                $wizard.find('.nav li').css('width',$li_width + '%');

                let step_width = move_distance;
                move_distance = move_distance * index_temp;

                $current = index + 1;

                if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                    move_distance -= 8;
                } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                    move_distance += 8;
                }

                if(mobile_device){
                    let x: any = index / 2;
                    vertical_level = parseInt(x);
                    vertical_level = vertical_level * 38;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                })
            }
        })


        $('[data-toggle="wizard-radio"]').click(function(){
            const wizard = $(this).closest('.card-wizard');
            wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
            $(this).addClass('active');
            $(wizard).find('[type="radio"]').removeAttr('checked');
            $(this).find('[type="radio"]').attr('checked', 'true');
        });

        $('[data-toggle="wizard-checkbox"]').click(function(){
            if ( $(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).find('[type="checkbox"]').removeAttr('checked');
            } else {
                $(this).addClass('active');
                $(this).find('[type="checkbox"]').attr('checked', 'true');
            }
        });

        $('.set-full-height').css('height', 'auto');

    }

    ngAfterViewInit() {
        $( window ).resize( () => { $('.card-wizard').each(function(){

            const $wizard = $(this);
            const index = $wizard.bootstrapWizard('currentIndex');
            let $total = $wizard.find('.nav li').length;
            let  $li_width = 100/$total;

            let total_steps = $wizard.find('.nav li').length;
            let move_distance = $wizard.width() / total_steps;
            let index_temp = index;
            let vertical_level = 0;

            let mobile_device = $(document).width() < 600 && $total > 3;

            if(mobile_device){
                move_distance = $wizard.width() / 2;
                index_temp = index % 2;
                $li_width = 50;
            }

            $wizard.find('.nav li').css('width',$li_width + '%');

            let step_width = move_distance;
            move_distance = move_distance * index_temp;

            let $current = index + 1;

            if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                move_distance -= 8;
            } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                move_distance += 8;
            }

            if(mobile_device){
                let x: any = index / 2;
                vertical_level = parseInt(x);
                vertical_level = vertical_level * 38;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
            });

            $('.moving-tab').css({
                'transition': 'transform 0s'
            });
            });
        });
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
        $('#wizardProfile a[href="#account"]').tab('show');

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
