import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    let role = next.data['role'] as Array<Role>;
    console.log(role[1]);
    for (let i = 0; i < role.length; i++) {
      if (this.authService.hasRole(role[i])) {
        return true;
      }
    }

    swal.fire('Acceso Denegado', 'No tienes acceso a este recurso', 'warning');
    this.router.navigate(['/productos']);
    return false;
  }

}
