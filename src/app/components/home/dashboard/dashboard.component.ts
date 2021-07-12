import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { FormsService } from '@services/forms.service';
import { AddDialogComponent } from '@shared/components/add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ShareFormComponent } from '@shared/components/share-form/share-form.component';
import { FormDto } from '@shared/models/form-dto';
import { ResponseDto } from '@shared/models/response-dto';
import { UserDecoded } from '@shared/models/user-decoded';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userId: number;
  forms: FormDto[] = [];
  subscriptions$: Subscription[] = [];

  navigationExtras: NavigationExtras = { state: { form: null } };

  constructor(private formsService: FormsService, 
    private authService: AuthService,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    const user: UserDecoded = jwtDecode(this.authService.userData.token);
    this.userId = parseInt(user.id);

    this.getForms();
  }

  getForms(){
    this.formsService.resetUrl();
    this.formsService.setUrlExtension(`${this.userId}`);
    this.formsService.get().subscribe((response: ResponseDto<FormDto[]>)=> {
      if(response.status === 200) this.forms = response.data;
    });
  }

  showAddFormDialog(data: FormDto): void{

    let dialogRef;
    if(data !== null){
      dialogRef = this.matDialog.open(AddDialogComponent,{
        width: '300px',
        data: { title: 'Editar formulario', value: data }
      })
    }else{
      dialogRef = this.matDialog.open(AddDialogComponent, {
        width: '350px',
        data: { title: 'Añadir nuevo formulario' }
      });
    }

    this.subscriptions$.push(dialogRef.afterClosed().subscribe(result=>{
      if(result){
        if(data === null){
          const formDto: FormDto = {
            title: result.title,
            description: result.description,
            name: result.name+"etvcreate",
            userId: this.userId
          }
          this.formsService.resetUrl();
          this.subscriptions$.push(this.formsService.post(formDto).subscribe((result: ResponseDto<FormDto>)=>{
            if(result !== undefined){
              this.matSnack.open('Formulario guardado correctamente', 'Ok',{
                duration: 3000,
                panelClass: 'success-snackbar'
              });
              this.getForms();
            }
          }, error=>{
            this.matSnack.open(error.error, 'Ok', {
              duration: 3000,
              panelClass: 'error-snackbar'
            })
          }));
        }
        else{
          const formDto: FormDto = {
            formId: data.formId,
            userId: data.userId,
            title: result.title,
            name: result.name+"etvupdate",
            description: result.description
          };
          this.formsService.resetUrl();
          this.subscriptions$.push(this.formsService.patch(formDto).subscribe((result: ResponseDto<FormDto>)=>{
            if(result.status === 200){
              this.matSnack.open('Formulario editado correctamente', 'Ok', {
                duration: 3000,
                panelClass: 'success-snackbar'
              });
              this.getForms();
            }else{
              this.matSnack.open(result.errorMessage, 'Ok',{
                duration: 3000,
                panelClass: 'error-snackbar'
              });
            }
          }));
        }
      }
    }));
  }

  showConfirmDeleteDialog(formId: number){
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmar', message: '¿Estás seguro de querer eliminar este formulario? No lo podrás recuperar' }
    });

    this.subscriptions$.push(dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.formsService.resetUrl();
        this.formsService.setUrlExtension(`${formId}`);
        this.subscriptions$.push(this.formsService.delete().subscribe((result:ResponseDto<any>)=>{
          if(result.status === 200){
            this.matSnack.open('Formulario eliminado correctamente', 'Ok', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.getForms();
          }else{
            this.matSnack.open(result.errorMessage, 'Ok', {
              duration: 3000,
              panelClass: 'error-snackbar'
            })
          }
        }));
      }
    }));
  }

  showShareFormDialog(formId: number): void{
    const dialogRef = this.matDialog.open(ShareFormComponent,{
      width: '450px',
      data: { formUrl: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/view-form?formId=${formId}` }
    });
  }

  goToQuestions(form: FormDto){
    this.navigationExtras.state.form = form;
    this.router.navigate(['/questions'], this.navigationExtras);
  }

  ngOnDestroy(): void {
    if(this.subscriptions$ !== undefined){
      this.subscriptions$.forEach(subscription=> subscription.unsubscribe());
    }
  }

}
