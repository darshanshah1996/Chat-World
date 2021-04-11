import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators';

import {UserService} from '../../Shared/user.service';
import {UserModel} from '../../Shared/user.model';
import {UserFetch} from '../user-list/userfecth.service';
import {ChatService} from '../../Shared/chat.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userImageURL;
  userProfileDisplay:boolean=true;
  
  user:string;
  constructor(private userService:UserService,
    private userFetch:UserFetch,
    private chatService:ChatService) { 
 
  }

  ngOnInit() {
  

  this.userImageURL=this.userService.getuserImageUrl();
  this.userService.userToken.pipe(take(1)).subscribe((userDetail:UserModel)=>{
  	this.user=userDetail.userName.split(' ')[0];
  })
  this.userFetch.userProfileDisplay.subscribe((status:boolean)=>{
  	this.userProfileDisplay=status;
  })
  }

  blogDisplay()
  {
    
   this.chatService.switchArea.next(false);
  }
  chatDisplay()
  {
    this.chatService.switchArea.next(true);
  }
  logOut()
  {
  	this.userService.logout();
  }
  closeUserProfile()
  {
  	this.userProfileDisplay=true;
  }
}
