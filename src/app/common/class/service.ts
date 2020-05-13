import { IpcRenderer } from 'electron';
declare var electron : any;

export class Service{
    ipc?: IpcRenderer;
    ingressIp?: string;

    constructor(){
        this.ipc = electron.ipcRenderer;
    }
}