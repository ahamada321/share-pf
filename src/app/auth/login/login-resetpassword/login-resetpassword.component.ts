import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../service/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-resetpassword',
  templateUrl: './login-resetpassword.component.html',
  styleUrls: ['./login-resetpassword.component.scss']
})
export class LoginResetpasswordComponent implements OnInit {

  loginForm: FormGroup
  errors: any[] = []
  notifyMessage: string = ''

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.initForm()
    this.route.params.subscribe(
      (params) => {
        if(params['registered'] == 'pre-success') {
          this.notifyMessage = "登録したEメールアドレスにアクティベーションリンクをお送りしました。受信メールのリンクをクリックしてアカウントを有効化してください。"
        } else if(params['registered'] == 'success') {
          this.notifyMessage = "アクティベーションが完了しました！ご登録いただいたEメールアドレスとパスワードでログインできます！"
        }
    })
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', 
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]]
    })
  }

  isInvlidForm(fieldname): boolean {
    return this.loginForm.controls[fieldname].invalid && 
           (this.loginForm.controls[fieldname].dirty || 
           this.loginForm.controls[fieldname].touched)
  }

  sendResetEmail() {
    this.auth.sendPasswordResetLink(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/login/reset/sent'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
