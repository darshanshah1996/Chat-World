import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import{HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import firebase from 'firebase';
import { Resolve,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';

import {HTTPService} from './http.service';
import {UserService} from './user.service';
import {UserModel} from './user.model';
@Injectable({providedIn:'root'})

export class RetriveUser implements Resolve<any>
{
   userDetails:Object={};
   user:UserModel;
   userData:Array<Object> =new Array<Object>();

	constructor(private httpService:HTTPService,private userSrevice:UserService)
	{

   // console.log('Resolver Called');
        this.userSrevice.userToken.subscribe((user:UserModel)=>{
          if(user)
          {
            this.user=user;
          }
        })
	}
    
    async resolve(activateRoute:ActivatedRouteSnapshot,routerState:RouterStateSnapshot)
    { 
     // console.log(this.userSrevice.getEmailString(this.user.userEmail));          
      await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData/'+this.userSrevice.getEmailString(this.user.userEmail)+'/Users.json').toPromise().then((detail)=>{
      if(detail)
      {
     //   console.log('Users Fetched');
       // console.log(detail);
        for(let user in detail)
       {
         this.userDetails[user]=detail[user];  
         this.userDetails[user]['NewMessage']=1;
       } 
      this.httpService.delete(environment.firebaseConfig.databaseURL+'/UserData/'+this.userSrevice.getEmailString(this.user.userEmail)+'/Users.json').subscribe((status)=>{
      //  console.log('In delete');
       // console.log(status);
      },(error)=>{
       console.log(error);
      })
      }
       
      })

      if(localStorage.getItem(this.user.userEmail))
      {
        let cahcheDetails=JSON.parse(localStorage.getItem(this.user.userEmail));
    //   console.log('In cache');
      //  console.log(cahcheDetails);
        for(let user in cahcheDetails)
        {
          if(this.userDetails[user]===undefined)
          {
             cahcheDetails[user]['NewMessage']=0;
          this.userDetails[user]=cahcheDetails[user];
          } 
         
        }
      }
      else
      {
        await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData.json',{params:new HttpParams().append("orderBy",'"Name"').append('limitToFirst',"4")})
        .toPromise().then((userDetails)=>{
      
      for(let user in userDetails)
      {

        if(this.userDetails[user]===undefined)
        {
           this.userDetails[user]=userDetails[user];
        }
      }

    },(error)=>{
      console.log(error);
    })
      }

        
    localStorage.setItem(this.user.userEmail,JSON.stringify(this.userDetails));    
   if(this.userDetails)
   {
        
     this.userData=new Array();

   	  for(let user in this.userDetails)
   	  {
   	  
   	  	let imageRef:string=this.userDetails[user]['Avatar'];
   	  	if(imageRef.search(/male@png/img)>=0 || imageRef.search(/female@png/img)>=0)
   	  	{
             imageRef=imageRef.replace('@','.');
           
   	  	}
   	  	 await firebase.storage().ref().child(imageRef).getDownloadURL().then((url)=>{
   	  	 	this.userDetails[user]['url']=url;
   	  	 })
        this.userDetails[user]['email']=user;   
   	  	 this.userData.push(this.userDetails[user]);
   	  }
   }
   return this.userData;
    }
}