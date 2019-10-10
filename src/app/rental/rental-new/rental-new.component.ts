import { Component, OnInit } from '@angular/core';
import { Rental } from '../service/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalService } from '../service/rental.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'


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
    {"id":1,"itemName":"Sport"},
    {"id":2,"itemName":"Music"},
    {"id":3,"itemName":"Others"}
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
        this.showSwalSuccess()
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
  )}

  private showSwalSuccess() {
    Swal.fire({
        // title: 'User infomation has been updated!',
        text: '商品を新規登録しました！',
        type: 'success',
        confirmButtonClass: "btn btn-primary btn-round btn-lg",
        buttonsStyling: false,
        timer: 5000
    }).then(() => {
      this.router.navigate(['/rentals/manage'])
    })
}

  imageChange() {
    this.newRental.image = "assets/images/room1.jpg"
  }
}
