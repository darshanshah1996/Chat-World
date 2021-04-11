import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';





import {ChatTemplateComponent} from './chat-template/chat-template.component';
import { UserListComponent } from './user-list/user-list.component';
import {LoadingSpecificComponent} from '../LoadingAndError/loading-specific/loading-specific.component';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { ChatHelpComponent } from './chat-help/chat-help.component';
import { BlogAreaComponent } from './blog-area/blog-area.component';
import { WarningComponent } from './warning/warning.component';

@NgModule({
	declarations:[ChatTemplateComponent, UserListComponent,LoadingSpecificComponent, ChatHeaderComponent, UserProfileComponent, ChatAreaComponent, ChatHelpComponent, BlogAreaComponent, WarningComponent],
	imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterModule.forChild([{path:'',component:ChatTemplateComponent}])],
   
})

export class ChatModule
{

}