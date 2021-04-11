import { Component, OnInit,ViewChild,ElementRef,QueryList,AfterViewChecked } from '@angular/core';
import {NgForm} from '@angular/forms';
import firebase from 'firebase/app';
import {Router} from '@angular/router';

import {HTTPService} from '../../../Shared/http.service';
import {environment} from '../../../../environments/environment';
import  {LoadingService} from '../../../Shared/loading.service';
import {UserModel} from '../../../Shared/user.model';
import {UserService} from '../../../Shared/user.service';
import {ChatService} from '../../../Shared/chat.service';
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit,AfterViewChecked {

  constructor(private httpService:HTTPService,
    private loadingService:LoadingService,
    private userService:UserService,
    private router:Router,
   private chatService:ChatService ) { }
  file:any; 
  user:UserModel;
  genderDefault:string='Male';
  uploadImageLocation:string;   

  private uploadImageDefault={
    "Male":"male@png",
    "Female":"female@png"
  }
  uploadFile:File;

  fr:FileReader=new FileReader();
  storageRef:any;
  avtarImageRef:any;
  @ViewChild('imageUpload')avatarInput:ElementRef;
  ngOnInit() {
    
  	this.storageRef=firebase.storage().ref();
   // this.avtarImageRef=this.storageRef.child("Avatar/testimage");
     /*this.avtarImageRef.getDownloadURL().then((url)=>{
       console.log('File url');
         this.file1=url;
        
     })*/
     



  	
  }
  ngAfterViewChecked()
  {
  	
  }
  async registerSubmit(registerForm:NgForm)
  {

    let avtarImageRef;
    this.loadingService.startLoading();
    
      await this.httpService.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+environment.firebaseConfig.apiKey,
          {email:registerForm.value.username,password:registerForm.value.password}).toPromise().then( (registrationData)=>{
            let createdTime=new Date().getTime()/1000;
            let name:string=String(registerForm.value.name);
             name=name.slice(0,1).toUpperCase()+name.slice(1,registerForm.value.length).toLowerCase();
           this.user=new UserModel(registrationData['idToken'],registrationData['email'],Math.floor(createdTime)+3480,registerForm.value.gender,name);
           this.userService.setUser(this.user);  
            localStorage.setItem('user',JSON.stringify(this.user));
            avtarImageRef=this.storageRef.child("Avatar/"+this.user.userEmail.replace('.',''));
              
          },(error)=>{
            this.loadingService.stopLoading();
          this.httpService.errorMessageDisplay.next(error);
          })
    
       if(this.user)
       {

           if(this.uploadFile && avtarImageRef)
           {
              await avtarImageRef.put(this.uploadFile).then((snapshot)=>{

                this.uploadImageLocation="Avatar/"+this.userService.getEmailString(this.user.userEmail);
                    
            },(error)=>{
              this.httpService.errorMessageDisplay.next('An unknown error occured');
            }) 

           }
           else
           {
              this.uploadImageLocation="Avatar/"+this.uploadImageDefault[this.user.userGender];
           }


        await  this.httpService.put(environment.firebaseConfig.databaseURL+'/UserData/'+this.userService.getEmailString(this.user.userEmail)+'.json',
           {Name:this.user.userName,Gender:this.user.userGender,Avatar:this.uploadImageLocation}).toPromise().then((registrationDataDatabase)=>{
             
           },(error)=>{
             this.httpService.errorMessageDisplay.next(error);
                this.loadingService.stopLoading();
           })

         await this.httpService.put(environment.firebaseConfig.databaseURL+'/Users/'+this.userService.getEmailString(this.user.userEmail)+'.json',
         {enabled:true}).toPromise().then((entryData)=>{

         },(error)=>{
            this.httpService.errorMessageDisplay.next(error);
               this.loadingService.stopLoading();
         })  
         this.chatService.initializeSocket();
          this.userService.getUserImage();
          registerForm.reset();  
       this.router.navigate(['/chat']);  
       }

      
    
      }

  saveImage(files:FileList)
  {
  	this.fr.onload=()=>{
     this.file=this.fr.result;
     

  	}
   
   let size =files[0].size/1048576

   if(size>=2)
   {
   	this.file=null;
     this.uploadFile=null;
   	this.avatarInput.nativeElement.value="";
   	alert('File size too large.Please upload file upto 2MB');
    

   }
   else
   {
    this.uploadFile=files[0]; 
   	this.fr.readAsDataURL(files[0])
   }
    
  }

}
