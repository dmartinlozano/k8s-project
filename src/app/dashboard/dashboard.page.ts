import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import availableSoftware from '../common/available_software.json';
import { ToolService } from '../services/tool.service';
import { GlobalService } from '../services/global.service';

class Tool{
  id : string;
  name: string;
  description: string;
  path: string;
  recommended: boolean;
  showLoading: boolean;
  installed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;
  availableSoftware: Tool[] = availableSoftware;
  ingressIp: string;

  constructor(
    private toolService: ToolService,
    private globalService: GlobalService) {
    this.globalService.dismissLoading();
  }

  ngOnInit() {
    //if left tools is installed, hidde loading and set installed how true
    this.toolService.getInstalledTools().then((tools)=>{
      tools.forEach(tool => {
        this.availableSoftware.forEach(available=>{
          if (available.id === tool.name){
            available.installed = true;
          }
        });
      });
      this.availableSoftware.map((i)=>{i.showLoading = false});
    });
    this.globalService.getConfig("INGRESS_IP").then((ip)=>this.ingressIp = ip);
  }

  openTool(tool) {
    if (tool.installed) {
      this.mainContent.nativeElement.setAttribute('src', 'http://' + this.ingressIp + "/" + tool.path);
    }
  }
}
