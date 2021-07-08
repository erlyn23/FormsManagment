import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { QuestionsComponent } from './components/home/questions/questions.component';

const routes: Routes = [{path: '', pathMatch: 'full', component: LoginComponent},
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{path: 'questions', component: QuestionsComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
