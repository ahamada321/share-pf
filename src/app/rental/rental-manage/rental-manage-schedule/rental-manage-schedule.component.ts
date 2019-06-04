import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbTimeStruct, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import timeGridPlugin from '@fullcalendar/timegrid'; // Going to remove
import { Rental } from '../../service/rental.model';
import { RentalService } from '../../service/rental.service';


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
          <button type="button" class="btn btn-default btn-link" (click)="activeModal.close('Close click'); onSetClicked(startTime, endTime)">セットする</button>
      </div>
      <div class="divider"></div>
      <div class="right-side">
          <button type="button" class="btn btn-danger btn-link" (click)="activeModal.close('Close click')">削除する</button>
      </div>
  </div>
  `
})
export class TimePickerModal {
  @Input() name;
  @Input() date;
  startTime: NgbTimeStruct
  endTime: NgbTimeStruct
  hourStep = 1;
  minuteStep = 30;
  event = {}

  constructor(public activeModal: NgbActiveModal) {}

  onSetClicked(startTime, endTime) {
    let event = {
      start: startTime,
      end: endTime
    }

    // add to db (Rental?) 最大31個いるからなぁ。作らんとダメかなぁ。
    // add to frontend
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
export class RentalManageScheduleComponent implements OnInit {
    calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin]; // important!
    rental: Rental
    businessHoursData: any = {}
    hourStep = 1;
    minuteStep = 30;


    constructor(
      private auth: AuthService, 
      private route: ActivatedRoute,
      private router: Router,
      private rentalService: RentalService,
      private modalService: NgbModal ) { }

    ngOnInit() {
      this.route.params.subscribe(
        (params) => {
          this.getRentalById(params['rentalId'])
      })

      let body = document.getElementsByTagName('body')[0];
      body.classList.add('settings');
      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.add('navbar-transparent');
    }

    ngOnDestroy(){
        let body = document.getElementsByTagName('body')[0];
        body.classList.remove('settings');
        let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    getRentalById(rentalId: string) {
      this.rentalService.getRentalById(rentalId).subscribe(
        (rental: Rental) => {
          this.rental = rental
          this.initBusinessHours()
        }
      )
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
    }

    updatebusinessHours(businessHoursForm: NgForm) {
      this.rental.businesshour_enabled_sun =  businessHoursForm.value.sun_enabled
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
          // Update component entity field text after save to DB
          // this.rental = updatedRental
          businessHoursForm.reset(businessHoursForm.value)
          this.showSwalSuccess()
        },
        (err) => { }
      )
    }

    private showSwalSuccess() {
        Swal.fire({
            // title: 'User infomation has been updated!',
            text: 'User infomation has been updated!',
            type: 'success',
            confirmButtonClass: "btn btn-primary btn-round btn-lg",
            buttonsStyling: false,
            timer: 5000
        }).then(() => {
          this.router.navigate(['/rentals/manage'])
        })
    }

    handleDateClick(arg) { // handler method
      const modalRef = this.modalService.open(TimePickerModal);
      modalRef.componentInstance.name = 'World';
      modalRef.componentInstance.date = arg.dateStr

      // Swal.fire({
      //     // title: 'User infomation has been updated!',
      //     // text: arg.dateStr,
      //     type: 'success',
      //     html:
      //       "<input>" +
      //       "<ngb-timepicker></ngb-timepicker>",
      //     //onOpen:,
      //     confirmButtonClass: "btn btn-primary btn-round btn-lg",
      //     buttonsStyling: false,
      // }).then(() => {
      //   // this.router.navigate(['/rentals', {registered: 'success'}])
      // })
    }

    // You can reference https://stackblitz.com/edit/fullcalendar-angular-demo
    dayRender(ev){
      // ev.el.addEventListener('dblclick', () => {
      //    alert('double click!');
      // });

    }
}
