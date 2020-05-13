import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToolService } from './tool.service';
import { GlobalService } from './global.service';
import { Service } from '../common/class/service';

declare var electron : any;

@Injectable({
    providedIn: 'root'
})
export class KeycloakService extends Service{

    constructor(
        public globalService: GlobalService, 
        public http: HttpClient
    ) {
        super();
    }

    fixEmailForAdmin(sign){
        //TODO
    }

    async install(credentials): Promise<any>{
        return await this.ipc.invoke("install-keycloak", credentials);
    }

    async configureGitbucket(){
        this.ingressIp = await this.globalService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients?clientId=gitbucket";
        let postClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "gitbucket",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+this.ingressIp+"/*"],
                "secret": "gitbucket"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }

    async configureJenkins(){
        this.ingressIp = await this.globalService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients?clientId=jenkins";
        let postClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "jenkins",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+this.ingressIp+"/*"],
                "secret": "jenkins"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }

    async configureWikijs(){
        this.ingressIp = await this.globalService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients?clientId=wiki-js";
        let postClientIdURL = "http://"+this.ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "wiki-js",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+this.ingressIp+"/*"],
                "secret": "wiki-js"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }
}