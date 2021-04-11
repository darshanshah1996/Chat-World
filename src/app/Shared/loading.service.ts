import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
 
@Injectable({providedIn:'root'})


export class LoadingService{

loadingIndicatorUpdate:Subject<boolean>=new Subject<boolean>();
startLoading()
{
	this.loadingIndicatorUpdate.next(true);
}

stopLoading()
{
 this.loadingIndicatorUpdate.next(false);
}
}
