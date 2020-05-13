import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Tool } from '../common/class/tool';
import availableSoftware from '../common/available_software.json';
import { GlobalService } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, retryWhen,  concatMap, catchError, take } from "rxjs/operators"; 
import { throwError, of } from 'rxjs';
import { Service } from '../common/class/service';
import { KeycloakService } from './keycloak.service';


@Injectable({
    providedIn: 'root'
})
//Manage install a tool except keycloak
export class ToolService extends Service{

    public tools: Tool[] = availableSoftware;


    constructor(
        private globalService: GlobalService, 
        private http: HttpClient,
        private keycloakService: KeycloakService
    ) { 
        super();
        this.ipc = this.globalService.ipc;
    }

    async getInstalledTools(): Promise<any>{
        let auxS = await this.ipc.invoke("get-installed-tools");
        return JSON.parse(auxS);
    }

    async installTools(tools: Tool[]){
        tools.forEach((tool: Tool)=>{
            let found: Tool = this.tools.find((x)=>x.id === tool.id);
            if (found) found.showLoading = true;
            //Install tool
            this.ipc.invoke("install-tool", found.id).then(()=>{

                //configure in keycloak
                //wait until tools is available
                let promises = [this.waitUntilToolsIsAvailable(found.id)];
                switch(found.id){
                    case "k8s-project-gitbucket": promises.push(this.keycloakService.configureGitbucket()); break;
                    case "k8s-project-jenkins": promises.push(this.keycloakService.configureJenkins()); break;
                    case "k8s-project-wiki-js": promises.push(this.keycloakService.configureWikijs()); break;
                }
                
                Promise.all(promises).then(()=>{
                    found.showLoading = false;
                    found.installed = true;
                }).catch(error=>{
                    console.error(error);
                    this.globalService.showError(error.status + ": " + error.statusText);
                }); 
            }).catch(error=>{
                console.error(error);
                this.globalService.showError(error.status + ": " + error.statusText);
            })
        });
    }

    async waitUntilToolsIsAvailable(idTool: string): Promise<any>{
        this.ingressIp = await this.globalService.getConfig("INGRESS_IP");
        let tool = this.tools.find(x => x.id === idTool);
        let url = "http://"+this.ingressIp+"/"+tool.path;
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('rejectUnauthorized', 'false')
        return this.http.get(url, {headers}).pipe(
            retryWhen(errors => errors.pipe(
                concatMap(error => error.status === 200 ? throwError(200): of(error).pipe(delay(5000)))
            )),
            take(120),
            catchError(error => error === 200 ? of ('OK'): throwError(error))
        ).toPromise();
    }

    /*updateTools(tools: Tool[]){
        this.tools.next(tools);
    }

    ifUpdatedTools(): Observable<Tool[]> {
        return this.tools.asObservable();
    }*/



}