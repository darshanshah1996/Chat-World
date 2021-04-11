import { Component,OnInit} from '@angular/core';
import firebase from  'firebase/app';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';




import {UserService} from './Shared/user.service';
import {UserModel,UserModelSchema} from './Shared/user.model';
import {ChatService} from './Shared/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ChatProject';
  userCache:UserModelSchema;
  loadingIndicator:boolean=false; 
  constructor(private userService:UserService,private chatService:ChatService,private router:Router,private titleService:Title)
  {
    
  }
  ngOnInit()
  {
    this.titleService.setTitle('Chat World')
  	firebase.initializeApp(environment.firebaseConfig);
  	this.userCache=JSON.parse(localStorage.getItem('user'));
  	//console.log(this.userCache);

  	if(this.userCache)
  	{
      let url=window.location.href;
        if(!url.endsWith('/') && !url.endsWith('register') && !url.endsWith('reset'))
        {
           
          this.userService.setUserCache(new UserModel(this.userCache.idToken,this.userCache.email,Number(this.userCache.tokenExpirationTime),this.userCache.gender,this.userCache.names));
   
       this.chatService.initializeSocket(); 

        }        
         
            
  		
  	}
 


  }

}
