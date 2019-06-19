import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';

import { Rental } from '../service/rental.model';
import { Review } from 'src/app/common/components/review/service/review.model';
import { Booking } from '../rental-booking/services/booking.model';
import { RentalService } from '../service/rental.service';
import { ReviewService } from 'src/app/common/components/review/service/review.service';
import { BookingService } from '../rental-booking/services/booking.service';
// import { Review } from 'src/app/review/service/review.model';
// import { ReviewService } from 'src/app/review/service/review.service';
import { EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment-timezone'


//t = current time
//b = start value
//c = change in value
//d = duration
var easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
@Component({
    selector: 'app-rental-detail',
    templateUrl: './rental-detail.component.html',
    styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit, OnDestroy {
    currentId: string
    rental: Rental
    rating: number
    reviews: Review[] = []
    newBooking: Booking
    calendarPlugins = [timeGridPlugin]; // important!
    calendarEvents: EventInput[] = []
    calendarBusinessHours: EventInput[] = []

    headerOffset: number = 75; // want to replace like DEFINE HEADER_OFFSET
    
    // reviews: Review[] = []

    constructor(private route: ActivatedRoute,
                private rentalService: RentalService,
                private reviewService: ReviewService,
                public router: Router,
                public auth: MyOriginAuthService,
                ) {
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
      let navbar = document.getElementsByTagName('nav')[0];
          navbar.classList.add('navbar-transparent');

      this.route.params.subscribe(
        (params) => {
          this.getRental(params['rentalId'])
        })
    }

    ngOnDestroy() {
      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.remove('navbar-transparent');
    }

    isYourRental() {
      return this.rental.user._id === this.auth.getUserId()
    }

    getRental(rentalId: string) {
      this.rentalService.getRentalById(rentalId).subscribe(
        (rental: Rental) => {
          this.rental = rental;
          this.initBusinessHours()
          this.initEvents()
          this.getAvgRating(rental._id)
          this.getReviews(rental._id)
        }
      )
    }

    getAvgRating(rentalId: string) {
      this.reviewService.getAvgRating(rentalId).subscribe(
        (rating: number) => {
          this.rating = rating
        }
      )
    }

    getReviews(rentalId: string) {
      this.reviewService.getRentalReviews(rentalId).subscribe(
        (reviews: Review[]) => {
          this.reviews = reviews
        },
        () => { }
      )
    }

      //[{resourceId: rental.id, title: user.name, strat: startAt, end: endAt}]
    initEvents() {
        let events: EventInput[] = []

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
            if(booking.status == 'block') {
              events.push({
                  //title: this.getUserName(booking.user), 
                  start: moment(booking.startAt).format('YYYY-MM-DD'),
                  end: moment(booking.endAt).format('YYYY-MM-DD'),
                  rendering: 'background',
                  color: '#b8b8b8'
              })
          }
        }
        this.calendarEvents = events
    }

    initBusinessHours() {
      let businessHours: EventInput[] = []
      if(this.rental.businesshour_enabled_sun) {
        businessHours.push({
          daysOfWeek: [0],
          startTime: this.rental.businesshour_startTime_sun,
          endTime: this.rental.businesshour_endTime_sun
        })
      }
      if(this.rental.businesshour_enabled_mon) {
        businessHours.push({
          daysOfWeek: [1],
          startTime: this.rental.businesshour_startTime_mon,
          endTime: this.rental.businesshour_endTime_mon
        })
      }
      if(this.rental.businesshour_enabled_tue) {
        businessHours.push({
          daysOfWeek: [2],
          startTime: this.rental.businesshour_startTime_tue,
          endTime: this.rental.businesshour_endTime_tue
        })
      }
      if(this.rental.businesshour_enabled_wed) {
        businessHours.push({
          daysOfWeek: [3],
          startTime: this.rental.businesshour_startTime_wed,
          endTime: this.rental.businesshour_endTime_wed
        })
      }
      if(this.rental.businesshour_enabled_thu) {
        businessHours.push({
          daysOfWeek: [4],
          startTime: this.rental.businesshour_startTime_thu,
          endTime: this.rental.businesshour_endTime_thu
        })
      }
      if(this.rental.businesshour_enabled_fri) {
        businessHours.push({
          daysOfWeek: [5],
          startTime: this.rental.businesshour_startTime_fri,
          endTime: this.rental.businesshour_endTime_fri
        })
      }
      if(this.rental.businesshour_enabled_sat) {
        businessHours.push({
          daysOfWeek: [6],
          startTime: this.rental.businesshour_startTime_sat,
          endTime: this.rental.businesshour_endTime_sat
        })
      }
      this.calendarBusinessHours = businessHours
    }

    // formatDate(date: string): string {
    //     return `${moment(date).fromNow()}`
    // }

    @HostListener('window:scroll', ['$event'])
    updateNavigation() {
        // var contentSections = document.getElementsByClassName('cd-section') as HTMLCollectionOf<any>;
        // var navigationItems = document.getElementById('cd-vertical-nav').getElementsByTagName('a');

        // for (let i = 0; i < contentSections.length; i++) {
        //     var activeSection: any = parseInt(navigationItems[i].getAttribute('data-number')) - 1;

        //     if ( ( contentSections[i].offsetTop - window.innerHeight/2 < window.pageYOffset ) && ( contentSections[i].offsetTop + contentSections[i].scrollHeight - window.innerHeight/2 > window.pageYOffset ) ) {
        //         navigationItems[activeSection].classList.add('is-selected');
        //     }else {
        //         navigationItems[activeSection].classList.remove('is-selected');
        //     }
        // }
    }

    smoothScroll(target) {
      let targetScroll = document.getElementById(target);
      this.scrollTo(document.scrollingElement || document.documentElement, targetScroll.offsetTop - this.headerOffset, 625); // Updated by Creative Tim support!
    }
    scrollTo(element, to, duration) {
      var start = element.scrollTop,
          change = to - start,
          currentTime = 0,
          increment = 20;

      var animateScroll = function(){
          currentTime += increment;
          var val = easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if(currentTime < duration) {
              setTimeout(animateScroll, increment);
          }
      };
      animateScroll();
  }

}
