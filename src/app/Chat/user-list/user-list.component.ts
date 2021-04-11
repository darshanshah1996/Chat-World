import { Component, OnInit,OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import{HttpParams} from '@angular/common/http';
import {take,switchMap,concatMap,exhaustMap} from 'rxjs/operators';
import {of,Subscription} from 'rxjs';
import firebase from 'firebase';


import {HTTPService} from '../../Shared/http.service';
import {LoadingService} from '../../Shared/loading.service';
import {UserService} from '../../Shared/user.service';
import {UserModel} from '../../Shared/user.model';
import {UserFetch} from './userfecth.service';
import {ChatService} from '../../Shared/chat.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit,OnDestroy {

   userList:Object;
   userSearch:string;
   userStatus:object={};
   userData:Array<Object>=new Array();
   currentUser:string;
   currentUserEmail:string;
   timer;
   userUpdateTimer;
   noSearch:boolean=false;
   closeUserList:boolean=true;
   userAdded=new Object();
   userSearchData:Array<Object>;

   loadingIndicator:boolean=false;
   spinnerColor:string="#1a1aff";
   private userListNotificationStack={};
   private userlListDisplaySubscription:Subscription;
   private addUserToListSubscription:Subscription;
   private userStatusUpdateSubscription:Subscription;
   private messageNotificationSubscription:Subscription;

  constructor(private httpService:HTTPService,
    private activatedRoute:ActivatedRoute,
    private loadingService:LoadingService,
    private userService:UserService,
    private userfecth:UserFetch,
    private chatService:ChatService) {


     }

 async ngOnInit() {

 

  this.userlListDisplaySubscription =this.userfecth.userlListDisplay.subscribe((status:boolean)=>{
     this.closeUserList=status;
   })
   
     await this.userService.userToken.pipe(take(1)).toPromise().then((user:UserModel)=>{
       
      if(user)
      {

        this.currentUser=user.userName;
        this.currentUserEmail=user.userEmail;
      }
    })     

     this.activatedRoute.data.subscribe((data)=>{
       
       if(data['userList'])
        {

         

        	this.userData=new Array();
        	
     	 this.userData= data['userList'].filter((userEntry)=>{
          if(userEntry['Name']!==this.currentUser)
            {
              if(userEntry['Name'].split(' ')[1])
            {
                  userEntry['Name']=this.formatName(userEntry['Name']);
                  /*userEntry['Name'].split(' ')[0]+' '+userEntry['Name'].split(' ')[1].slice(0,1).toUpperCase()+

                  userEntry['Name'].split(' ')[1].slice(1,userEntry['Name'].split(' ')[1].length);*/

            }

            if(userEntry['NewMessage'])
            {
                this.userListNotificationStack[userEntry['email']]=1;
                this.chatService.userListNotification.next(true);
            }
                 this.userAdded[userEntry['email']]=1;
              return userEntry;
            }
            
            
            
          });
        //console.log(this.userData);

        }
        this.loadingService.stopLoading();
        this.updateList();
        
    })

/*this.chatService.userUpdate.subscribe((user)=>{

})
  this.userfecth.userListUpdate.subscribe((email)=>{
    console.log(email);
  })     */

this.addUserToListSubscription=this.userfecth.addUserToList.subscribe(async (email:string)=>{

  if(this.userUpdateTimer)
  {
    clearTimeout(this.userUpdateTimer);
  }
  this.userUpdateTimer=setTimeout(()=>{
    this.getUserInfo(email);
    this.getUserStatus(email);
  },400)
 
  
 
})
  if(this.userAdded)
  {
     this.userfecth.getUserStatus(this.userAdded).subscribe((data)=>{
   
   
  
   if(data)
   {
     this.userStatus=data['users'];
     //console.log(this.userStatus);
   }
  },(error)=>{
    console.log(error);
  })
 
 this.userStatusUpdateSubscription=   this.chatService.userStatusUpdate.subscribe((status)=>{
    //  console.log(status);
      if(this.userStatus[status.email]!==undefined)
      {
         this.userStatus[status.email]=status.status;  
      }
    }) 
  }

  this.messageNotificationSubscription=this.chatService.messageNotification.subscribe((email:string)=>{
    // console.log('Notification='+email);
    this.userData.forEach((user)=>{
      if(user['email']===email)
      {  
          this.userListNotificationStack[email]=1;
          this.chatService.userListNotification.next(true);
          user['NewMessage']=1;
      }
    })
  })
      
  }



 async searchUser()
  {
  
    this.noSearch=false;
    this.userSearchData=new Array();
     
   if(this.userSearch.length>=3)
   {
      this.debounceSearch(); 
   } 
  
     
     
    
  

  }

  debounceSearch()
  {
    if(this.timer)
    {
     
      clearTimeout(this.timer);
    }
    this.timer=setTimeout(async ()=>{
     

      this.loadingIndicator=true;
      this.timer=null;
    this.userSearchData= await this.userfecth.getUserList(this.userSearch,this.currentUser);
   if(this.userSearchData.length===0)
   {
     this.noSearch=true;
   }    
   this.loadingIndicator=false;       
     },450)
     

  }


  getUser(index:number)
  {
     this.userSearch="";
    
    if(this.userAdded[this.userSearchData[index]['email']]===undefined) 
    {
      if( this.userSearchData[index]['Name'].split(' ')[1])
      {
        this.userSearchData[index]['Name']=this.formatName(this.userSearchData[index]['Name']);
        /*this.userSearchData[index]['Name'].split(' ')[0]+' '+ this.userSearchData[index]['Name'].split(' ')[1].slice(0,1).toUpperCase()+

                   this.userSearchData[index]['Name'].split(' ')[1].slice(1, this.userSearchData[index]['Name'].split(' ')[1].length);*/

      }
      
      this.userData.push(this.userSearchData[index]);
       this.userAdded[this.userSearchData[index]['email']]=1;
        this.getUserStatus(this.userSearchData[index]['email']);

        this.cacheUser(this.userSearchData[index]);
       this.updateList();

        }
    else
    {
      alert('User already present in chat list');
    }
  }
  chatWithUser(index:number)
  {
   this.userData[index]['NewMessage']=0; 
   delete this.userListNotificationStack[this.userData[index]['email']];
  this.userfecth.chatWithUser.next(this.userData[index]);
  this.closeList();
  if(Object.keys(this.userListNotificationStack).length===0)
  {
    this.chatService.userListNotification.next(false);
  }
  }
  closeList()
  {
    this.closeUserList=true;
  }
   updateList()
   {
     this.userfecth.userList.next(this.userAdded);
   }

   formatName(name:string)
   {
      name=  name.split(' ')[0]+' '+ name.split(' ')[1].slice(0,1).toUpperCase()+

                   name.split(' ')[1].slice(1, name.split(' ')[1].length);
      return name;
   }

   async getUserInfo(email:string)
   {
           let user=await this.userfecth.getUser(email);

 if(user['Name'].split(' ')[1])
 {
   user['Name']=this.formatName(user['Name']);
 }
 user['NewMessage']=1;
 this.userListNotificationStack[email]=1;
 this.chatService.userListNotification.next(true);
 this.userData.push(user);
this.userAdded[email]=1;
this.updateList();
this.cacheUser(user);
   }

   getUserStatus(email:string)
   {
     let  initialUserStatus={};
      initialUserStatus[email]=1;
       
    this.userfecth.getUserStatus(initialUserStatus).subscribe((users)=>{
      
      if(users)
      {
       this.userStatus[email]=users['users'][email];
      // console.log(users);
       //console.log(this.userStatus);
      }
    },(error)=>{
      console.log(error);
    });
   }


   cacheUser(user:object)
   {

     if(localStorage.getItem(this.currentUserEmail))
     {
       
       let cacheUsers=JSON.parse(localStorage.getItem(this.currentUserEmail));
       cacheUsers[user['email']]=user;
       localStorage.setItem(this.currentUserEmail,JSON.stringify(cacheUsers));
     }
   }
   ngOnDestroy()
   {
     this.userlListDisplaySubscription.unsubscribe();
     this.addUserToListSubscription.unsubscribe();
     this.userStatusUpdateSubscription.unsubscribe();
     this.messageNotificationSubscription.unsubscribe();
   }

}
