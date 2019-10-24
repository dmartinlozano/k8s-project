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

    checkIfKeyCloakIsInstalled(): Promise<boolean> {
        var _this = this;
        if (_this._ipc) {
            return new Promise(function (resolve) {
                _this._ipc.send("is-keycloak-installed-on");
                _this._ipc.on("is-keycloak-installed-success", (event, isInstalled) => {
                    return resolve(isInstalled);
                });
            });
        }else{
            throw new Error("Error checking if keycloack is installed");
        }
    }

    installKeycloak(): Promise<any>{
        var _this = this;
        if (_this._ipc) {
            return new Promise(function (resolve) {
                _this._ipc.send("keycloak-install-on");
                _this._ipc.on("keycloak-install-success", (event, isInstalled) => {
                    return resolve(isInstalled);
                });
            });
        }else{
            throw new Error("Error checking if keycloack is installed");
        }
    }

}