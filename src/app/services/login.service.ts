import { Injectable } from '@angular/core';
import { GlobalService} from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    
    constructor(private globalService:GlobalService, private http: HttpClient){}

    async login(credentials): Promise<any> {
        let ingressIp = await this.globalService.getConfig("INGRESS_IP");
        let loginUrl = "http://"+ingressIp+"/auth/realms/master/protocol/openid-connect/token";
        var body = 'username=' + credentials.username + '&password=' + credentials.password + "&client_id=admin-cli&grant_type=password";
        const headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return await this.http.post(loginUrl, body, {headers, withCredentials: true}).toPromise();
    }
}   