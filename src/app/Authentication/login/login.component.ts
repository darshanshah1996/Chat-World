import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {LoadingService} from '../../Shared/loading.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loadingService:LoadingService) { }
  loadingIndicator:boolean=false;
  ngOnInit() {

  	this.loadingService.loadingIndicatorUpdate.subscribe((loadingStatus)=>{
  		this.loadingIndicator=loadingStatus;
  	})
  }
   
 

}
