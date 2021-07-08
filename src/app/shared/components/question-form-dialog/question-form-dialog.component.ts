import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionTypesService } from '@services/question-types.service';
import { QuestionDto } from '@shared/models/question-dto';
import { QuestionTypesDto } from '@shared/models/question-types-dto';
import { ResponseDto } from '@shared/models/response-dto';
import { Subscription } from 'rxjs';

export interface QuestionFormModel{
    viewTitle: string;
    question: QuestionDto;
}

@Component({
    selector: 'app-question-form-dialog',
    templateUrl: './question-form-dialog.component.html',
    styleUrls: ['./question-form-dialog.component.scss']
})
export class QuestionFormDialogComponent implements OnInit, OnDestroy{
    
    questionTypes: QuestionTypesDto[] = [];
    
    questionForm: FormGroup;
    questionTypes$: Subscription;
    constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionFormModel,
    public dialogRef: MatDialogRef<QuestionFormDialogComponent>,
    private formBuilder: FormBuilder,
    private questionTypesService: QuestionTypesService){

    }

    ngOnInit(): void {
        this.getQuestionTypes();

        this.questionForm = this.formBuilder.group({
            title: ["", [Validators.required]],
            questionTypeId: ["", [Validators.required]]
        });

        if(this.data.question !== null){
            this.questionForm.controls.title.setValue(this.data.question.title);
            this.questionForm.controls.questionTypeId.setValue(this.data.question.questionTypeId);
        }
    }

    getQuestionTypes():void{
        this.questionTypesService.resetUrl();
        this.questionTypes$ = this.questionTypesService.get().subscribe((result:ResponseDto<QuestionTypesDto[]>)=>{
            if(result.status === 200){
                this.questionTypes = result.data;
            }
        });
    }

    onNoClick():void{
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.questionTypes$.unsubscribe();
    }
}