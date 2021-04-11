import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';


import { AppComponent } from './app.component';

import {AppRouting} from './app-routing.module';
import { ErrorComponent } from './LoadingAndError/error/error.component';
import { LoadingComponent } from './LoadingAndError/loading/loading.component';
import {HTTPInterceptors} from './Shared/http.interceptor';


//import { ChatTemplateComponent } from './Chat/chat-template/chat-template.component';
//import { LoginComponent } from './Authentication/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    LoadingComponent,
    
   
   // ChatTemplateComponent,
  //  LoginComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting,
    

  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:HTTPInterceptors,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
