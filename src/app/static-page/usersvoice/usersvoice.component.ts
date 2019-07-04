import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-usersvoice',
  templateUrl: './usersvoice.component.html',
  styleUrls: ['./usersvoice.component.scss']
})
export class UsersVoiceComponent implements OnInit, OnDestroy {

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
