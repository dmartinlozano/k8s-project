import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Software } from './software.interface';
import { ElectronService } from 'src/app/_helpers/electron.service';
import { KeycloakService } from 'src/app/services-tools/keycloak.service';
import { GitbucketService } from 'src/app/services-tools/gitbucket.service';

@Component({
  selector: 'dashboard-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent{

  showSpinner: boolean = false;
  software: Software[];

  constructor(
    private electronService: ElectronService, 
    private keycloakService: KeycloakService, 
    private gitbucketService: GitbucketService,
    private dialogRef: MatDialogRef<SoftwareComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Software[]) { 
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

    if (toInstall.indexOf("gitbucket")){
      await this.keycloakService.configureGitbucket();
    }
    this.dialogRef.close();
  }

}
