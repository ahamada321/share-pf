import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RentalService } from '../service/rental.service';
import { Rental } from '../service/rental.model';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-rental-edit',
  templateUrl: './rental-edit.component.html',
  styleUrls: ['./rental-edit.component.scss']
})
export class RentalEditComponent implements OnInit {
    rental: Rental
    state_info = true;
    state_info1 = true;
    third_switch = true;

    data : Date = new Date();

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
      private router: Router,
      private route: ActivatedRoute,
      private rentalService: RentalService
    ) { }

    ngOnInit() {
      this.route.params.subscribe(
        (params) => {
          this.getRental(params['rentalId'])
        })

      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.add('navbar-transparent');
    }
    ngOnDestroy(){
      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.remove('navbar-transparent');
    }

    getRental(rentalId: string) {
      this.rentalService.getRentalById(rentalId).subscribe(
        (rental: Rental) => {
          this.rental = rental
        }
      )
    }

    updateRental(rentalForm: NgForm) {
      this.rentalService.updateRental(this.rental._id, this.rental).subscribe(
        (updatedRental) => {
          this.showSwalSuccess()
        },
        (err) => { }
      )
    }

    private showSwalSuccess() {
        Swal.fire({
            // title: 'User infomation has been updated!',
            text: '商品情報を更新しました！',
            type: 'success',
            confirmButtonClass: "btn btn-primary btn-round btn-lg",
            buttonsStyling: false,
            timer: 5000
        }).then(() => {
          this.router.navigate(['/rentals/manage'])
        })
    }
}
