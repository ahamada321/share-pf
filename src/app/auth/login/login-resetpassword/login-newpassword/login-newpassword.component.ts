import { Component, OnInit } from '@angular/core'
import { AuthService } from '../../../service/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-login-newpassword',
  templateUrl: './login-newpassword.component.html',
  styleUrls: ['./login-newpassword.component.scss']
})
export class LoginNewPasswordComponent implements OnInit {

  formData: any = {}
  errors: any[] = []
  verifyToken: any

  constructor(private auth: AuthService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.verifyToken = params['verifyToken']
    })
  }

  setNewPassword(token: any) {
    this.auth.setNewPassword(this.formData, token).subscribe(
      () => {
        this.router.navigate(['/login', {password: 'updated'}])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
