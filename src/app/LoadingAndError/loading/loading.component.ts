import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../Shared/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(private loadingService:LoadingService) { }
  loadingIndicator:boolean=false;
  ngOnInit() {

  	this.loadingService.loadingIndicatorUpdate.subscribe((loadingStatus)=>{
  		this.loadingIndicator=loadingStatus;
  	})
  }

}
