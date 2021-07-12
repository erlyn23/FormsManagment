import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@shared/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '@shared/header/header.component';
import { AddDialogComponent } from '@shared/components/add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { QuestionsComponent } from './components/home/questions/questions.component';
import { QuestionFormDialogComponent } from '@shared/components/question-form-dialog/question-form-dialog.component';
import { QuestionOptionsComponent } from './components/home/questions/question-options/question-options.component';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewFormComponent } from '@components/home/view-form/view-form.component';
import { ShareFormComponent } from './shared/components/share-form/share-form.component';

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
    QuestionOptionsComponent,
    ViewFormComponent,
    ShareFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatNativeDateModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
