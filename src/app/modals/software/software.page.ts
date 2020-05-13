import { Component, OnInit } from '@angular/core';
import { Tool } from 'src/app/common/class/tool';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.page.html',
  styleUrls: ['./software.page.scss'],
})
export class SoftwarePage implements OnInit {

  //must be a copy for not update the menu
  tools: Tool[] = [];

  constructor(
    private modalController: ModalController,
    private toolService: ToolService,
    private globalService: GlobalService
  ) {
    this.tools = this.toolService.tools.map(a => ({...a}));
   }

  ngOnInit() {
  }

  cancel(){
    this.dismiss();
  }

  async accept(){
    this.globalService.showLoading();
    //get installed
    let toInstall: Tool[] = this.tools.filter(x=>{return x.installed === true && x.id !== "k8s-project-keycloak"});
    let alreadyInstalled = await this.toolService.getInstalledTools();
    alreadyInstalled = alreadyInstalled.map(i=>i.name);
    //remove from tools that already installed
    let alreadyToInstall: Tool[] = toInstall.filter(x=>alreadyInstalled.indexOf(x.id) < 0);
    this.toolService.installTools(alreadyToInstall);
    this.dismiss();
    this.globalService.dismissLoading();
  }

  async dismiss(){
    const modal = await this.modalController.getTop();
    if (modal) {
        modal.dismiss().catch((err)=>{
          err !== "overlay does not exist" ? console.error(err): null;
        });
    }
  }

}
