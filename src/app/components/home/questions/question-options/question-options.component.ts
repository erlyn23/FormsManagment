import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionOptionsService } from '@services/question-options.service';
import { UtilityService } from '@services/utility.service';
import { QuestionDto } from '@shared/models/question-dto';
import { QuestionOptionDto } from '@shared/models/question-option-dto';
import { ResponseDto } from '@shared/models/response-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question-options',
  templateUrl: './question-options.component.html',
  styleUrls: ['./question-options.component.scss']
})
export class QuestionOptionsComponent implements OnInit, OnDestroy{

  question: QuestionDto;
  subscriptions$: Subscription[] = [];

  tempQuestionOptionsDto: QuestionOptionDto[] = [];

  constructor(private questionOptionsService: QuestionOptionsService,
    private utilityService: UtilityService,
    private router: Router) { 
    const navExtras = this.router.getCurrentNavigation().extras;
    this.question = navExtras.state?.question;
  }

  ngOnInit(): void {
    if(!this.question) this.router.navigate(['/dashboard']);

    this.getQuestionOptions();
  }

  getQuestionOptions(){

    const questionTypeId = this.question?.questionTypeId;
    
    if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 6 || questionTypeId === 7)
      this.caseInputAndParagraph();
    else
      this.caseRadiosAndChecks();
  }

  caseInputAndParagraph(){
    this.questionOptionsService.resetUrl();
    this.questionOptionsService.setUrlExtension(`${this.question?.questionId}`);
    this.questionOptionsService.get().toPromise().then((response:ResponseDto<QuestionOptionDto[]>)=>{
      if(response.data.length === 0){
        const questionOptionDto: QuestionOptionDto = {
          questionId: this.question.questionId,
          title: this.question.title
        }
        this.questionOptionsService.resetUrl();
        this.questionOptionsService.post(questionOptionDto).toPromise().then((result: QuestionOptionDto)=>{
          if(result){
            this.utilityService.openSnackBar('Pregunta elaborada correctamente', 'Ok', 'success-snackbar');
          }
        },
        error=>{
          console.log(error);
          this.utilityService.openSnackBar('Error al elaborar pregunta', 'Ok', 'error-snackbar');
        })
      }
    });
  }

  caseRadiosAndChecks(){
    this.questionOptionsService.resetUrl();
    this.questionOptionsService.setUrlExtension(`${this.question?.questionId}`);
    this.subscriptions$.push(
      this.questionOptionsService.get().subscribe((response: ResponseDto<QuestionOptionDto[]>)=>{
        if(response.status === 200) this.tempQuestionOptionsDto = response.data;
        else this.utilityService.openSnackBar('Error al obtener opciones', 'Ok', 'error-snackbar');
      })
    );
  }

  addTempQuestionOption(){
    this.tempQuestionOptionsDto.push({
      questionId: this.question.questionId,
      title: ''
    });
  }

  removeTempQuestionOption(index: number){
    if(this.tempQuestionOptionsDto[index].questionOptionId !== undefined){
      this.questionOptionsService.resetUrl();
      this.questionOptionsService.setUrlExtension(`${this.tempQuestionOptionsDto[index].questionOptionId}`);
      this.questionOptionsService.delete().subscribe((response:ResponseDto<string>)=>{
        if(response.status === 200){
          this.caseRadiosAndChecks();
        }
        else this.utilityService.openSnackBar('Error al eliminar opción', 'Ok', 'error-snackbar');
      });
    }
    else this.tempQuestionOptionsDto.splice(index, 1);
  }

  saveChanges(ev, index: number){

    const questionOption = this.tempQuestionOptionsDto[index];

    this.questionOptionsService.resetUrl();

    if(questionOption.questionOptionId !== undefined){
      this.questionOptionsService.patch(questionOption).toPromise().then((response: ResponseDto<QuestionOptionDto>)=>{
        if(response.status === 200){
          this.utilityService.openSnackBar('Cambios guardados', 'Ok', 'success-snackbar');
        }else this.utilityService.openSnackBar('Error al guardar cambios', 'Ok', 'error-snackbar');
      });
    }else{
      this.questionOptionsService.post(questionOption).toPromise().then((response: QuestionOptionDto)=>{
        if(response){
          this.utilityService.openSnackBar('Cambios guardados', 'Ok', 'success-snackbar');
        }else{
          this.utilityService.openSnackBar('Error al guardar cambios', 'Ok', 'error-snackbar');
        }
      });
    }
  }

  ngOnDestroy(){
    this.subscriptions$.forEach(subscription=>{
      subscription.unsubscribe();
    });
  }

}
