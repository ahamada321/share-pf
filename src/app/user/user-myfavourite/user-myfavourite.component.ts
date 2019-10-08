import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalService } from 'src/app/rental/service/rental.service';
import { Rental } from 'src/app/rental/service/rental.model';


@Component({
  selector: 'app-user-myfavourite',
  templateUrl: './user-myfavourite.component.html',
  styleUrls: ['./user-myfavourite.component.scss']
})
export class UserMyFavouriteComponent implements OnInit, OnDestroy {
  favouriteRentals: Rental[] = []
  errors: any[] = []

  constructor(
    private rentalService: RentalService
  ) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.getUserFavouriteRentals()
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  private getUserFavouriteRentals() {
    this.rentalService.getUserFavouriteRentals().subscribe(
      (foundRentals: Rental[]) => {
        this.favouriteRentals = foundRentals
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
