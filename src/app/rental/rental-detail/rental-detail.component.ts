import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Rental } from '../service/rental.model';
import { Booking } from '../rental-booking/services/booking.model';
import { RentalService } from '../service/rental.service';
import { BookingService } from '../rental-booking/services/booking.service';
// import { Review } from 'src/app/review/service/review.model';
// import { ReviewService } from 'src/app/review/service/review.service';
import * as moment from 'moment-timezone'
import timeGridPlugin from '@fullcalendar/timegrid';

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
    newBooking: Booking
    calendarPlugins = [timeGridPlugin]; // important!

    headerOffset: number = 75; // want to replace like DEFINE HEADER_OFFSET
    
    // reviews: Review[] = []

    constructor(
      private route: ActivatedRoute,
      private rentalService: RentalService,
      // private reviewService: ReviewService,
      public router: Router
    ) {
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
      this.scrollTo(document.documentElement, targetScroll.offsetTop - this.headerOffset, 1250);
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
