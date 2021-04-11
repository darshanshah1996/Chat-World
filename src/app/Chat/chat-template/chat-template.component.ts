import { Component, OnInit ,OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';


import {UserService} from '../../Shared/user.service';
import {UserFetch} from '../user-list/userfecth.service';
import {ChatService} from '../../Shared/chat.service';
import {LoadingService} from '../../Shared/loading.service';
@Component({
  selector: 'app-chat-template',
  templateUrl: './chat-template.component.html',
  styleUrls: ['./chat-template.component.css']
})
export class ChatTemplateComponent implements OnInit,OnDestroy {
 chatAreaStatus:boolean=true;
 warningMessage:string;
private switchAreaSubscription:Subscription;
private warningMessageSubscription:Subscription;
  constructor(private userService:UserService,
    private router:Router,
    private userfecth:UserFetch,
    private chatService:ChatService,
    private loadingService:LoadingService) { }
 

  ngOnInit() {
  this.loadingService.stopLoading();  
 this.switchAreaSubscription= this.chatService.switchArea.subscribe((status)=>{
    this.chatAreaStatus=status;
  })


this.warningMessageSubscription= this.chatService.warningMessage.subscribe((message:string)=>{
  this.warningMessage=message;
 })

  }
  Logout()
  {
  	this.router.navigate(['/']);
  	localStorage.removeItem('user');
   this.userService.setUser(null);
  }
  ngOnDestroy()
  {
    this.switchAreaSubscription.unsubscribe();
    this.warningMessageSubscription.unsubscribe();
  }
}
