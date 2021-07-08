import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountRequest } from '@shared/models/account-request';
import { AccountResponse } from '@shared/models/account-response';
import { AuthRequest } from '@shared/models/auth-request';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<AccountResponse>;
  user$: Observable<AccountResponse>;

  private ACCOUNT_URL: string = environment.endpoints.account;
  constructor(private _http: HttpClient, private _router: Router) {
    this.userSubject = new BehaviorSubject<AccountResponse>(JSON.parse(localStorage.getItem('user')));
    this.user$ = this.userSubject.asObservable();
  }

  public get userData(): AccountResponse{
    return this.userSubject.value;
  }

  saveUser(user: AccountRequest): Observable<AccountRequest>{
    return this._http.post<AccountRequest>(this.ACCOUNT_URL, user, {headers: new HttpHeaders({"content-type": "application/json"})});
  }

  login(auth: AuthRequest): Observable<AccountResponse>{
    return this._http.post<AccountResponse>(`${this.ACCOUNT_URL}/login`, auth, {headers: new HttpHeaders({"content-type": "application/json"})})
    .pipe(map(response=>{
      if(response){
        const user: AccountResponse = response;
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }
      return response;
    }));
  }

  logOut(){
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this._router.navigate(['login']);
  }
}
