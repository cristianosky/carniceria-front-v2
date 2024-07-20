import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined ? true : false;
    // console.log('isAuthenticated', isAuthenticated);
    
    if (isAuthenticated) {
      return true;
    } else {
      // Redirige al usuario a la página de login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
