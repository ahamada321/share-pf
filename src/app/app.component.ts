import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';

import { NavbarComponent } from './common/navbar/navbar.component';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private _router: Subscription;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor( 
    private renderer : Renderer, 
    private router: Router, 
    @Inject(DOCUMENT,) private document: any, 
    private element : ElementRef, 
    public location: Location) {}
    
  ngOnInit() { // For header animation
      var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
      this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
          if (window.outerWidth > 991) {
              window.document.children[0].scrollTop = 0;
          }else{
              window.document.activeElement.scrollTop = 0;
          }
          this.navbar.sidebarClose();
      });
      this.renderer.listenGlobal('window', 'scroll', (event) => {
          const number = window.scrollY;
          const _location = this.location.path();
          const isLocationOfBooking = ( _location.split('/')[3] === 'booking' );
          const isLocationOfRevenue = ( _location.split('/')[2] === 'revenue' );
          const isLocationOfNew = ( _location.split('/')[2] === 'new' );

          if (number > 150 || window.pageYOffset > 150) {
              // add logic
              navbar.classList.remove('navbar-transparent');
          } else if (!isLocationOfBooking && !isLocationOfRevenue && !isLocationOfNew) {
              // remove logic
              navbar.classList.add('navbar-transparent');
          }
      });
      var ua = window.navigator.userAgent;
      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
      if (version) {
          var body = document.getElementsByTagName('body')[0];
          body.classList.add('ie-background');

      }

  }
  removeFooter() { // For Footer
      let titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(titlee === 'register' || titlee === 'login'){
          return false;
      }
      else {
          return true;
      }
  }
}
