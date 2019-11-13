import { Injectable } from '@angular/core'
import { ConfigService } from '../_helpers/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class KeycloakService {

    constructor(private configService: ConfigService, private http: HttpClient){}
    waitUntilToolIsAvailable(tool){
        //TODO
    }

    fixEmailForAdmin(sign){
        //TODO
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