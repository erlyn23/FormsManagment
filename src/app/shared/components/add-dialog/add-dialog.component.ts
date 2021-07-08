import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
    
    formForm: FormGroup;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<AddDialogComponent>,
    private formBuilder: FormBuilder){

    }

    ngOnInit(): void {
        this.formForm = this.formBuilder.group({
            title: ["", [Validators.required]],
            name: ["", [Validators.required]],
            description: ["", [Validators.required, Validators.maxLength(255)]]
        });

        if(this.data.value !== null){
            
            this.formForm.controls.title.setValue(this.data.value.title);
            
            this.formForm.controls.name.setValue(this.data.value.name);
            this.formForm.controls.name.disable({onlySelf: true});
            
            this.formForm.controls.description.setValue(this.data.value.description);
        }
    }

    onNoClick():void{
        this.matDialogRef.close();
    }
}