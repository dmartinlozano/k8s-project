import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SoftwarePageModule } from './modals/software/software.module';
import { AuthInterceptorService } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    SoftwarePageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
