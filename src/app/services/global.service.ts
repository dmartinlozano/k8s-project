import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { ToastController, LoadingController } from '@ionic/angular';
import { Service } from '../common/class/service';

declare var electron : any;

@Injectable({
    providedIn: 'root'
})
export class GlobalService extends Service{

    private loading: HTMLIonLoadingElement;
    private config: any;

    constructor(
        private toastController: ToastController,
        private loadingController: LoadingController
    ) { 
        super();
    }

    async getConfig(value: string) {
        let previousConfig = localStorage.getItem("config");
        if (previousConfig) {
            this.config = JSON.parse(previousConfig);
        } else {
            let configString = await this.ipc.invoke("get-config");
            let aux = JSON.parse(configString);
            this.config = aux.data;
            localStorage.setItem("config", JSON.stringify(this.config));
        }
        return this.config[value];
    }

    async showError(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 5000
        });
        toast.present();
    }

    async showLoading() {
        this.loading = await this.loadingController.create();
        await this.loading.present();
    }

    async dismissLoading() {
        if (this.loading) {
            this.loadingController.dismiss().catch((err) => {
                err !== "overlay does not exist" ? console.error(err) : null;
            });
            this.loading = null;
        }
    }

    async enableMenu(){
        this.ipc.invoke("enable-menu");
    }
}