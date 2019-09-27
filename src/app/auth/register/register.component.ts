import { Component, OnInit, OnDestroy } from '@angular/core'
import { MyOriginAuthService } from '../service/auth.service'
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { User } from 'src/app/user/service/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isFBloggedIn: boolean

  focus: any;
  focus1: any;
  focus2: any;
  focus3: any;

  formData: User = new User()
  errors: any[] = []

  constructor( private auth: MyOriginAuthService, 
               private socialAuthService: AuthService,
               private router: Router ) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
        body.classList.add('full-screen');
        body.classList.add('register');
    // let navbar = document.getElementsByTagName('nav')[0];
    //     navbar.classList.add('navbar-transparent');


    this.seeFBLoginState()
  }
  
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
        body.classList.remove('full-screen');
        body.classList.remove('register');
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.remove('navbar-transparent');

  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 

  seeFBLoginState() {
    return this.socialAuthService.authState.subscribe((user) => {
      if(user) {
        this.formData.FBuserID = user.id
        this.formData.username = user.name
        this.formData.email = user.email
      }
      this.isFBloggedIn = (user != null)
    })
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
}
