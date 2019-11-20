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
        await Promise.all(toolsToInstall.map(async (tool) => {
            await this._ipc.invoke("install-tool", tool);
        }));
    }

    async uninstallTools(toolsToUninstall):Promise<any>{
        await Promise.all(toolsToUninstall.map(async (tool) => {
            await this._ipc.invoke("uninstall-tool", tool);
        }));
    }

}