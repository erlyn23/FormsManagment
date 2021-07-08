import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AccountResponse } from '@shared/models/account-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authSvc: AuthService, private _router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot) {
    const user: AccountResponse = this._authSvc.userData;

    if(user){
      return true;
    }
    this._router.navigate(['login']);
    return false;
  }
  
}
