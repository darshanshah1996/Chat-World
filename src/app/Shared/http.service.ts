import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError,Subject} from 'rxjs';

@Injectable({providedIn:'root'})


export class HTTPService{

	errorMessageDisplay:Subject<string>=new Subject<string>();
	constructor(private httpClient:HttpClient)
	{

	}


	get(url:string,meta?:Object)
	{
		return this.httpClient.get(url,meta).pipe(catchError((error)=>{
			console.log(error);
           if(error.error && error.error.error.message)
           {
           return throwError( this.errorMessage(error.error.error.message));
           }
           else{
           	return throwError('An unknown error occured');
           }
		}));
	}

	post(url:string,data:Object,meta?:Object)
	{
		return this.httpClient.post(url,data,meta).pipe(catchError((error)=>{
			console.log(error);
           if(error.error &&  error.error.error.message)
           {
           return throwError( this.errorMessage(error.error.error.message));
           }
           else{
           	return throwError('An unknown error occured');
           }
		}))
	}

	put(url:string,data:Object,meta?:Object)
	{
       return this.httpClient.put(url,data,meta).pipe(catchError((error)=>{
			console.log(error);
           if(error.error && error.error.error.message)
           {
           return throwError( this.errorMessage(error.error.error.message));
           }
           else{
           	return throwError('An unknown error occured');
           }
		}));
	}
  delete(url:string,meta?:object)
  {
   return this.httpClient.delete(url).pipe(catchError((error)=>{
      if(error.error && error.error.error.message)
           {
           return throwError( this.errorMessage(error.error.error.message));
           }
           else{
             return throwError('An unknown error occured');
           }
   }))
  }

    errorMessage(errorMessage:string)
   {
      switch(errorMessage)
      {
      	case "EMAIL_EXISTS":return 'Email already exists';
      	case "TOO_MANY_ATTEMPTS_TRY_LATER":return 'Number of attemps excceded.Try later';
        case "EMAIL_NOT_FOUND":return "Invalid Credentials";
        case "INVALID_PASSWORD":return "Invalid Credentials";
        case "USER_DISABLED":return "User Blocked";
      	default: return 'An unknown error occured';
      }
   }
}