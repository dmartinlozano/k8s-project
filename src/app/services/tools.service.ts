import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, retryWhen,  concatMap, catchError } from "rxjs/operators"; 
import { throwError, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ToolsService {
  
    private _ipc: IpcRenderer | undefined;

    constructor(private configService: ConfigService , private http: HttpClient) {
        if (window.require) {
            this._ipc = window.require('electron').ipcRenderer;
        }
    }

    async getInstalledTools(): Promise<any>{
        let auxS = await this._ipc.invoke("get-installed-tools");
        return JSON.parse(auxS);
    }

    async installTools(toolsToInstall):Promise<any>{
        await Promise.all(toolsToInstall.map(async (tool) => {
            await this._ipc.invoke("install-tool", tool);
        }));
    }

    async uninstallTools(toolsToUninstall):Promise<any>{
        await Promise.all(toolsToUninstall.map(async (tool) => {
            await this._ipc.invoke("uninstall-tool", tool);
        }));
    }

    async waitUntilToolsIsAvailable(path: string): Promise<any>{
        let ingressIp = await this.configService.getConfig("INGRESS_IP");
        let url = "http://"+ingressIp+"/"+path;
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.get(url, {headers}).pipe(
            retryWhen(errors => errors.pipe(
                concatMap(error => error.status === 200 ? throwError(200): of(error).pipe(delay(5000)))
            )),
            catchError(error => error === 200 ? of ('OK'): throwError(error))
        ).toPromise();
    }

}