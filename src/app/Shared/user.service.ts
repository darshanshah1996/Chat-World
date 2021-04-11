import {Injectable} from '@angular/core';
import {UserModel} from './user.model';
import {BehaviorSubject,Subject} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase';


import {HTTPService} from './http.service';
import {environment} from '../../environments/environment';


@Injectable({providedIn:'root'})


export class UserService
{
  userToken:BehaviorSubject<UserModel>=new BehaviorSubject<UserModel>(null);
  clearSocket:Subject<boolean> =new Subject<boolean>();
  dumpChat:Subject<string>=new Subject<string>();
  sessionTimer;
  private userImage:string;
  private userImageURL;
  private user:UserModel;
constructor(private router:Router,private httpService:HTTPService)
{

}
 setUser(user:UserModel)
  {
      this.userToken.next(user);
      this.clearTimer();
      if(user)
      {
        this.user=user;
      //  this.getUserImage();
      	 this.setTimer(3480); 
      }
   
      
  }
  setUserCache(user:UserModel)
  {
  	  this.userToken.next(user);
      this.user=user;
       this.getUserImage();
  	
      this.clearTimer();
      this.setTimer(Number(user.expirationTime)-Math.round(new Date().getTime()/1000));  
  }
  private setTimer(duration:number)
  {
  	//console.log(duration);
    this.sessionTimer=  setTimeout(()=>{
      this.logout();
      },duration*1000)
  }
  private clearTimer()
  {
  	if(this.sessionTimer)
  	{
  	//	console.log('Timer cleared');
  		clearTimeout(this.sessionTimer);
  	}
  }
  logout()
 {


   this.dumpChat.next('ClearChat');

   
        this.clearSocket.next(true);
    localStorage.removeItem('user');
   this.userToken.next(null);
   this.router.navigate(['/']);
     
     
  
 

 }  

async getUserImage()
{
let userImageRef:string=await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData/'+this.getEmailString(this.user.userEmail)+'/Avatar.json')
  .toPromise().then((userDetails:string)=>{
   this.userImage=userDetails;
    return userDetails;
  },(error)=>{
    console.log(error);
    return null;
  })
   if(userImageRef)
   {
      if(userImageRef.search(/male@png/img)>=0 || userImageRef.search(/female@png/img)>=0)
         {
             userImageRef=userImageRef.replace('@','.');
           
         }
      await firebase.storage().ref().child(userImageRef).getDownloadURL().then((url)=>{
        this.userImageURL=url;
      },(error)=>{
        console.log(error);
      })
   }
} 

getEmailString(email)
{
   let emailModified:string= email.split('').filter((char)=>{
       if(char!=='.')
       {
         return char;
       }
   }).join('');
   //console.log(emailModified);
   return emailModified;
}

getuserImageUrl()
{
  return this.userImageURL;
}

getUserImageRef()
{
  return this.userImage;
}

}