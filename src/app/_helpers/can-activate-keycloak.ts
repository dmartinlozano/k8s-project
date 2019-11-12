import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class CanActivateKeycloak implements CanActivate {

    constructor(private router: Router) {}

    canActivate() {
        let token = localStorage.getItem("keycloak_token_info");
        const jwt = jwt_decode(JSON.parse(token)["access_token"]);
        let currentTime = new Date().getTime() / 1000;
        if (currentTime > jwt.exp) { 
            this.router.navigate(['/login']);
            return false;
        }else{
            return true;
        }
    }
}