import { Component, OnInit, OnDestroy } from '@angular/core';
import { RentalService } from 'src/app/rental/service/rental.service';
import { Rental } from 'src/app/rental/service/rental.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-rental-manage',
  templateUrl: './rental-manage.component.html',
  styleUrls: ['./rental-manage.component.scss']
})
export class RentalManageComponent implements OnInit, OnDestroy {

  rentals: Rental[] = []
  rentalDeleteIndex: number = undefined

  constructor(private rentalService: RentalService,
              ) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.rentalService.getOwnerRentals().subscribe(
      (rentals: Rental[]) => {
        this.rentals = rentals
      },
      () => {

      }
    )
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('settings');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  deleteRental(rentalId: string) {
    this.rentalService.deleteRental(rentalId).subscribe(
      () => {
        this.rentals.splice(this.rentalDeleteIndex, 1)
        this.rentalDeleteIndex = undefined

        // Due to refresh FullCalender when delete rental
        this.ngOnInit()
      },
      (errorResponse: HttpErrorResponse) => {

        // Expecting to show error if try to dalete rental which has active bookings
        // this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!')
      }
    )
  }
}
