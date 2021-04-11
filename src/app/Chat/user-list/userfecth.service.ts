import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import{HttpParams} from '@angular/common/http';
import {take,switchMap,concatMap,exhaustMap} from 'rxjs/operators';
import {of,Subject} from 'rxjs';
import firebase from 'firebase';


import {HTTPService} from '../../Shared/http.service';


@Injectable({providedIn:'root'})

export class UserFetch
{

   userlListDisplay:Subject<boolean>=new Subject<boolean>();
   userProfileDisplay:Subject<boolean>=new Subject<boolean>();
   chatWithUser:Subject<object>=new Subject<object>(); 
   userList:Subject<object>=new Subject<object>();
   userListUpdate:Subject<string>=new Subject<string>();
   addUserToList:Subject<string>=new Subject<string>();
	constructor(private httpService:HTTPService)
	{

	}
  

    async getUserList(searchString,currentUser)
    {
        searchString=searchString.slice(0,1).toUpperCase()+searchString.slice(1,searchString.length).toLowerCase();
         let details:Object=  await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData.json',{params:new HttpParams().append("orderBy",'"Name"',)
        .append("startAt",'"'+searchString+'"').append("endAt",'"'+searchString+'\\'+"uf8ff"+'"')}).pipe(exhaustMap((data)=>{
         return of(data)
        })).toPromise().then(async (userDetails)=>{
         

          for(let user in userDetails)
       {

         
       
       
         let imageRef:string=userDetails[user]['Avatar'];
         if(imageRef.search(/male@png/img)>=0 || imageRef.search(/female@png/img)>=0)
         {
             imageRef=imageRef.replace('@','.');
           
         }
          await firebase.storage().ref().child(imageRef).getDownloadURL().then((url)=>{
           userDetails[user]['url']=url;
          })
         userDetails[user]['email']=user;
         
          
       }
       return userDetails;
      

        },(error)=>{
          
          return {};
        })
        
       let userSearchData=new Array();


        for(let user in details)
       {

         if(details[user]['Name']!==currentUser)
         {
            userSearchData.push(details[user]);
         } 
         
       }

       return userSearchData;  


    }


  async getUser(email:string)
  {
    
    let user;
     await this.httpService.get(environment.firebaseConfig.databaseURL+'/UserData/'+email+'.json').toPromise().then(async (userData)=>{
   
    let imageRef=userData['Avatar'];
    if(imageRef.search(/male@png/img)>=0 || imageRef.search(/female@png/img)>=0)
         {
             imageRef=imageRef.replace('@','.');
           
         }
   await firebase.storage().ref().child(imageRef).getDownloadURL().then((url)=>{
      userData['url']=url;
    })

userData['email']=email;
   user=userData;
  })      
   
  // console.log(user);    
   return user;

  
  }
   getUserStatus(userAdded:object)
  {
   
  return this.httpService.post(environment.apiEndpoint+'Users',{userAdded:userAdded});
  
  }
 

}