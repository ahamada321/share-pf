import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../../service/rental.service';
import { Rental } from '../../service/rental.model';

@Component({
  selector: 'app-rental-detail-update',
  templateUrl: './rental-detail-update.component.html',
  styleUrls: ['./rental-detail-update.component.scss']
})

export class RentalDetailUpdateComponent implements OnInit {

  rental: Rental
  rentalCategories: string[] = Rental.CATEGORIES

  constructor(private route: ActivatedRoute,
              private rentalService: RentalService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.getRental(params['rentalId'])
      })
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental: Rental) => {
        this.rental = rental;
      }
    )
  }

  
  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
      (updatedRental: Rental) => {
        // Update component entity field text after save to DB
        this.rental = updatedRental
      },
      () => {

      }
    )
  }

}
