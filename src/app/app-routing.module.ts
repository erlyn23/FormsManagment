import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth.guard';
import { LoginComponent } from './componnets/auth/login/login.component';
import { RegisterComponent } from './componnets/auth/register/register.component';
import { DashboardComponent } from './componnets/home/dashboard/dashboard.component';

const routes: Routes = [{path: '', pathMatch: 'full', component: LoginComponent},
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
