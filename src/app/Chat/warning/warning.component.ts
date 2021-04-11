import { Component, OnInit,Input,OnDestroy } from '@angular/core';


import {ChatService} from '../../Shared/chat.service';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent implements OnInit,OnDestroy {

 @Input() warningMessage:string=null;
 
  constructor(private chatService:ChatService) { 

  }

  ngOnInit(): void {
  
   
  }
  closeWarning()
  {
  	this.chatService.warningMessage.next(null);
  }

  ngOnDestroy()
  {
    
  }
}
