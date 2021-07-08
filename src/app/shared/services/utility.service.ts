import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private snack: MatSnackBar) { }

  openSnackBar(message: string, action: string, classType: string){
    this.snack.open(message, action,{
      duration: 3000,
      panelClass: classType
    });
  }
}
