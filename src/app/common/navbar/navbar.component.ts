import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { AuthService } from "angularx-social-login";
import { Router } from '@angular/router';

import { PaymentService } from '../components/payment/services/payment.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    payments: any[]

    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(
            public location: Location, 
            private element : ElementRef,
            public auth: MyOriginAuthService,
            private socialAuthService: AuthService,
            private router: Router,
            private paymentService: PaymentService
        ) 
        {
            this.sidebarVisible = false;
        }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    getPendingPayments() { // Need to findout the way to call this when payments.length changes.
        this.paymentService.getPendingPayments().subscribe(
            (payments: any) => {
                this.payments = payments
            },
            () => { }
        )
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    logout() {
        this.socialAuthService.signOut()
        this.auth.logout()
        this.router.navigate(['/'])
    }
}
