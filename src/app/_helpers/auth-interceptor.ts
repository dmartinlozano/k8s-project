import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ( ! req.url.endsWith("/auth/realms/master/protocol/openid-connect/token")) {
      let token = localStorage.getItem("keycloak_token_info");
      let accessToken = JSON.parse(token)["access_token"];
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req);
  }
}