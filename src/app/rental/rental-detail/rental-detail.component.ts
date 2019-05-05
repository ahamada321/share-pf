import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental } from '../service/rental.model';
import { Booking } from './rental-detail-booking/services/booking.model';
import { RentalService } from '../service/rental.service';
import { BookingService } from './rental-detail-booking/services/booking.service';
// import { Review } from 'src/app/review/service/review.model';
// import { ReviewService } from 'src/app/review/service/review.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

  currentId: string
  rental: Rental
  newBooking: Booking
  
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

  formatDate(date: string): string {
    return `${moment(date).fromNow()}`
  }
}
