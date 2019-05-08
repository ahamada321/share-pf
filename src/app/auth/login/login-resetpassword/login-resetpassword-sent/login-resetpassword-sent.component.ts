import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'app-login-resetpassword-sent',
  templateUrl: './login-resetpassword-sent.component.html',
  styleUrls: ['./login-resetpassword-sent.component.scss']
})
export class LoginResetpasswordSentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

  }

}
