import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../_helpers/config.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;
  ingressIp: string;
  softwareNames: string[];

  constructor(private router: Router, private configService:ConfigService) { }

  async ngOnInit() {
    this.ingressIp = await this.configService.getConfig("ingressIp");
    let it = await this.configService.getConfig("installedTools");
    this.softwareNames = it.Releases.map(x => x.Name).filter(x => x !== "k8s-project-ingress");
  }

  logout() {
    this.router.navigateByUrl('');
  }

  goto(tool:string){
    switch (tool) {
      case 'keycloak':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/auth/admin');
        break;
    }
  }

}
