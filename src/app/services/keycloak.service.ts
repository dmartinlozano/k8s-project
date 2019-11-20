import { Injectable } from '@angular/core'
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class KeycloakService {

    private _ipc: IpcRenderer | undefined;

    constructor(private configService: ConfigService, private http: HttpClient) {
        if (window.require) {
            this._ipc = window.require('electron').ipcRenderer;
        }
    }

    waitUntilToolIsAvailable(tool){
        //TODO
    }

    fixEmailForAdmin(sign){
        //TODO
    }

    async install(credentials): Promise<any>{
        return await this._ipc.invoke("keycloak-install", credentials);
    }

    async configureGitbucket(){
        let ingressIp = await this.configService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients?clientId=gitbucket";
        let postClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "gitbucket",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+ingressIp+"/*"],
                "secret": "gitbucket"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }

    async configureJenkins(){
        let ingressIp = await this.configService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients?clientId=jenkins";
        let postClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "jenkins",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+ingressIp+"/*"],
                "secret": "jenkins"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }

    async configureWikijs(){
        let ingressIp = await this.configService.getConfig("INGRESS_IP");

        //check current clientId
        let findClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients?clientId=wiki-js";
        let postClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients/";
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let exists: any = await this.http.get(findClientIdURL, {headers}).toPromise();
        if (exists.length === 0){
            let body = { "id": "wiki-js",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://"+ingressIp+"/*"],
                "secret": "wiki-js"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }
}