import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyOriginAuthService } from '../service/auth.service';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isFBloggedIn: boolean
  pressedFBButton: boolean = false
  footer: Date = new Date();
  user: any

  focus: any;
  focus1: any;

  loginForm: FormGroup
  errors: any[] = []
  notifyMessage: string = ''

  constructor(private formBuilder: FormBuilder,
              private auth: MyOriginAuthService,
              private socialAuthService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private zone: NgZone,
              private ref:ChangeDetectorRef ) { }

  ngOnInit() {
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.add('navbar-transparent');

    this.seeFBLoginState()
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
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.remove('navbar-transparent');
    
  }

  signInWithFB() {
    if(!this.user) {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
      this.pressedFBButton = true
    } else {
      this.auth.FBlogin(this.user).subscribe(
        (token) => {
          this.router.navigate(['/rentals'])
        },
        (errorResponse: HttpErrorResponse) => {
          // this.zone.run(() => { // In order to detect changes here immidiately.
          //   this.errors = errorResponse.error.errors
          // })
          this.errors = errorResponse.error.errors
          this.ref.detectChanges() // In order to detect changes here immidiately.
        }
      )
    }
  } 

  seeFBLoginState() {
    return this.socialAuthService.authState.subscribe((user) => {
      this.user = user
      this.isFBloggedIn = (this.user != null);

      if(this.pressedFBButton && this.user) {
        this.signInWithFB()
      }
    })
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
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }

  showSwalSuccess() {
    Swal.fire({
        title: 'Password has been updated!',
        text: '新しいパスワードでログインできます！',
        type: 'success',
        confirmButtonClass: "btn btn-primary btn-round btn-lg",
        buttonsStyling: false,
        timer: 5000
    })
  }
}
