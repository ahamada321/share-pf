import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment"


@Component({
  selector: 'app-rental-bookings-list',
  templateUrl: './rental-bookings-list.component.html',
  styleUrls: ['./rental-bookings-list.component.scss']
})
export class RentalBookingsListComponent implements OnInit {
  @Input() filterFinished: boolean = false
  @Input() payments: any[]

  constructor() { }

  ngOnInit() {
  }

  isExpired(startAt) {
    const timeNow = moment() // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0
  }
}
