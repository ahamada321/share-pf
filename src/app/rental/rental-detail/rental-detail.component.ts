import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental } from '../service/rental.model';
import { Booking } from './rental-detail-booking/services/booking.model';
import { RentalService } from '../service/rental.service';
import { BookingService } from './rental-detail-booking/services/booking.service';
// import { Review } from 'src/app/review/service/review.model';
// import { ReviewService } from 'src/app/review/service/review.service';
import * as moment from 'moment-timezone'
import timeGridPlugin from '@fullcalendar/timegrid';


@Component({
    selector: 'app-rental-detail',
    templateUrl: './rental-detail.component.html',
    styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

    currentId: string
    rental: Rental
    newBooking: Booking
    calendarPlugins = [timeGridPlugin]; // important!

    
    // reviews: Review[] = []

    constructor(private route: ActivatedRoute,
                private rentalService: RentalService,
                // private reviewService: ReviewService,
                ) { }

    ngOnInit() {
      this.route.params.subscribe(
        (params) => {
          this.getRental(params['rentalId'])
        })
    }

    getRental(rentalId: string) {
      this.rentalService.getRentalById(rentalId).subscribe(
        (rental: Rental) => {
          this.rental = rental;
          this.getReviews(rental._id)
        }
      )
    }

    getReviews(rentalId: string) {
      // this.reviewService.getRentalReviews(rentalId).subscribe(
      //   (reviews: Review[]) => {
      //     this.reviews = reviews
      //   },
      //   () => {

      //   }
      // )
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
                    start: moment(booking.startAt).tz("Asia/Tokyo").format(), 
                    end: moment(booking.endAt).tz("Asia/Tokyo").format(),
                    // className: 'event-orange'
                })
            }
            if(booking.status == 'active') {
                events.push({
                    //title: this.getUserName(booking.user), 
                    start: moment(booking.startAt).tz("Asia/Tokyo").format(), 
                    end: moment(booking.endAt).tz("Asia/Tokyo").format(),
                    className: 'event-green'
                })
            }
        }
        return events
    }

    formatDate(date: string): string {
        return `${moment(date).fromNow()}`
    }
}
