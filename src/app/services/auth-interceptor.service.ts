import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    let token = localStorage.getItem("keycloak_token_info");
    if (token) {
      let accessToken = JSON.parse(token)["access_token"];
      request = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
    return next.handle(request);
  }

}