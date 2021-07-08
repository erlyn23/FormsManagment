import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AccountRequest } from '@shared/models/account-request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  image: string = "";
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

  private initForm(): void{
    this.registerForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  uploadImage(image){
    let file = image.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      this.image = reader.result.toString();
      document.getElementById("profileImage").style.display = "initial";
      document.getElementById("profileImage").setAttribute("src", reader.result.toString());
    };
    reader.onerror = (error)=>{
      console.log(error);
    }
  }

  registerUser(): void{
    if(this.registerForm.valid){
      const newUser: AccountRequest = this.registerForm.value;
      newUser.profilePhoto = this.image;
      this._authSvc.saveUser(newUser).subscribe(result=>{
        if(result){
          this._snackBar.open('Usuario guardado correctamente', 'Ok', {duration: 3000, panelClass: 'success-snackbar'})
          this._router.navigate(['login']);
        }
      },
      error=>{
        if(error.error.errors){
          if(error.error.errors.email){
            for(let err of error.error.errors.Email){
              this._snackBar.open(err, 'Ok', {duration: 3000, panelClass: 'error-snackbar'});
            }
          }
          if(error.error.ExceptionMessage){
            this._snackBar.open(error.error.ExceptionMessage, 'Ok', { duration: 3000, panelClass: 'error-snackbar' });
          }
        }
      });
    }
  }

}
