import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.remove('navbar-transparent');
  }

}
