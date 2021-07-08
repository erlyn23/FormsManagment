import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AuthRequest } from '@shared/models/auth-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private _formBuilder: FormBuilder, 
    private _authSvc: AuthService, 
    private _router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(this._authSvc.userData){
      this._router.navigate(['dashboard']);
    }
    this.initForm();
  }

  private initForm():void{
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    })
  }

  login():void{
    if(this.loginForm.valid){
      const accountReq: AuthRequest = this.loginForm.value;
      this._authSvc.login(accountReq).subscribe(response=>{
        if(response){
          this._router.navigate(['dashboard']);
        }
      },
      error=>{
        if(error.error.ExceptionMessage){
          this._snackBar.open(error.error.ExceptionMessage, 'Ok', { duration: 3000, panelClass: 'error-snackbar' });
        }
      });
    }
  }

}
