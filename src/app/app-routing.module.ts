import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BugsComponent } from './bugs/bugs.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToProjects = () => redirectLoggedInTo(['projects']);
const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToProjects }},
  {path: 'projects', component: ProjectsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: 'projects/:projId', component: BugsComponent},
  {path: '**', redirectTo:"/projects"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
