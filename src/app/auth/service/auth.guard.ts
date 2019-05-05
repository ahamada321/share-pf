import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  private handleAuthState(): boolean {
      return
  }

  private handleNotAuthState(): boolean {
    return
}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

//    return this.checkLogin(url);

    if(this.auth.isAuthenticated()) {
        return this.handleAuthState()
    }
    return this.handleNotAuthState()
  }


//   checkLogin(url: string): boolean {
//     if (this.auth.isLoggedIn) { return true; }

//     // Store the attempted URL for redirecting
//     this.auth.redirectUrl = url;

//     // Navigate to the login page with extras
//     this.router.navigate(['/login']);
//     return false;
//   }

}