import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbTimeStruct, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { Rental } from '../../service/rental.model';
import { RentalService } from '../../service/rental.service';
import Swal from 'sweetalert2'
import * as moment from 'moment-timezone';
import { Booking } from '../../rental-detail/rental-detail-booking/services/booking.model';
import { BookingService } from '../../rental-detail/rental-detail-booking/services/booking.service';


@Component({
  selector: 'app-modal-content',
  template: `
  <div class="modal-header">
      <h5 class="modal-title text-center">{{date}}</h5>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
  </div>
  <div class="modal-body"> 
      <div class="row">
          <div class="col-md-6 text-center">
              受付開始
          </div>
          <div class="col-md-6 text-center">
              <ngb-timepicker 
                  [(ngModel)]="startTime"
                  [hourStep]="hourStep" 
                  [minuteStep]="minuteStep">
              </ngb-timepicker>
          </div>
      </div>
      <div class="row">
          <div class="col-md-6 text-center">
              受付終了
          </div>
          <div class="col-md-6 text-center justify-content-center">
              <ngb-timepicker 
                  [(ngModel)]="endTime"
                  [hourStep]="hourStep" 
                  [minuteStep]="minuteStep">
              </ngb-timepicker>
          </div>
      </div>
      <div class="text-center">
          {{date}}の受付時間を設定します
      </div>
  </div>
  <div class="modal-footer">
      <div class="left-side">
          <button type="button" class="btn btn-default btn-link" (click)="activeModal.close(onSetClicked(startTime, endTime))">セットする</button>
      </div>
      <div class="divider"></div>
      <div class="right-side">
          <button type="button" class="btn btn-link" (click)="activeModal.close()">キャンセル</button>
      </div>
  </div>
  `
})
export class TimePickerModal {
  @Input() name;
  @Input() date;
  @Input() rental: Rental
  startTime: NgbTimeStruct = { hour:10, minute:0, second:0 }
  endTime: NgbTimeStruct = { hour:19, minute:0, second:0  }
  hourStep = 1;
  minuteStep = 30;

  constructor(public activeModal: NgbActiveModal) {}

  onSetClicked(startTime, endTime) {
    let event = {
      title: 'スポット受付',
      start: moment(startTime).set({month: moment(this.date).month(),date: moment(this.date).date()}).format(),
      end: moment(endTime).set({month: moment(this.date).month(),date: moment(this.date).date()}).format()
    }
    return event
  }

  onDeleteButton() {
    // delete from db
    // delete from frontend
  }
}


@Component({
  selector: 'app-rental-manage-schedule',
  templateUrl: './rental-manage-schedule.component.html',
  styleUrls: ['./rental-manage-schedule.component.scss']
})
export class RentalManageScheduleComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent // This refering #calendar in frontend html
  calendarPlugins = [dayGridPlugin, interactionPlugin]; // important!
  calendarEvents: EventInput[] = []
  calendarBusinessHours: EventInput[] = []
  businessHoursData: any = {}
  rental: Rental
  newBooking: Booking
  hourStep = 1;
  minuteStep = 30;

  constructor(
      private auth: MyOriginAuthService, 
      private route: ActivatedRoute,
      private router: Router,
      private rentalService: RentalService,
      private bookingService: BookingService,
      private modalService: NgbModal ) { }

  ngOnInit() {
    this.newBooking = new Booking()
    this.route.params.subscribe(
      (params) => {
        this.getRentalById(params['rentalId'])
    })

    let body = document.getElementsByTagName('body')[0];
    body.classList.add('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getRentalById(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental: Rental) => {
        this.rental = rental
        this.getBlockDate()
        this.initBusinessHours()
      }
    )
  }

  getBlockDate() {
    for(let booking of this.rental.bookings) {
      if(booking.status == 'block') {
        this.calendarEvents = this.calendarEvents.concat({
            id: booking._id,
            title: 'ブロック',
            allday: true,
            start: moment(booking.startAt).format('YYYY-MM-DD'),
            end: moment(booking.endAt).format('YYYY-MM-DD'),
        })
      }
    }
  }

  initBusinessHours() {
    this.businessHoursData = {
      sun_name: 'Sunday',
      sun_enabled: this.rental.businesshour_enabled_sun,
      sun_startAt: this.rental.businesshour_startTime_sun,
      sun_endAt: this.rental.businesshour_endTime_sun,
      mon_name: 'Monday',
      mon_enabled: this.rental.businesshour_enabled_mon,
      mon_startAt: this.rental.businesshour_startTime_mon,
      mon_endAt: this.rental.businesshour_endTime_mon,
      tue_name: 'Tuesday',
      tue_enabled: this.rental.businesshour_enabled_tue,
      tue_startAt: this.rental.businesshour_startTime_tue,
      tue_endAt: this.rental.businesshour_endTime_tue,
      wed_name: 'Wednesday',
      wed_enabled: this.rental.businesshour_enabled_wed,
      wed_startAt: this.rental.businesshour_startTime_wed,
      wed_endAt: this.rental.businesshour_endTime_wed,
      thu_name: 'Thursday',
      thu_enabled: this.rental.businesshour_enabled_thu,
      thu_startAt: this.rental.businesshour_startTime_thu,
      thu_endAt: this.rental.businesshour_endTime_thu,
      fri_name: 'Friday',
      fri_enabled: this.rental.businesshour_enabled_fri,
      fri_startAt: this.rental.businesshour_startTime_fri,
      fri_endAt: this.rental.businesshour_endTime_fri,
      sat_name: 'Saturday',
      sat_enabled: this.rental.businesshour_enabled_sat,
      sat_startAt: this.rental.businesshour_startTime_sat,
      sat_endAt: this.rental.businesshour_endTime_sat
    }

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

  updatebusinessHours(businessHoursForm: NgForm) {
    this.rental.businesshour_enabled_sun = businessHoursForm.value.sun_enabled
    this.rental.businesshour_startTime_sun = businessHoursForm.value.sun_startAt
    this.rental.businesshour_endTime_sun = businessHoursForm.value.sun_endAt

    this.rental.businesshour_enabled_mon =  businessHoursForm.value.mon_enabled
    this.rental.businesshour_startTime_mon = businessHoursForm.value.mon_startAt
    this.rental.businesshour_endTime_mon = businessHoursForm.value.mon_endAt

    this.rental.businesshour_enabled_tue =  businessHoursForm.value.tue_enabled
    this.rental.businesshour_startTime_tue = businessHoursForm.value.tue_startAt
    this.rental.businesshour_endTime_tue = businessHoursForm.value.tue_endAt

    this.rental.businesshour_enabled_wed =  businessHoursForm.value.wed_enabled
    this.rental.businesshour_startTime_wed = businessHoursForm.value.wed_startAt
    this.rental.businesshour_endTime_wed = businessHoursForm.value.wed_endAt

    this.rental.businesshour_enabled_thu =  businessHoursForm.value.thu_enabled
    this.rental.businesshour_startTime_thu = businessHoursForm.value.thu_startAt
    this.rental.businesshour_endTime_thu = businessHoursForm.value.thu_endAt

    this.rental.businesshour_enabled_fri =  businessHoursForm.value.fri_enabled
    this.rental.businesshour_startTime_fri = businessHoursForm.value.fri_startAt
    this.rental.businesshour_endTime_fri = businessHoursForm.value.fri_endAt

    this.rental.businesshour_enabled_sat =  businessHoursForm.value.sat_enabled
    this.rental.businesshour_startTime_sat = businessHoursForm.value.sat_startAt
    this.rental.businesshour_endTime_sat = businessHoursForm.value.sat_endAt
    
    this.rentalService.updateRental(this.rental._id, this.rental).subscribe(
      (updatedRental) => {
        this.showSwalSuccess()
        this.initBusinessHours()
      },
      (err) => { }
    )
  }

  private showSwalSuccess() {
    Swal.fire({
        // title: 'User infomation has been updated!',
        text: '定例スケジュールが更新されました！',
        type: 'success',
        confirmButtonClass: "btn btn-primary btn-round btn-lg",
        buttonsStyling: false,
        timer: 5000
    })
    // .then(() => {
    //   this.router.navigate(['/rentals/manage'])
    // })
  }

  async handleDateClick(arg) {
    await this.delay(150)
    Swal.fire({
      title: '以下日時をブロックしますか？',
      text: arg.dateStr,
      type: 'info',
      confirmButtonClass: "btn btn-primary btn-lg",
      confirmButtonText: "ブロック",
      cancelButtonClass: "btn btn-gray btn-lg",
      cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        let event = {
          id: '',
          title: 'ブロック',
          allday: true,
          start: arg.dateStr,
          end: moment(arg.dateStr).add(1, 'day').format('YYYY-MM-DD'),
        }
        this.createDateBlockBooking(event)
      }
    })
  }

  // isBlockedDate(date) {
  //   const d = new Date(date);
  //   return d.getDay() === 0 || d.getDay() === 6;
  // }

  handleDragSelect(arg) { // handler method
    if(arg.startStr == moment(arg.endStr).subtract(1, 'day').format('YYYY-MM-DD')) {
      return
    }
    Swal.fire({
      title: '以下日時をブロックしますか？',
      text: arg.startStr + ' ~ ' + moment(arg.endStr).subtract(1, 'day').format('YYYY-MM-DD'),
      type: 'info',
      confirmButtonClass: "btn btn-primary btn-lg",
      confirmButtonText: "ブロック",
      cancelButtonClass: "btn btn-gray btn-lg",
      cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        // Delet event from DB
        let event = {
          id: '',
          title: 'ブロック',
          allday: true,
          start: arg.startStr,
          end: arg.endStr,
        }
        this.createDateBlockBooking(event)
      }
    })
  }

  private createDateBlockBooking(event) {
    this.newBooking.startAt = event.start
    this.newBooking.endAt = event.end
    this.newBooking.rental = this.rental
    this.bookingService.createDateBlockBooking(this.newBooking).subscribe(
      (resultId) => {
        event.id = resultId
        this.calendarEvents = this.calendarEvents.concat(event) // Update front UI
        // this.newBooking = new Booking()
      },
      (err) => { }
    )
  }

  async handleEventClick(arg) {
    await this.delay(150)
    this.showSwalDeleteAlert(arg)
  }

  private showSwalDeleteAlert(arg) {
    Swal.fire({
        title: 'ブロックを削除しますか？',
        type: 'warning',
        confirmButtonClass: "btn btn-primary btn-lg",
        confirmButtonText: "削除",
        cancelButtonClass: "btn btn-gray btn-lg",
        cancelButtonText: "キャンセル",
        showCancelButton: true,
        buttonsStyling: false,
        allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        const index = this.calendarEvents.findIndex((x) => x.id === arg.event.id)
        this.calendarEvents.splice(index, 1) // Dlete event from array.      
        arg.event.remove() // Update Frontend

        this.bookingService.deleteBooking(arg.event.id).subscribe( // Update DB
          (deletedBooking) => { },
          (err) => { }
        )
      }
    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
  }

  // Reference for coding: https://stackblitz.com/edit/fullcalendar-angular-demo
}
