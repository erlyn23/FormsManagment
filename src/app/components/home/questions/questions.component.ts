import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { QuestionsService } from '@services/questions.service';
import { UtilityService } from '@services/utility.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { QuestionFormDialogComponent } from '@shared/components/question-form-dialog/question-form-dialog.component';
import { FormDto } from '@shared/models/form-dto';
import { QuestionDto } from '@shared/models/question-dto';
import { ResponseDto } from '@shared/models/response-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {

  form: FormDto;

  questions: QuestionDto[] = [];
  subscriptions$: Subscription[] = [];

  navigationExtras: NavigationExtras = { state: { question: null } }

  constructor(private questionService: QuestionsService,
    private dialog: MatDialog,
    private utilityService: UtilityService,
    private router: Router) { 
    const navExtras = this.router.getCurrentNavigation().extras.state?.form;
    this.form = navExtras;
  }

  ngOnInit(): void {
    if(this.form === undefined) this.router.navigate(['/dashboard']);
    else this.getQuestions();
  }

  getQuestions(){
    this.questionService.resetUrl();
    this.questionService.setUrlExtension(`${this.form.formId}`);
    this.questionService.get().subscribe((result: ResponseDto<QuestionDto[]>)=>{
      if(result.status === 200){
        this.questions = result.data;
      }
    });
  }

  openAddDialog(data: QuestionDto){
    
    const title = (data !== null) ? 'Editar pregunta' : 'Crear pregunta';

    const dialogRef = this.dialog.open(QuestionFormDialogComponent,{
      width: '300px',
      data: { viewTitle: title, question: data }
    });

    if(data === null){
      this.subscriptions$.push(
        dialogRef.afterClosed().subscribe(result=>{
          if(result){
            const question: QuestionDto = {
              formId: this.form.formId,
              questionTypeId: result.questionTypeId,
              title: result.title
            }
    
            this.questionService.resetUrl();
            this.subscriptions$.push(
              this.questionService.post(question).subscribe((result: QuestionDto)=>{
                if(result) this.utilityService.openSnackBar('Pregunta guardada', 'Ok', 'success-snackbar')
                this.getQuestions();
              })
            );
          }
        })
      );
    }
    else{
      this.subscriptions$.push(
        dialogRef.afterClosed().subscribe(result=>{
          if(result){
            const questionDto: QuestionDto ={
              questionId: data.questionId,
              formId: this.form.formId,
              questionTypeId: result.questionTypeId,
              title: result.title
            };
            this.questionService.resetUrl();
            this.subscriptions$.push(
              this.questionService.patch(questionDto).subscribe((result: ResponseDto<QuestionDto>)=>{
                if(result.status === 200){
                  this.utilityService.openSnackBar('Pregunta editada', 'Ok', 'success-snackbar');
                  this.getQuestions();
                }else{
                  this.utilityService.openSnackBar(result.errorMessage, 'Ok', 'error-snackbar');
                }
              })
            )
          }
        })
      )
    }
  }

  openConfirmDeleteDialog(question: QuestionDto){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { viewTitle: 'Confirmar', message: '¿Estás seguro de querer eliminar esta pregunta? No podrás recuperarla.' }
    });

    this.subscriptions$.push( 
     dialogRef.afterClosed().subscribe(result=>{
        if(result){
          this.questionService.resetUrl();
          this.questionService.setUrlExtension(`${question.questionId}`);
          this.subscriptions$.push(
            this.questionService.delete().subscribe((response:ResponseDto<any>)=>{
              if(response.status === 200){
                this.utilityService.openSnackBar(response.data.message, 'Ok', 'success-snackbar');
                this.getQuestions();
              }else{
                this.utilityService.openSnackBar(response.errorMessage, 'Ok', 'error-snackbar');
              }
            })
          );
        }
      })
    );
  }

  goToQuestionDetail(question: QuestionDto){
    this.navigationExtras.state.question = question;
    this.router.navigate(['/question-options'], this.navigationExtras);
  }

  ngOnDestroy():void{
    this.subscriptions$.forEach(subscription=> subscription.unsubscribe());
  }
}
