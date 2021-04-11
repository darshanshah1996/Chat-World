import { Component, OnInit } from '@angular/core';
 import {NgForm} from '@angular/forms';
 import {HttpParams} from '@angular/common/http'; 

 import {environment} from '../../../../environments/environment';
 import {HTTPService} from '../../../Shared/http.service';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  resetMessageStatus:boolean=false;
  constructor(private httpService:HTTPService) { }

  ngOnInit() {
  }
  resetSubmit(resetForm:NgForm)
  {
    
     this.httpService.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode',
       {requestType:'PASSWORD_RESET',email:resetForm.value.username},{params:new HttpParams().
         append('key',environment.firebaseConfig.apiKey)}).subscribe((data)=>{

         },(error)=>{

         })
     this.resetMessageStatus=true;    
     resetForm.reset();    

  }
  resetEmailInput()
  {
    this.resetMessageStatus=false;
  }
}
