import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class SignupRootService {

    ipcRenderer: typeof ipcRenderer;

    get isElectron() {
        return <any>window && (<any>window).process && (<any>window).type;
    }

    constructor() {
        if (this.isElectron) {
            this.ipcRenderer =(<any>window).require('electron').ipcRenderer;
        }
    }

    checkIfKeyCloakIsInstalled(): Promise<boolean> {
        var _this = this;
        if (!this.isElectron) {
            return new Promise( (resolve) => { return resolve(true)});
        }
        return new Promise(function (resolve) {
            _this.ipcRenderer.send("check-keycloak-installed-on");
            _this.ipcRenderer.on("check-keycloak-installed-success", (event, isInstalled) => {
                event.preventDefault();
                return resolve(isInstalled);
            });
        });
    }

}