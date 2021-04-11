import {NgModule} from '@angular/core';
import {RouterModule,Routes,PreloadAllModules} from '@angular/router';


import { AuthenticationModule } from './Authentication/authentication.module';
//import { ChatTemplateComponent } from './Chat/chat-template/chat-template.component';
import {ChatModule} from './Chat/chat.module';
import {LoginGuard} from './Shared/login.guard';
import {RetriveUser} from './Shared/retriveusers.resolver';


const routes:Routes=[{path:'chat',loadChildren:()=>import('./Chat/chat.module').then(module=>module.ChatModule),canActivate:[LoginGuard],resolve:{userList:RetriveUser}},
{path:'',loadChildren:()=>import('./Authentication/authentication.module').then(module=>module.AuthenticationModule)}
                   ]


@NgModule({
	imports:[RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
	exports:[RouterModule]
})

export class AppRouting{

}