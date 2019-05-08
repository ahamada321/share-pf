// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

// import PerfectScrollbar from 'perfect-scrollbar';
import { Rental } from 'src/app/rental/service/rental.model';
import { Booking } from '../rental-detail-booking/services/booking.model';
import { AuthService } from 'src/app/auth/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

import * as moment from 'moment-timezone'
import Swal from 'sweetalert2'
import { BookingService } from '../rental-detail-booking/services/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare const $: any;

@Component({
    selector: 'app-rental-detail-calendar',
    templateUrl: './rental-detail-calendar.component.html',
    styleUrls: ['./rental-detail-calendar.component.scss']
})

export class RentalDetailCalendarComponent implements OnInit {
    @ViewChild("content") private contentRef: TemplateRef<Object>
    @Input() rental: Rental
    newBooking: Booking
    isPastDateTime: boolean
    modalRef: any
    errors: any[] = []

    //events: any[] = []

    constructor(private auth: AuthService,
                private router: Router,
                private bookingService: BookingService,
                private modalService: NgbModal
                ) { }

    ngOnInit() {
        this.newBooking = new Booking
        this.initCalendar() 
    }


    initCalendar() {
        const $calendar = $('#fullCalendar');
        $calendar.fullCalendar({
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

            // selectable: true,
            // selectHelper: true, // To support drag select
            // select: (startAt, endAt) => {
            //     //alert('selected ' + startAt.format() + ' to ' + endAt.format());
            //     this.showSwal(startAt, endAt)
            // },
            
            //aspectRatio: 1,
            // viewRender: function(view: any, element: any) {
            //     // We make sure that we activate the perfect scrollbar when the view isn't on Month
            //     if (view.name != 'month') {
            //         var elem = $(element).find('.fc-scroller')[0];
            //         let ps = new PerfectScrollbar(elem);
            //     }
            // },
            header: {
                left: 'title',
                right: 'prev, next, today'
            },
            views: {
                agenda: {
                    titleFormat: 'MMM YYYY'
                },
            },
            defaultView: 'agendaWeek', // Or basicWeek
            columnFormat: 'M/D\nddd', // If update to v3.8.0 or later, should replace to "columnHeaderFormat".

            allDaySlot: false, // Hide all-day area
            minTime: '09:00:00', // Start time of the day
            maxTime: '21:00:00', // End time of the day
            scrollTime: moment().format('HH:mm:00'), // Scroll to current time
            nowIndicator: true,

            // This is bind available booking days
            validRange: {
                start: moment().format("YYYY-MM-DD"),
                end: moment().add(14, 'days').format("YYYY-MM-DD")
            },
            
            //eventLimit: true, // allow "more" link when too many events
            contentHeight: 500,
        
            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
            events: this.initEvents(),
            eventTextColor: 'white',
            timeFormat: 'H:mm'
            
        })
    }


    //[{resourceId: rental.id, title: user.name, strat: startAt, end: endAt}]
    initEvents() {
        let events: any[] = []

        // // Draw past-time to gray.
        // events.push({
        //     start: "2010-01-01", 
        //     end: moment().tz("Asia/Tokyo"),
        //     rendering: 'background',
        //     backgroundColor: 'gray'
        // })
        
        for(let booking of this.rental.bookings) {
            if(booking.status == 'pending') {
                events.push({
                    //title: this.getUserName(booking.user), 
                    start: moment(booking.startAt).tz("Asia/Tokyo"), 
                    end: moment(booking.endAt).tz("Asia/Tokyo"),
                    className: 'event-orange'
                })
            }
            if(booking.status == 'active') {
                events.push({
                    //title: this.getUserName(booking.user), 
                    start: moment(booking.startAt).tz("Asia/Tokyo"), 
                    end: moment(booking.endAt).tz("Asia/Tokyo"),
                    className: 'event-green'
                })
            }
        }
        return events
    }

    getUserName(userId) {
        this.auth.getUserById(userId).subscribe(
            (user) => {
            return user.username
            },
            (err) => {

            }
        )
    }

    isValidBooking(startAt, endAt) {
        let isValid = false
        const rentalBookings = this.rental.bookings

        const reqStart = moment(startAt.format())
        const reqEnd = moment(endAt.format()).subtract(1, 'seconds')


        this.isPastDateTime = reqStart.diff(moment()) < 0 // Attention: just "moment()" is already applied timezone!
        if(this.isPastDateTime) {
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

    selectDateTime(startAt, endAt) {
        this.newBooking.startAt = startAt
        this.newBooking.endAt = endAt

        this.newBooking.totalPrice = 1000 // Fix me!
        //this.newBooking.hours = -(startAt.diff(endAt, 'hours'))
        //this.newBooking.totalPrice = this.newBooking.hours * this.rental.hourlyPrice

    }

    openConfirmModal(content) {
        this.errors = []
        this.modalRef = this.modalService.open(content)
    }

    onPaymentConfirmed(paymentToken: any) {
        this.newBooking.paymentToken = paymentToken
    }

    createBooking() {
        this.newBooking.rental = this.rental
        this.bookingService.createBooking(this.newBooking).subscribe(
            (newBooking: any) => {
                //this.addNewBookedDates(bookingData)
                this.addRequestEvents(newBooking.startAt, newBooking.endAt)
                this.newBooking = new Booking()
                this.modalRef.close()
                this.showSwalSuccess()
            },
            (errorResponse: HttpErrorResponse) => {
                this.errors = errorResponse.error.errors
                
            }
        )
    }

    addRequestEvents(startAt, endAt) {
        const $calendar = $('#fullCalendar');
        $calendar.fullCalendar('renderEvent', {
            //title: this.getUserName(booking.user), 
            start: moment(startAt).tz("Asia/Tokyo"), 
            end: moment(endAt).tz("Asia/Tokyo"),
            className: 'event-orange'
        })
    }

    showSwal(startAt, endAt) {
        if(!this.auth.isAuthenticated()) {
            Swal.fire({
                title: 'ログイン後に予約できます',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: "btn btn-danger",
                confirmButtonText: 'ログインページへ進む',
                cancelButtonClass: 'btn',
                cancelButtonText: 'キャンセル',
                buttonsStyling: false
            }).then((result) => {
                if(result.value) {
                    this.router.navigate(['/login'])
                }
            })

        } else if(!this.isValidBooking(startAt, endAt) && this.isPastDateTime) {
            Swal.fire({
                title: '予約できません！',
                text: '過去の時間は予約できません',
                type: 'error',
                confirmButtonClass: "btn btn-danger",
                buttonsStyling: false
            })

        } else if(!this.isValidBooking(startAt, endAt)) {
            Swal.fire({
                title: '予約できません！',
                text: '他の予約時間に被らないよう日時を選択してください',
                type: 'error',
                confirmButtonClass: "btn btn-danger",
                buttonsStyling: false
            })

        } else {
            Swal.fire({
                title: '以下の日時で予約を進めますか？',
                html:   '<p>予約日：' + startAt.format('L') + '</p>'
                        + '<p>時間：' + startAt.format('HH:mm') + 'から' + endAt.format('HH:mm') + 'まで</p>',
                //type: 'success',
                showCancelButton: true,
                confirmButtonClass: "btn btn-danger",
                confirmButtonText: '予約画面へ進む',
                cancelButtonClass: 'btn',
                cancelButtonText: 'キャンセル',
                buttonsStyling: false
            }).then((result) => {
                if(result.value) {
                    this.selectDateTime(startAt, endAt)
                    this.openConfirmModal(this.contentRef)
                    //this.router.navigate(['/login', {registered: 'success'}])
                }
            })
        }
    }

    showSwalSuccess() {
        Swal.fire({
            title: '予約申込完了！',
            text: '商品オーナーからのお返事をお待ちください',
            type: 'success',
            showConfirmButton: false,
            timer: 5000
        })
    }
}
