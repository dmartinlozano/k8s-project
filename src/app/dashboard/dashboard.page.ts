import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToolService } from '../services/tool.service';
import { GlobalService } from '../services/global.service';
import { Tool } from '../common/class/tool';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;
  tools: Tool[];
  ingressIp: string;

  constructor(
    private toolService: ToolService,
    private globalService: GlobalService) {
      this.globalService.enableMenu();
      this.globalService.dismissLoading();
      this.tools = this.toolService.tools;
  }

  ngOnInit() {
    //if left tools is installed, hidde loading and set installed how true
    this.toolService.getInstalledTools().then((tools)=>{
      tools.forEach(tool => {
        this.tools.forEach(available=>{
          if (available.id === tool.name){
            available.installed = true;
          }
        });
      });
      this.tools.map((i)=>{i.showLoading = false});
    });
    this.globalService.getConfig("INGRESS_IP").then((ip)=>this.ingressIp = ip);
  }

  openTool(tool) {
    if (tool.installed) {
      this.mainContent.nativeElement.setAttribute('src', 'http://' + this.ingressIp + "/" + tool.path);
    }
  }
}
