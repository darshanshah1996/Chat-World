import {NgModule} from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';



import {LoginComponent} from './login/login.component';
import { LoginuserComponent } from './login/loginuser/loginuser.component';
import { RegisterUserComponent } from './login/register-user/register-user.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';





@NgModule({
	declarations:[LoginComponent, LoginuserComponent, RegisterUserComponent, PasswordResetComponent],
	imports:[FormsModule,
	ReactiveFormsModule,
	CommonModule,
	RouterModule.forChild([{path:'',component:LoginComponent,
		children:[{path:'',component:LoginuserComponent},{path:'register',
		component:RegisterUserComponent},{path:'reset',component:PasswordResetComponent}]}])]

})

export class AuthenticationModule
{

}