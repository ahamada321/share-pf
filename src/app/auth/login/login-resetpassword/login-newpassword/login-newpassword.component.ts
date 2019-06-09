import { Component, OnInit, OnDestroy } from '@angular/core'
import { MyOriginAuthService } from '../../../service/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-login-newpassword',
  templateUrl: './login-newpassword.component.html',
  styleUrls: ['./login-newpassword.component.scss']
})
export class LoginNewPasswordComponent implements OnInit, OnDestroy {
  footer: Date = new Date();

  focus: any;
  focus1: any;
  focus2: any;

  formData: any = {}
  errors: any[] = []
  verifyToken: any

  constructor(private auth: MyOriginAuthService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

    this.route.params.subscribe(
      (params) => {
        this.verifyToken = params['verifyToken']
    })
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  setNewPassword() {
    this.auth.setNewPassword(this.formData, this.verifyToken).subscribe(
      () => {
        this.router.navigate(['/login', {password: 'updated'}])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
