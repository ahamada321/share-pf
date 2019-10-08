import { Component, OnInit } from '@angular/core';
import { Rental } from '../service/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalService } from '../service/rental.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-rental-new',
  templateUrl: './rental-new.component.html',
  styleUrls: ['./rental-new.component.scss']
})
export class RentalNewComponent implements OnInit {

  newRental: Rental
  rentalCategories = Rental.CATEGORIES
  errors: any[] = []

  // Select category
  dropdownCategoryList = [
    {"id":1,"itemName":"ウエディング"},
    {"id":2,"itemName":"フラワー"},
    {"id":3,"itemName":"2次会"},
    {"id":4,"itemName":"その他"}
  ]
  dropdownCategorySettings = { 
    singleSelection: true, 
    text:"カテゴリを選択",
    enableSearchFilter: false,
    classes:""
  }

  constructor(
    private rentalService: RentalService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.newRental = new Rental()
    this.newRental.image = "assets/images/image_placeholder.jpg"

    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  createRental(rentalForm: NgForm) {
    this.rentalService.createRental(this.newRental).subscribe(
      (rental: Rental) => {
        this.router.navigate(['/rentals/manage'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
  )}

  imageChange() {
    this.newRental.image = "assets/images/room1.jpg"
  }
}
