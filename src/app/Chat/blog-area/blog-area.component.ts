import { Component, OnInit,OnDestroy,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import {Subscription} from 'rxjs';
import {take} from  'rxjs/operators';
import {NgForm} from '@angular/forms';
import {environment} from '../../../environments/environment';


import {UserService} from '../../Shared/user.service';
import {UserModel} from '../../Shared/user.model';
import {UserFetch} from '../user-list/userfecth.service';
import {ChatService} from '../../Shared/chat.service';
import{HTTPService} from '../../Shared/http.service';
@Component({
  selector: 'app-blog-area',
  templateUrl: './blog-area.component.html',
  styleUrls: ['./blog-area.component.css']
})
export class BlogAreaComponent implements OnInit,OnDestroy {

  userImageURL:string;
  loadingIndicator:boolean=false;
  inputStatus:boolean=false;
  emojiList:Array<string>;
  showEmojiStatus:boolean=false;
  @ViewChild('blogArea')blogAreaRef:ElementRef;
  @ViewChild('blogForm')blogForm:NgForm;
  @ViewChild('getEmoji')getEmoji:ElementRef;
  @ViewChild('getEmoji1')getEmoji1:ElementRef;
  private user:UserModel;
  private userEmail:string;
  private userTokenSubscription:Subscription;
  private postNotificationSubscription:Subscription;
  private switchAreaSubscription:Subscription;
   postStack:Array<{name:string,url:string,times:number,message:string}>=[]; 


  constructor(private userService:UserService,
    private userFetch:UserFetch,
    private chatSrevice:ChatService,
    private httpService:HTTPService,
    private render:Renderer2) { }
 



  ngOnInit(): void {
  this.userTokenSubscription=  this.userService.userToken.pipe(take(1)).subscribe((userDetail:UserModel)=>{
    	this.user=userDetail
    	this.userEmail=this.userService.getEmailString(userDetail.userEmail);
    //	console.log(this.user);
    })
this.postNotificationSubscription=this.chatSrevice.postNotification.subscribe(async (postRecived:{name:string,url:string,times:number,message:string})=>{
	if(this.postStack.length===0)
  {
   await this.retrivePosts();
  }
else
{
  this.postStack.push(postRecived);
}
  
  this.scrollView();
})

  this.userImageURL=this.userService.getuserImageUrl();
 // console.log(this.userImageURL);
this.switchAreaSubscription=this.chatSrevice.switchArea.subscribe(async  (status)=>{
  if(!status && this.postStack.length===0)
  {
     this.retrivePosts();
   
  }
   

})  
  this.chatSrevice.warningMessage.subscribe((message:string)=>{

    if(message)
    {
      this.inputStatus=true;
    }
    else
    {
      this.inputStatus=false;
    }

  })
  this.emojiList= this.chatSrevice.getEmojis();
  this.render.listen('window','click',(e:Event)=>{
    if(e.target !==this.getEmoji.nativeElement && e.target !==this.getEmoji1.nativeElement)
    {
      this.showEmojiStatus=false;
    }
  })
  }
  async post(postForm:NgForm)
  {
  	//console.log(postForm.value);
  	let message={name:this.formatName(this.user.userName),
    	url:this.userImageURL,
    	times:new Date().getTime(),
    	message:postForm.value.blogs}
    let profainyStatus:boolean=await this.chatSrevice.filterMessage(message.message);
   if(!profainyStatus)
   {   
    this.postStack.push(message);
    this.scrollView();
    this.chatSrevice.sendPost(message);
    this.httpService.post(environment.firebaseConfig.databaseURL+'/Posts.json',{post:message}).subscribe((data)=>{
      //console.log(data);
    },(error)=>{
      console.log(error);
    });
  }

  	postForm.reset();
  }

  showProfile()
  {
  	
       this.userFetch.userProfileDisplay.next(false);
  }
  formatName(name:string)
   {
   	
   	if(name.split(' ').length>1)
   	{
   		name=  name.split(' ')[0]+' '+ name.split(' ')[1].slice(0,1).toUpperCase()+

                   name.split(' ')[1].slice(1, name.split(' ')[1].length);
   	}
      
      return name;
   }

   async  retrivePosts()
   {
     this.loadingIndicator=true;
     this.postStack=[];
   await this.httpService.get(environment.firebaseConfig.databaseURL+'/Posts.json').toPromise()
   .then((Posts)=>{
     for(let eachPost in Posts)
     {
       this.postStack.push(Posts[eachPost]['post']);
     }
   },(error)=>{
     console.log(error);
   })   
    this.scrollView();
   this.loadingIndicator=false;
   }
   showEmoji()
   {
     this.showEmojiStatus=true;
   }

   selectedEmoji(element)
   {
    this.blogForm.setValue({'blogs':this.blogForm.value['blogs']+element.textContent.replace('null','')});
   }
 ngOnDestroy()
 {
 	this.userTokenSubscription.unsubscribe();
 	this.postNotificationSubscription.unsubscribe();
  this.switchAreaSubscription.unsubscribe();
 }

 scrollView()
 {
   //console.log(this.blogAreaRef);
  setTimeout(() =>{
    //console.log(this.blogAreaRef.nativeElement.scrollHeight- this.blogAreaRef.nativeElement.scrollTop);
    if(this.blogAreaRef.nativeElement.scrollTop===0 || this.blogAreaRef.nativeElement.scrollHeight- this.blogAreaRef.nativeElement.scrollTop<800 )
    {
    this.blogAreaRef.nativeElement.scrollTop=this.blogAreaRef.nativeElement.scrollHeight;
    }},200);
 }


}
