import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componnets/auth/login/login.component';
import { RegisterComponent } from './componnets/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@shared/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '@shared/header/header.component';
import { AddDialogComponent } from '@shared/components/add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './componnets/home/dashboard/dashboard.component';
import { QuestionsComponent } from './componnets/home/questions/questions.component';
import { QuestionFormDialogComponent } from '@shared/components/question-form-dialog/question-form-dialog.component';
import { QuestionOptionsComponent } from './componnets/home/questions/question-options/question-options.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    AddDialogComponent,
    ConfirmDialogComponent,
    QuestionsComponent,
    QuestionFormDialogComponent,
    QuestionOptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [AddDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
