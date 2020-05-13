import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IpcRenderer } from 'electron';
import { SoftwarePage } from './modals/software/software.page';

declare var electron : any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private ipcRenderer: IpcRenderer | undefined;
  
  constructor(
    private platform: Platform,
    private router: Router,
    public modalController: ModalController
  ) {
    this.ipcRenderer = electron.ipcRenderer;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (window["installKeyCloak"] === "true") {
        this.router.navigateByUrl('signup-root');
      }else{
        this.router.navigateByUrl('login');
      }

      //events from menu:
      this.ipcRenderer.on('menu-logout', (event, ...args) => {
        localStorage.clear();
        this.router.navigateByUrl('login');
      });

      this.ipcRenderer.on('view-tool-modal', async (event, ...args) => {
        const modal = await this.modalController.create({
          component: SoftwarePage,
          backdropDismiss: false
        });
        return await modal.present();
      });

    });
  }
}
