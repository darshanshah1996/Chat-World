import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {environment} from '../../../../environments/environment'; 
import {Router} from '@angular/router';
import{HttpParams} from '@angular/common/http';

import {HTTPService} from '../../../Shared/http.service';
import {UserModel} from '../../../Shared/user.model';
import {UserService} from '../../../Shared/user.service';
import {LoadingService} from '../../../Shared/loading.service';
import {LoginModel} from './login.model';
import {ChatService} from '../../../Shared/chat.service';
@Component({
  selector: 'app-loginuser',
  templateUrl: './loginuser.component.html',
  styleUrls: ['./loginuser.component.css']
})
export class LoginuserComponent implements OnInit {

  loginDetails:LoginModel;
  user:UserModel;
  constructor(private httpService:HTTPService,
    private loadingService:LoadingService,
    private userService:UserService,
    private router:Router,
    private chatService:ChatService) { }

  ngOnInit() {
  }
  async loginSubmit(loginForm:NgForm)
  {

   //console.log(loginForm);
   this.loadingService.startLoading();
   await this.httpService.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.firebaseConfig.apiKey,
     {email:loginForm.value.username,password:loginForm.value.password,returnSecureToken:true}).toPromise().then((loginData:LoginModel)=>{
       this.loginDetails=loginData;

     },(error)=>{

       this.loadingService.stopLoading();
       this.httpService.errorMessageDisplay.next(error);
     })
if(this.loginDetails)
{
   await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData/'+this.userService.getEmailString(this.loginDetails.email)+'.json',{params:new HttpParams().append('auth',this.loginDetails.idToken)})
  .toPromise().then((userDetails)=>{
    
    let time=Math.round(new Date().getTime()/1000);
     this.user=new UserModel(this.loginDetails.idToken,this.loginDetails.email,time+3480,userDetails['Gender'],userDetails['Name']);
     this.userService.setUser(this.user);   
       localStorage.setItem('user',JSON.stringify(this.user));
  },(error)=>{
    this.loadingService.stopLoading();
       this.httpService.errorMessageDisplay.next(error);
  })   
}
  if(this.user)
  {
    this.chatService.initializeSocket();
    this.userService.getUserImage();
    this.router.navigate(['chat']);
  }
  // this.loadingService.stopLoading();
  }
}
