import { Component, OnInit,ViewChild,ElementRef,OnDestroy,ChangeDetectorRef,Renderer2 } from '@angular/core';
import {NgForm} from '@angular/forms';
import  {take,exhaustMap} from 'rxjs/operators';
import {of,pipe,Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';


import {environment} from '../../../environments/environment';
import {UserFetch} from '../user-list/userfecth.service';
import {UserService} from '../../Shared/user.service';
import {UserModel} from '../../Shared/user.model';
import  {ChatService} from '../../Shared/chat.service';
import {ChatStorage} from '../../Shared/chat.storage.service';


@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit,OnDestroy {

  chatWithUser:Object;
  user:UserModel;
  currentUser:string;
  userStack={};
  activeUser={};
  laodingIndicator: boolean=true;
  inputStatus:boolean=false;
  emojiList:Array<string>=[];
  showEmojiStatus:boolean=false;

 private logoutSubscribtion:Subscription;  
 private chatDump={};
 private chatDumpUpdate={};
 private timerStore;
 private timerUpdate;
 private userTokenSubscription:Subscription;
 private chatWithUserSubscription:Subscription
 private messageUpdateSubscription:Subscription;
 private userListSubscription:Subscription;
 private messageFailedSubscription:Subscription;
private warningMessageSubscription:Subscription;  
private clickReference=this.onClick.bind(this);
 @ViewChild('chatArea')chatArea:ElementRef;
 @ViewChild('chatForm')chatText:NgForm;
 @ViewChild('getEmoji')getEmoji:ElementRef;
 @ViewChild('getEmoji1')getEmoji1:ElementRef;
  constructor(private httpClient:HttpClient,
    private userFetch:UserFetch,
    private userService:UserService,
    private chatService:ChatService,
    private chatStorage:ChatStorage,
    private cd:ChangeDetectorRef,
    private render2:Renderer2) {
    

   }
  messages:Array<{name:string,from:string,message:string,time:number}>=[];
  ngOnInit() {

    
    this.userTokenSubscription=this.userService.userToken.pipe(take(1)).subscribe((user:UserModel)=>{
      if(user)
      {
        this.user=user;
        this.currentUser=this.userService.getEmailString(this.user.userEmail);
        
      }
    })
  this.chatWithUserSubscription = this.userFetch.chatWithUser.subscribe(async(userDetail)=>{
       //console.log(this.chatDumpUpdate);

       if(this.chatWithUser && this.chatDumpUpdate[this.chatWithUser['email']]===undefined && this.userStack[this.chatWithUser['email']] && this.userStack[this.chatWithUser['email']].messageQueue.length>0)
       {
         let toEmail:string=this.chatWithUser['email'];
         if(this.timerStore)
         {
           clearTimeout(this.timerStore);
         } 

        // console.log('Chat With Dump');
        this.timerStore= setTimeout(()=>{this.chatStorage.storeData(this.currentUser,toEmail,this.userStack[toEmail].messageQueue)},450);
       }
       else
       {
       //  console.log('Already Dumped');
       }
       

     this.chatWithUser=userDetail;
     if(this.userStack[this.chatWithUser['email']])
     {
       this.messages=Array.from(this.userStack[this.chatWithUser['email']].messageQueue);
       this.scrollHeight();
       this.laodingIndicator=false;
  
     }
     else
     {

       if(this.timerUpdate)
       {
         clearTimeout(this.timerUpdate);
       }

      this.timerUpdate=setTimeout(()=>{this.retriveChats()},250);
       
      
     }
     
     })
     this.messageUpdateSubscription=this.chatService.messageUpdate.subscribe(
       async (messageRecived:{name:string,from:string,message:string,time:number})=>
     {
       
       
        if(this.activeUser[messageRecived.from]===undefined)
        {
          this.userFetch.addUserToList.next(messageRecived.from);
        }

      if(this.userStack[messageRecived.from])
      {
       

  
         this.userStack[messageRecived.from].messageQueue.push(messageRecived); 

        
      }
      else
      {

          let chats=await this.chatStorage.retriveChat(this.currentUser,messageRecived.from);


        this.userStack[messageRecived.from]={unread:0,messageQueue:Array.from(chats)}
         
          this.userStack[messageRecived.from].messageQueue.push(messageRecived);

         
      }
       if(this.chatWithUser && messageRecived.from===this.chatWithUser['email'])
       {
         this.messages.push(messageRecived);

        }
        else
        {
          this.chatService.messageNotification.next(messageRecived.from);
        }
       //this.chatService.userUpdate.next(messageRecived.from);
       this.scrollHeight();

     })

  this.userListSubscription = this.userFetch.userList.subscribe((activeUser)=>{
    this.activeUser=activeUser;

     })

     this.chatService.dumpUpdate.subscribe((email)=>{
       this.chatDumpUpdate[email]=1;
      // console.log(this.chatDumpUpdate);
     })
   this.logoutSubscribtion=this.userService.dumpChat.pipe(take(1)).subscribe(async (status)=>{
        if(status==='ClearChat')
        {
           if(this.chatWithUser && this.userStack[this.chatWithUser['email']] && this.userStack[this.chatWithUser['email']].messageQueue.length>0)
           {
             await this.chatStorage.storeData(this.currentUser,this.chatWithUser['email'],this.userStack[this.chatWithUser['email']].messageQueue)
           }
        }
        //this.userService.dumpChat.next('ChatDumped');
   })

   this.messageFailedSubscription=this.chatService.messageFailed.subscribe((message)=>{
     //console.log('In message failed');
     this.chatStorage.storeData(message['name'],message['from'],this.userStack[message['name']].messageQueue);
     this.chatStorage.storeUserRef(message['name'],message['from'],
       {Avatar:this.userService.getUserImageRef(),Gender:this.user.userGender,Name:this.user.userName});   

   })
   this.warningMessageSubscription=this.chatService.warningMessage.subscribe((message:string)=>{
        if(message)
        {
          this.inputStatus=true;
        }
        else
        {
      this.inputStatus = false;
        }
   })
   
   this.emojiList=this.chatService.getEmojis();
   this.render2.listen('window','click',(e:Event)=>{
     
     if(e.target!==this.getEmoji.nativeElement && e.target!==this.getEmoji1.nativeElement)
     {
       this.showEmojiStatus=false;
     }
   })
  }
  async sendMessage(chatForm:NgForm)
  {
     
    
      let message={name:this.chatWithUser['email'],
      from:this.userService.getEmailString(this.user.userEmail),
       message:chatForm.value.chatText,
       time:new Date().getTime()};
       //
       chatForm.reset();
       let profainyStatus=await this.chatService.filterMessage(message.message);
    if(!profainyStatus)
    { 
      delete this.chatDumpUpdate[this.chatWithUser['email']];
     this.messages.push(message);
  
 
     if(this.userStack[this.chatWithUser['email']])
     {
        
            this.userStack[this.chatWithUser['email']].messageQueue.push(message);
          
            
     }     
     else
     {
       this.userStack[this.chatWithUser['email']]={unread:0,messageQueue:new Array<{name:string,from:string,message:string,time:number}>()};
       this.userStack[this.chatWithUser['email']].messageQueue.push(message);
      
       

     }
       this.scrollHeight();
    if(!this.chatService.sendMessage(message))
     {
       
      this.chatStorage.storeData(this.currentUser,this.chatWithUser['email'],
        this.userStack[this.chatWithUser['email']].messageQueue);
     }
     
    }  
  }

  private async retriveChats()
  {
     this.laodingIndicator=true;
     let chats=await this.chatStorage.retriveChat(this.currentUser,this.chatWithUser['email']);
      if(chats.length>0)
       {
         this.messages=Array.from(chats);
          this.userStack[this.chatWithUser['email']]={unread:0,messageQueue:Array.from(chats)};

       }
       else
       {
         this.messages=[];
       }
       this.scrollHeight();
       this.laodingIndicator=false;
  }

  private  scrollHeight()
  {

   // console.log('In scroll Height');
 
   
      let diff=this.chatArea.nativeElement.scrollHeight- this.chatArea.nativeElement.scrollTop;

    setTimeout(()=>{

      if(this.chatArea.nativeElement.scrollTop===0 || diff<=750)
      {
        //console.log("Scrolling");
         this.chatArea.nativeElement.scrollTop=this.chatArea.nativeElement.scrollHeight;
      }
     
       },200);

   
  
  }
  selectedEmoji(element)
  {
   // console.log(element.textContent);
    this.chatText.setValue({'chatText':this.chatText.value['chatText']+element.textContent.replace('null ','').replace(null,'')});
    
  }
  showEmoji()
  {

    this.showEmojiStatus=true;
   // setTimeout(()=>{document.addEventListener('click',this.clickReference)},100);
  }
  onClick()
  {
   
    // console.log('In clicked');

     document.removeEventListener('click',this.clickReference);
     this.showEmojiStatus=false;
   
     

   
  }
 ngOnDestroy()
 {
   this.logoutSubscribtion.unsubscribe();
   this.userTokenSubscription.unsubscribe();
   this.chatWithUserSubscription.unsubscribe();
   this.messageUpdateSubscription.unsubscribe();
   this.userListSubscription.unsubscribe();
   this.messageFailedSubscription.unsubscribe();
   this.warningMessageSubscription.unsubscribe();
 } 

}
