import { Component, OnInit, OnDestroy } from '@angular/core';
import { RentalService } from '../service/rental.service';
import { Rental } from '../service/rental.model';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit, OnDestroy {

  rentals: Rental[] = []

  constructor(private rentalService: RentalService) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

    const rentalObservable = this.rentalService.getRentals()

    rentalObservable.subscribe(
      (rentals: Rental[]) => {
        this.rentals = rentals
      },
      (err) => { }
    )
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }
}
