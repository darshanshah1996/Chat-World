import {Injectable} from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,} from '@angular/common/http';
import {UserService} from './user.service';
import {UserModel} from './user.model';
import {exhaustMap,take} from 'rxjs/operators';


@Injectable()

export class HTTPInterceptors implements HttpInterceptor {
	constructor(private userService:UserService)
	{

	}
  intercept(req:HttpRequest<any>,next:HttpHandler)
  {
  	 let modifiedRequest:HttpRequest<any>;	
     return this.userService.userToken.pipe(take(1),exhaustMap((user:UserModel)=>{
      
     	if(user && req.url.search(/firebase/img)>=0)
     	{
          modifiedRequest=req.clone({params:req.params.append('auth',user.token)});

     	}
     	else
     	{
     		modifiedRequest=req.clone(); 
     	}
       //console.log(modifiedRequest.url);
     	  return next.handle(modifiedRequest);
     	}
     ))

  }


}