import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {HTTPService} from './http.service';
import  {ChatService} from './chat.service';


@Injectable({providedIn:'root'})

export class ChatStorage
{
	constructor(private httpService:HTTPService,private chatService:ChatService)
	{

	}

	async storeData(emailRef:string,emailRef1:string,data:Array<{name:string,from:string,message:string,time:number}>)
	{
		let email:string=this.generateEmailString(emailRef,emailRef1);
		if(emailRef>emailRef1)
		{
			email=emailRef+'-'+emailRef1;
		}
		else
		{
			email=emailRef1+'-'+emailRef;
		
		}
		//console.log(email);
		await this.httpService.put(environment.firebaseConfig.databaseURL+'/Chat/'+email+'.json',{chats:JSON.stringify(data)}).toPromise().then((data)=>{
	    //console.log(data); 		
	    this.chatService.sendDumpStatus(emailRef1,emailRef);
		},(error)=>{
			console.log(error);
		})




	}
	async retriveChat(from:string,to:string)
	{
       let email:string=this.generateEmailString(from,to);

       let chatsRecived:Array<{name:string,from:string,message:string,time:number}>=[];
     await this.httpService.get(environment.firebaseConfig.databaseURL+'/Chat/'+email+'.json').toPromise().then((chats:string)=>{
  //    console.log(chats);
      if(chats)
      {
      	chatsRecived=JSON.parse(chats['chats']);
      }
      	
      },(error)=>{
      	console.log(error);
      })  
      return chatsRecived;
	}

	private generateEmailString(emailRef:string,emailRef1:string)
	{
		let email:string;
		if(emailRef>emailRef1)
		{
			email=emailRef+'-'+emailRef1;
		}
		else
		{
			email=emailRef1+'-'+emailRef;
		
		}
		return email;
	}

	storeUserRef(emailTo:string,emailFrom:string,ref:{Avatar:string,Gender:string,Name:string})
	{
       this.httpService.put(environment.firebaseConfig.databaseURL+'/UserData/'+emailTo+'/Users/'+emailFrom+'.json',ref).subscribe((detail)=>{
       //	console.log(detail);
       },(error)=>{
       	console.log(error);
       })       
	}
}