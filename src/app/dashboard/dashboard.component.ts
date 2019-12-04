import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { SoftwareComponent } from './software/software.component';
import { Software } from './software/software.interface';
import availableSoftwareJson from './available_software.json';
import { ToolsService } from '../services/tools.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;
  private ingressIp: string;
  private installedToolsNames: string[];
  private availableSoftware: Software[];

  constructor(private router: Router, private configService:ConfigService, private toolsService: ToolsService, public dialog: MatDialog) { }

  async ngOnInit() {

    //get installed tools
    this.ingressIp = await this.configService.getConfig("INGRESS_IP");
    let it = await this.toolsService.getInstalledTools();
    this.installedToolsNames = it.map(x => x.name).filter(x => x !== "k8s-project-ingress"  && x != "k8s-project-postgresql");

    //print installed tools in left menu:
    this.availableSoftware = availableSoftwareJson.map(x => {
      if (this.installedToolsNames.indexOf(x.id) !== -1){
        return {...x, installed: true};
      }
      return {...x};
    });
  }

  logout() {
    this.router.navigateByUrl('');
  }

  goto(tool:string){
    switch (tool) {
      case 'k8s-project-keycloak':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/auth/admin');
        break;
      case 'k8s-project-gitbucket':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/gitbucket');
        break;
      case 'k8s-project-jenkins':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/jenkins');
        break; 
      case 'k8s-project-wiki-js':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/');
        break; 
      case 'k8s-project-testlink':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/testlink');
        break;
    }
  }

  openSoftwareDialog(): void {
    this.dialog.open(SoftwareComponent, {width: '600px', data: this.availableSoftware });
  }

}
