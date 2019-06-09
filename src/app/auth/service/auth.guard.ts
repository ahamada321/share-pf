import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MyOriginAuthService }      from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private url: string

  constructor(private MyOriginAuthService: MyOriginAuthService, 
              private router: Router) {}

  private handleAuthState(): boolean {
    if(this.isLoginOrRegisterdPage()) {
      this.router.navigate(['/rentals'])
      return false
    }
    return true
  }

  private handleNotAuthState(): boolean {
    if(this.isLoginOrRegisterdPage()) {
      return true
    }
    this.router.navigate(['/login'])
    return false
  }

  private isLoginOrRegisterdPage(): boolean {
    if(this.url.includes('login') || this.url.includes('register')) {
      return true
    }
    return false
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    this.url = state.url;
    if(this.MyOriginAuthService.isAuthenticated()) {
      return this.handleAuthState()
    }
    return this.handleNotAuthState()
  }

}