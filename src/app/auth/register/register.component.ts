import { Component, OnInit, OnDestroy, NgZone } from '@angular/core'
import { AuthService } from '../service/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { User } from 'src/app/user/services/user.model';

declare var FB: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isFBbuttonClicked: boolean = false

  focus: any;
  focus1: any;
  focus2: any;
  focus3: any;

  formData: User = new User()
  errors: any[] = []

  constructor( private auth: AuthService, 
               private router: Router,
               private zone: NgZone ) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
        body.classList.add('full-screen');
        body.classList.add('register');
    let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');


    this.initFBwindow()
  }
  
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
        body.classList.remove('full-screen');
        body.classList.remove('register');
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  initFBwindow() {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '802750546764836',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.3'
      });
      FB.AppEvents.logPageView();   
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  register() {
    this.auth.register(this.formData).subscribe(
      () => {
        this.router.navigate(['/register/sent'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }

  FBregister() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.getFBUserInfomation()
      } else {
        // this.errors = [{title: "Authorization error!", detail: "User cancelled login or did not fully authorize."}]
        this.isFBbuttonClicked = false  
      }
    })
  }

  private getFBUserInfomation() {
    FB.api('/me', {field: 'id,name,email'},
    (response) => {
      this.zone.run(() => { // In order to detect changes here immidiately.
        this.formData.FBuserID = response.id
        this.formData.username = response.name
        this.isFBbuttonClicked = true
      })
    })
  }

}
