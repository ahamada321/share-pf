import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';

declare const $: any;


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
    test : Date = new Date();
    
    model = {
        left: true,
        middle: false,
        right: false
    };

    focus: any;
    focus1: any;
    focus2: any;
  
    formData: any = {}
    errors: any[] = []
  
    constructor(
        public el: ElementRef,
        private auth: AuthService, 
        private router: Router) { }
  
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
       const componentPosition = document.getElementsByClassName('add-animation');
       const scrollPosition = window.pageYOffset;
       
       for(var i = 0; i < componentPosition.length; i++) {
           var rec = componentPosition[i].getBoundingClientRect().top + window.scrollY + 100;
           if ( scrollPosition + window.innerHeight >= rec ) {
               componentPosition[i].classList.add('animated');
           } else if ( scrollPosition + window.innerHeight * 0.8 < rec ) {
               componentPosition[i].classList.remove('animated');
           }
       }
    }
   ngOnInit() {
       var body = document.getElementsByTagName('body')[0];
       body.classList.add('presentation-page');
       body.classList.add('loading');
       var navbar = document.getElementsByTagName('nav')[0];
       navbar.classList.add('navbar-transparent');

       // IsoGrid(document.querySelector('.isolayer--deco1'), {
       //     transform : 'translateX(33vw) translateY(-340px) rotateX(45deg) rotateZ(45deg)',
       //     stackItemsAnimation : {
       //         // properties(pos) {
       //         //     return {
       //         //         translateZ: (pos + 1) * 30,
       //         //         rotateZ: Math.floor(Math.random() * (4 - (-4) + 1)) + (-4)
       //         //     };
       //         // },
       //         options(pos, itemstotal) {
       //             return {
       //                 type: dynamics.bezier,
       //                 duration: 500,
       //                 points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}],
       //                 delay: (itemstotal-pos-1)*40
       //             };
       //         }
       //     }
       // });
   }
   ngOnDestroy(){
       var body = document.getElementsByTagName('body')[0];
       body.classList.remove('presentation-page');
       body.classList.remove('loading');
       var navbar = document.getElementsByTagName('nav')[0];
       navbar.classList.remove('navbar-transparent');
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
