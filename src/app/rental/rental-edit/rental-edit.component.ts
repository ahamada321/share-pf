import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { RentalService } from '../service/rental.service';
import { Rental } from '../service/rental.model';


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
      {"id":1,"itemName":"ウエディング"},
      {"id":2,"itemName":"フラワー"},
      {"id":3,"itemName":"２次会"},
      {"id":4,"itemName":"その他"}
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
