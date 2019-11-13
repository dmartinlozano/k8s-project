import { Injectable } from '@angular/core'
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
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
        let ingressIp = await this.configService.getConfig("ingressIp");

        //check current clientId
        let findClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients?clientId=gitbucket";
        let postClientIdURL = "http://"+ingressIp+"/auth/admin/realms/master/clients/";
        let exists: any = await this.http.get(findClientIdURL).toPromise();
        if (exists.length === 0){
            let body = { "id": "gitbucket",
                "protocol": "openid-connect",
                "publicClient": false,
                "redirectUris": ["http://40.87.141.55/*"],
                "secret": "gitbucket"
            }
            await this.http.post(postClientIdURL,body).toPromise();
        }
    }

}