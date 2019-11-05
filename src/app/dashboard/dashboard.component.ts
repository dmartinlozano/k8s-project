import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from '../_helpers/electron.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;
  ingressIp: string;

  constructor(private router: Router, private electronService: ElectronService) { }

  async ngOnInit() {
    this.ingressIp = await this.electronService.getIngressIp();
  }

  logout() {
    this.router.navigateByUrl('dashboard');
  }

  goto(tool:string){
    switch (tool) {
      case 'keycloak':
        this.mainContent.nativeElement.setAttribute('src', 'http://'+this.ingressIp+'/auth/admin');
        break;
    }
  }

}
