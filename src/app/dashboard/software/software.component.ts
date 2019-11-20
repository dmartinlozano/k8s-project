import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Software } from './software.interface';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { GitbucketService } from 'src/app/services/gitbucket.service';
import { JenkinsService } from 'src/app/services/jenkins.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'dashboard-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent{

  showSpinner: boolean = false;
  software: Software[];

  constructor(
    private toolsService: ToolsService, 
    private keycloakService: KeycloakService, 
    private gitbucketService: GitbucketService,
    private jenkinsService: JenkinsService,
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
    await this.toolsService.installTools(toInstall);
    await this.toolsService.uninstallTools(toUninstall);

    if (toInstall.indexOf("k8s-project-gitbucket")){
      await this.keycloakService.configureGitbucket();
    }
    if (toInstall.indexOf("k8s-project-jenkins")){
      await this.keycloakService.configureJenkins();
      await this.jenkinsService.configurePermissions();
    }
    if (toInstall.indexOf("k8s-project-wiki-js")){
      await this.keycloakService.configureWikijs();
    }
    this.dialogRef.close();
  }

}
