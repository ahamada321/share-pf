import { Component, OnInit } from '@angular/core';
import { Rental } from '../service/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalService } from '../service/rental.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {

  newRental: Rental
  rentalCategories = Rental.CATEGORIES
  errors: any[] = []

  constructor(private rentalService: RentalService, private router: Router) { }

  ngOnInit() {
    this.newRental = new Rental()
    this.newRental.image = "assets/images/image_placeholder.jpg"
    this.newRental.shared = false

  }

  createRental() {
    this.rentalService.createRental(this.newRental).subscribe(
      (rental: Rental) => {
        this.router.navigate(['/rentals/', rental._id])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
  )}

  imageChange() {
    this.newRental.image = "assets/images/room1.jpg"
  }
}
