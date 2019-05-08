import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit, OnDestroy {
  focus: any;
  focus1: any;

  constructor() { }

  ngOnInit() {
      // var navbar = document.getElementsByTagName('nav')[0];
      // navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy(){
      // var navbar = document.getElementsByTagName('nav')[0];
      // navbar.classList.remove('navbar-transparent');
  }

}
