import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    userData: any
    state_info = true;
    state_info1 = true;
    third_switch = true;

    data : Date = new Date();

    constructor(private auth: AuthService) { }

    ngOnInit() {
        this.getUser()

        let body = document.getElementsByTagName('body')[0];
        body.classList.add('settings');
        let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
    }
    ngOnDestroy(){
        let body = document.getElementsByTagName('body')[0];
        body.classList.remove('settings');
        let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    getUser() {
        const userId = this.auth.getUserId()
        this.auth.getUserById(userId).subscribe(
          (foundUser) => {
            this.userData = foundUser
          },
          (err) => { }
        )
    }

    updateUser(userForm: NgForm) {
        this.auth.updateUser(this.userData._id, userForm.value).subscribe(
          (UserUpdated) => {
            userForm.reset(userForm.value)
            this.showSwalSuccess()
          },
          (err) => { }
        )
    }

    private showSwalSuccess() {
        Swal.fire({
            // title: 'User infomation has been updated!',
            text: 'User infomation has been updated!',
            type: 'success',
            confirmButtonClass: "btn btn-primary btn-round btn-lg",
            buttonsStyling: false,
            timer: 5000
        })
    }
    
}
