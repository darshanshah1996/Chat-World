import {Injectable} from '@angular/core';
import {io,Socket} from 'socket.io-client/build/index';
import {Subject} from 'rxjs';
import {HttpParams} from '@angular/common/http';



import {environment} from '../../environments/environment';
import {UserService} from './user.service';
import {UserModel} from './user.model';
import {HTTPService} from './http.service';
@Injectable({providedIn:'root'})

export class ChatService
{


 private socket:Socket;
 private user:UserModel;
 private socketDisconnectedStatus:boolean=false;
 private emojiList:Array<string>=[
  "&#128512;",
  "&#128513;",
  "&#128514;",
  "&#128515;",
  "&#128516;",
  "&#128517;",
  "&#128518;",
  "&#128519;",
  "&#128520;",
  "&#128521;",
  "&#128522;",
  "&#128523;",
  "&#128524;",
  "&#128525;",
  "&#128526;",
  "&#128527;",
  "&#128528;",
  "&#128529;",
  "&#128530;",
  "&#128531;",
  "&#128532;",
  "&#128533;",
  "&#128534;",
  "&#128535;",
  "&#128536;",
  "&#128537;",
  "&#128538;",
  "&#128539;",
  "&#128540;",
  "&#128541;",
  "&#128542;",
  "&#128543;",
  "&#128544;",
  "&#128545;",
  "&#128546;",
  "&#128547;",
  "&#128548;",
  "&#128549;",
  "&#128550;",
  "&#128551;",
  "&#128552;",
  "&#128553;",
  "&#128554;",
  "&#128555;",
  "&#128556;",
  "&#128557;",
  "&#128558;",
  "&#128559;",
  "&#128560;",
  "&#128561;",
  "&#128562;",
  "&#128563;",
  "&#128564;",
  "&#128565;",
  "&#128566;",
  "&#128567;",
  "&#128577;",
  "&#128578;",
  "&#128579;",
  "&#128580;",
  "&#129296;",
  "&#129297;",
  "&#129298;",
  "&#129299;",
  "&#129300;",
  "&#129301;",
  "&#129312;",
  "&#129313;",
  "&#129314;",
  "&#129315;",
  "&#129316;",
  "&#129317;",
  "&#129319;",
  "&#129320;",
  "&#129321;",
  "&#129322;",
  "&#129323;",
  "&#129324;",
  "&#129325;",
  "&#129326;",
  "&#129327;",
  "&#129488;"
];
 messageUpdate:Subject<{name:string,from:string,message:string,time:number}>=new Subject<{name:string,from:string,message:string,time:number}>();
userUpdate:Subject<string>=new Subject<string>();
dumpUpdate:Subject<string>=new Subject<string>();
messageFailed:Subject<{name:string,from:string,message:string,time:number}>=new Subject<{name:string,from:string,message:string,time:number}>();
messageNotification:Subject<string>=new Subject<string>();
userStatusUpdate:Subject<{email:string,status:number}>=new Subject<{email:string,status:number}>(); 
switchArea:Subject<boolean>=new Subject<boolean>();
postNotification:Subject<{name:string,url:string,times:number,message:string}>=new Subject<{name:string,url:string,times:number,message:string}>();
warningMessage:Subject<string>=new Subject<string>();
userListNotification:Subject<boolean>=new Subject<boolean>();
 constructor(private userService:UserService,private httpService:HTTPService)
 {
    this.userService.userToken.subscribe((user:UserModel)=>{
    	if(user)
    	{
    		this.user=user;
    	}
       
    })
    this.userService.clearSocket.subscribe((status)=>{
    if(status)
    {
    	this.logouts();
    }
    })
 }
 initializeSocket()
 {
   
    this.socket=io(environment.apiEndpoint);
 // console.log(this.socket);
  this.socket.emit('addUser',this.userService.getEmailString(this.user.userEmail));
  this.socket.on('UserAdded',(data)=>{
   // console.log(data);
  })

  this.socket.on('reciveMessage',(message)=>{
  //console.log(message);
    this.messageUpdate.next(message);
  })
  this.socket.on('postUpdate',(message:{name:string,url:string,times:number,message:string})=>{
   // console.log('Post Recived');
    //console.log(message);
    this.postNotification.next(message);
  })
  this.socket.on('dumpUpdate',(entry)=>{
    //console.log('Dump Update');
    //console.log(entry);
    this.dumpUpdate.next(entry['fromUser'])
  })

  this.socket.on('sendingFailed',(message)=>{
   this.messageFailed.next(message);
  })     
  
  this.socket.on('Status',(status:{email:string,status:number})=>{
   this.userStatusUpdate.next(status);
  })
  this.socket.on('connect',()=>{
   // console.log('Reconnected');
    if(this.socketDisconnectedStatus)
    {
     // console.log('Restoring socke');
        this.socketDisconnectedStatus=false;
      this.socket.emit('addUser',this.userService.getEmailString(this.user.userEmail));
    
    } 

  })
  this.socket.on('disconnect',()=>{
       this.socketDisconnectedStatus=true;
  })

  this.socket.on('Blocked',(message)=>{
    
    this.warningMessage.next(message);
  })
 
 }
 logouts()
 {
 	this.socket.emit('removeUser',this.userService.getEmailString(this.user.userEmail));
    
 }
 sendMessage(message:{name:string,from:string,message:string,time:number})
 {
   
     if(this.socket.connected)
     {

      // console.log(this.socket);
       this.socket.emit('sendMessage',message);
     return true;
     }    
     else

     {

       
       return false;
     }
      
  
    
 }


 sendDumpStatus(toUser:string,fromUser:string)
 {
   this.socket.emit('dumpStatus',{toUser,fromUser})
 }

 sendPost(message:{name:string,url:string,times:number,message:string})
 {
    this.socket.emit('sendPost',message);
 }
 getEmojis()
 {
   return this.emojiList;
 }

 async filterMessage(message:string)
 {

   let profainyStatus:boolean=false;
   return new Promise<boolean>((resolve,reject)=>{
 
     this.httpService.get('https://www.purgomalum.com/service/json',
       {params:new HttpParams().append('text',message)}).subscribe((filteredMessage)=>{
       //  console.log('Filter='+filteredMessage); 
        if(filteredMessage['result'].search('\\*')>=0)
        {
          profainyStatus=true;
          alert('Please refrain from using abusive language in the chat');

        }
       },(error)=>{
         console.log(error);
       })
     setTimeout(()=>{
      
       resolve(profainyStatus);
     },450);
   })
  
 }


}