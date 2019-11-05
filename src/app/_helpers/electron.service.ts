import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class ElectronService {
  
    private _ipc: IpcRenderer | undefined;

    constructor() {
        if (window.require) {
            this._ipc = window.require('electron').ipcRenderer;
        }
    }

    async getIngressIp(): Promise<string>{
        return await this._ipc.invoke("get-ingress-ip");
    }

    async installKeycloak(credentials): Promise<any>{
        return await this._ipc.invoke("keycloak-install", credentials);
    }

}