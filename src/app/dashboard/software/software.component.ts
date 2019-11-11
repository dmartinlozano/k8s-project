import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Software } from './software.interface';
import { ElectronService } from 'src/app/_helpers/electron.service';

@Component({
  selector: 'dashboard-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent{

  showSpinner: boolean = false;
  software: Software[];

  constructor(private electronService: ElectronService, private dialogRef: MatDialogRef<SoftwareComponent>, @Inject(MAT_DIALOG_DATA) public data: Software[]) { 
    this.software = data;
  }

  close(): void {
    this.dialogRef.close();
  }

  async install() {
    this.showSpinner = true;
    let toInstall = this.software.filter(x=>{return x.installed === true}).map(x=>{return x.id});
    let toUninstall = this.software.filter(x=>{return x.installed === false}).map(x=>{return x.id});
    await this.electronService.installTools(toInstall.join(' '));
    await this.electronService.uninstallTools(toUninstall.join(' '));

    //TODO after install, the new software must be configured.
    //gitbucket with keycloak: https://github.com/gitbucket/gitbucket/wiki/OpenID-Connect-Settings
    this.dialogRef.close();
  }

}
