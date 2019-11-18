import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private config: any;
    private _ipc: IpcRenderer | undefined;

    async getConfig(value: string){
        let previousConfig = localStorage.getItem("config");
        if (previousConfig){
            this.config = JSON.parse(previousConfig);
        }else{
            this._ipc = window.require('electron').ipcRenderer;
            let configString =  await this._ipc.invoke("get-config");
            let aux = JSON.parse(configString);
            this.config = aux.data;
            localStorage.setItem("config", JSON.stringify(this.config));
        }
        return this.config[value];
    }
}