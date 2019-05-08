import { Component, OnInit } from '@angular/core'
import { AuthService } from '../service/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  focus: any;
  focus1: any;
  focus2: any;

  formData: any = {}
  errors: any[] = []

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

  }

  register() {
    this.auth.register(this.formData).subscribe(
      () => {
        this.router.navigate(['/thanks'])
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
