import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contactform } from '../service/contactform.model';
import { ContactformService } from '../service/contactform.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {
  focus: any;
  focus1: any;
  contactForm: FormGroup
  formData: Contactform;
  errors: any[] = []

  constructor(private formBuilder: FormBuilder,
              private contactformService: ContactformService ) { }

  ngOnInit() {
    this.initForm()
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  initForm() {
    this.contactForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', 
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]],
      msg: ['', Validators.required]
    })
  }

  isInvlidForm(fieldname): boolean {
    return this.contactForm.controls[fieldname].invalid && 
           this.contactForm.controls[fieldname].touched
          //  (this.contactForm.controls[fieldname].dirty || 
          //  this.contactForm.controls[fieldname].touched)
  }


  sendMessage(contactForm) {
    this.contactformService.sendFormMsg(contactForm.value).subscribe(
      (Message) => {
        contactForm.reset()
        this.showSwalSuccess()
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }

  private showSwalSuccess() {
    Swal.fire({
        // title: 'User infomation has been updated!',
        text: '送信されました！',
        type: 'success',
        confirmButtonClass: "btn btn-primary btn-round btn-lg",
        buttonsStyling: false,
        timer: 5000
    })
}
}
