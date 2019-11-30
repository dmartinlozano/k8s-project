import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("keycloak_token_info");
    if (token !== null) {
      let accessToken = JSON.parse(token)["access_token"];
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
    return next.handle(req);
  }
}