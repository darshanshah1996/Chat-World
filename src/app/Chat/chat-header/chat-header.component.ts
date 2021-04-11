import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import {UserFetch} from '../user-list/userfecth.service';
import {UserService} from '../../Shared/user.service';
import {ChatService} from '../../Shared/chat.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})
export class ChatHeaderComponent implements OnInit,OnDestroy {
 
 userImageURL;
    chatWithUser:string=null;
    chatWithUserProfile:string=null;
    notificationUpdate:boolean=false;
   private chatWithUserSubscription:Subscription 
   private userListNotificationSubscription:Subscription
  constructor(private userfecth:UserFetch,
    private userService:UserService,
    private chatService:ChatService) { }


  ngOnInit() {
  this.userImageURL=this.userService.getuserImageUrl();
 this.chatWithUserSubscription=this.userfecth.chatWithUser.subscribe((userDetail:Object)=>{
     this.chatWithUser=userDetail['Name'];
     this.chatWithUserProfile=userDetail['url'];
   })
  this.userListNotificationSubscription=this.chatService.userListNotification.subscribe((status:boolean)=>{
    //console.log("Status of user list="+status);
    this.notificationUpdate=status;
  })
  }
  getUserList()
  {

   this.userfecth.userlListDisplay.next(false);
   this.userfecth.userProfileDisplay.next(true);
  }
   getUserProilfe()
   {
    this.userfecth.userProfileDisplay.next(false);
    this.userfecth.userlListDisplay.next(true);
   }
   ngOnDestroy()
   {
     this.chatWithUserSubscription.unsubscribe();
     this.userListNotificationSubscription.unsubscribe();
   }
}
