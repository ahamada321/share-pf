import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-userguide',
  templateUrl: './userguide.component.html',
  styleUrls: ['./userguide.component.scss']
})
export class UserguideComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

}
