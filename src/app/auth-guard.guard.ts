import { AuthService, Roles, UserModel } from './auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  roles: Observable<Roles> | undefined;
  admin: Roles | undefined;
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let result = false;
    let roles = localStorage.getItem('roles');
    if (roles != null) this.admin = JSON.parse(roles) as Roles;
    if (this.admin?.isAdmin) {
      result = true;
    } else {
      result = false;
      throw Error('not an admin');
    }
    return result;
  }
}
