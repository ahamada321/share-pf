import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contactform } from '../../common/components/form/service/contactform.model';
import { ContactformService } from '../../common/components/form/service/contactform.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    // let navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.remove('navbar-transparent');
  }
}
