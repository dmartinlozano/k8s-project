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

    getIngressIp(): Promise<string>{
        var _this = this;
        if (this._ipc) {
            return new Promise(function (resolve) {
                _this._ipc.send("get-ingress-ip-on");
                _this._ipc.on("get-ingress-ip-success", (event, ingressIp) => {
                    return resolve(ingressIp);
                });
            });
        }
        else{
            throw new Error("Error to access ingress ip");
        }
    }

    async installKeycloak(): Promise<any>{
        return await this._ipc.invoke("keycloak-install");
    }

}