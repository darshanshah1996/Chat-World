import {Injectable} from '@angular/core';
import {CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot,Router} from '@angular/router';
import{Observable} from 'rxjs';


import {UserService} from './user.service';
import {UserModel} from './user.model';

@Injectable({providedIn:'root'})

export class LoginGuard implements CanActivate
{

	constructor(private userService:UserService,private router:Router)
	{

	}
	canActivate(activateRoute:ActivatedRouteSnapshot,routerState:RouterStateSnapshot)
	:Observable<boolean>|Promise<boolean>|boolean
	{
      this.userService.userToken.subscribe((user:UserModel)=>{
      	if(user===null|| user===undefined)
      	{
            this.router.navigate(['/']);
            return false;
      	}
      
      })
      return true;
    
	}

}