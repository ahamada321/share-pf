import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'

declare var FB: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isFBbuttonClicked: boolean = false
  test : Date = new Date();

  focus: any;
  focus1: any;

  loginForm: FormGroup
  errors: any[] = []
  notifyMessage: string = ''

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private zone: NgZone ) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.initFBLogin()
    this.initForm()
    this.route.params.subscribe(
      (params) => {
        if(params['registered'] == 'pre-success') {
          this.notifyMessage = "登録したEメールアドレスにアクティベーションリンクをお送りしました。受信メールのリンクをクリックしてアカウントを有効化してください。"
        } else if(params['registered'] == 'success') {
          this.notifyMessage = "アクティベーションが完了しました！ご登録いただいたEメールアドレスとパスワードでログインできます！"
        } else if(params['password'] == 'updated') {
          // this.notifyMessage = "パスワードが再設定されました！新しいパスワードでログインできます！"
          this.showSwalSuccess()
        }
    })
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  initFBLogin() {
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

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', 
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]],
      password: ['', Validators.required]
    })
  }

  isInvlidForm(fieldname): boolean {
    return this.loginForm.controls[fieldname].invalid && 
           (this.loginForm.controls[fieldname].dirty || 
           this.loginForm.controls[fieldname].touched)
  }

  login() {
    this.isFBbuttonClicked = false
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }

  FBLogin() {
    this.isFBbuttonClicked = true
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') { // If passed FB authorization
        this.auth.FBlogin(response.authResponse).subscribe(
          (token) => {
            this.router.navigate(['/rentals'])
          },
          (errorResponse: HttpErrorResponse) => {
            this.zone.run(() => { // In order to detect changes here immidiately.
              this.errors = errorResponse.error.errors
            })
          }
        )
      }
    })
  }

  showSwalSuccess() {
    Swal.fire({
        title: 'Password has been updated!',
        text: 'You can login with new password!',
        type: 'success',
        confirmButtonClass: "btn btn-primary btn-round btn-lg",
        buttonsStyling: false,
        timer: 5000
    })
  }
}
