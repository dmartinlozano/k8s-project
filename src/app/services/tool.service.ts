import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { ToastController, LoadingController } from '@ionic/angular';

declare var electron : any;

@Injectable({
    providedIn: 'root'
})
export class ToolService {

    private ipc: IpcRenderer | undefined;

    constructor(
        private toastController: ToastController,
        private loadingController: LoadingController
    ) { 
        this.ipc = electron.ipcRenderer;
    }

    async getInstalledTools(): Promise<any>{
        let auxS = await this.ipc.invoke("get-installed-tools");
        return JSON.parse(auxS);
    }
}