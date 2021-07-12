import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnswerService } from "@services/answer.service";
import { AuthService } from "@services/auth.service";
import { FormsService } from "@services/forms.service";
import { QuestionsService } from "@services/questions.service";
import { UserFormAnswerService } from "@services/user-form-answer.service";
import { UtilityService } from "@services/utility.service";
import { AnswerDto } from "@shared/models/answer-dto";
import { FormDto } from "@shared/models/form-dto";
import { QuestionDto } from "@shared/models/question-dto";
import { QuestionOptionDto } from "@shared/models/question-option-dto";
import { ResponseDto } from "@shared/models/response-dto";
import { UserDecoded } from "@shared/models/user-decoded";
import jwtDecode from "jwt-decode";
import { Subscription } from "rxjs";


const TOKEN = JSON.parse(localStorage.getItem('user'))?.token;

@Component({
    selector: 'app-view-form',
    templateUrl: './view-form.component.html',
    styleUrls: ['./view-form.component.scss']
})
export class ViewFormComponent implements OnInit, OnDestroy{

    formId: number;
    subscriptions$: Subscription[] = [];

    form: FormDto;
    questions: QuestionDto[] = [];

    answers: AnswerDto[] = [];
    checkboxAnswers: QuestionOptionDto[] = [];

    hasSesion: Boolean = false;
    isFilled: Boolean = false;
    loggedUser: UserDecoded;

    constructor(private route: ActivatedRoute,
    private formService: FormsService,
    private questionService: QuestionsService,
    private answerService: AnswerService,
    private userFormAnswerService: UserFormAnswerService,
    private utilityService: UtilityService){

    }
    
    ngOnInit(){
        const formId$ = this.route.queryParams.subscribe(param=>{
            this.formId = param['formId'];
        });
        if(TOKEN !== undefined){
            this.loggedUser = jwtDecode(TOKEN || '')
            this.isFormAnswered();
            formId$.unsubscribe();
    
            this.getForm();
            this.getQuestions();
            this.hasSesion = true;
        }
    }

    isFormAnswered(){
        this.userFormAnswerService.resetUrl();
        this.userFormAnswerService.setUrlExtension(`${this.loggedUser?.id}/${this.formId}`);
        this.subscriptions$.push(
            this.userFormAnswerService.get().subscribe((response: ResponseDto<string>)=>{
                if(response.status === 200){
                    this.isFilled = (response.data === "True") ? true : false;
                }
            })
        );
    }

    getForm(){
        this.formService.resetUrl();
        this.formService.setUrlExtension(`GetForm/${this.formId}`);
        this.subscriptions$.push(
            this.formService.get().subscribe((response: ResponseDto<FormDto>)=>{
                if(response.status === 200){
                    this.form = response.data;
                }
            })
        );
    }

    getQuestions(){
        this.questionService.resetUrl();
        this.questionService.setUrlExtension(`${this.formId}`);
        this.subscriptions$.push(
            this.questionService.get().subscribe((response: ResponseDto<QuestionDto[]>)=>{
                if(response.status === 200) {
                    this.questions = response.data;
                    this.questions.forEach((question)=>{
                        let answer: AnswerDto = {
                            questionId: question.questionId,
                            questionTitle: question.title,
                            answer: ''
                        }
                        this.answers.push(answer);
                        if(question.questionTypeId === 4){
                            question.questionOptions.forEach(questionOption=>{
                                this.checkboxAnswers.push(questionOption);
                            });
                        }
                    });
                }
            })
        )
    }

    sendAnswer(){
        let toSaveAnswers: AnswerDto[] = [];
        this.answers.forEach(answer =>{
            this.questions.forEach(question=>{
                if(question.questionTypeId === 4 && question.questionId === answer.questionId){
                    this.checkboxAnswers.forEach((checkboxAnswer: any)=>{
                       if(checkboxAnswer.answer){
                           answer.answer += `${checkboxAnswer.title},`;
                       }
                    });
                }
            });
            toSaveAnswers.push(answer);
        });

        this.answerService.resetUrl();
        this.answerService.setUrlExtension(`${this.loggedUser?.id}/${this.formId}`);
        this.answerService.post(toSaveAnswers).toPromise().then((response: AnswerDto[])=>{
            if(response.length > 0) {
                this.utilityService.openSnackBar('Respuestas enviadas correctamente', 'Ok', 'success-snackbar');
                this.isFilled = true;
            } else{
                this.utilityService.openSnackBar(`Solo se enviaron ${response.length} respuestas`, 'Ok', 'error-snackbar');
            }
        });
    }

    ngOnDestroy(){
        this.subscriptions$.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}