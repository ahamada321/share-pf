import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    let body = document.getElementsByTagName('body')[0];
        body.classList.add('about-us');
  }
  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    let body = document.getElementsByTagName('body')[0];
        body.classList.remove('about-us');
  }

}
