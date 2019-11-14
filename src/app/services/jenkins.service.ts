import { Injectable } from '@angular/core'
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class JenkinsService {

    constructor(private configService: ConfigService, private http: HttpClient) {}

    async configurePermissions(){
        //TODO matrix: https://joostvdg.github.io/blogs/kubernetes-sso-keycloak/
    }

}