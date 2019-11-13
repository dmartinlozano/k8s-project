import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class ToolsService {
  
    private _ipc: IpcRenderer | undefined;

    constructor() {
        if (window.require) {
            this._ipc = window.require('electron').ipcRenderer;
        }
    }

    async getInstalledTools(): Promise<any>{
        let auxS = await this._ipc.invoke("get-installed-tools");
        return JSON.parse(auxS);
    }

    async installTools(toolsToInstall):Promise<any>{
        return await this._ipc.invoke("install-tools", toolsToInstall);
    }

    async uninstallTools(toolsToUninstall):Promise<any>{
        return await this._ipc.invoke("uninstall-tools", toolsToUninstall);
    }

}