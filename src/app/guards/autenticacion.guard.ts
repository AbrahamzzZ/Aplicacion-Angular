import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Injectable({
    providedIn: 'root'
  })
  export class Autenticacion implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean {
      const token = this.loginService.obtenerToken();
  
      if (token) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }