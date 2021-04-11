import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
const initialHeight=window.innerHeight;

 document.documentElement.style.setProperty('overflow', 'auto')
 const metaViewport = document.querySelector('meta[name=viewport]')
 metaViewport.setAttribute('content', 'height=' + initialHeight + 'px, width=device-width, initial-scale=1.0');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
