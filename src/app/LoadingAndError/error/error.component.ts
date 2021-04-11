import { Component, OnInit } from '@angular/core';
import {HTTPService} from '../../Shared/http.service';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

errorMessage:string;	

  constructor(private httpService:HTTPService) { }

  ngOnInit() {
    this.httpService.errorMessageDisplay.subscribe((errorMessage)=>{

    	this.errorMessage=errorMessage;
    	setTimeout(()=>{this.errorMessage=null},1450);
    })

  }

}
