import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-share-form',
  templateUrl: './share-form.component.html',
  styleUrls: ['./share-form.component.scss']
})
export class ShareFormComponent implements OnInit {

  formUrl: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<ShareFormComponent>,
  private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.formUrl = this.data?.formUrl;
  }

  onNoClick():void{
    this.dialogRef.close();
  }

  onCopy(){
    this.utilityService.openSnackBar('Formulario copiado', 'Ok', 'success-snackbar');
  }

}
