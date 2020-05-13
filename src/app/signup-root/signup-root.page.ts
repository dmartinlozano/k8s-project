import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../common/must-match.validator';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-signup-root',
  templateUrl: './signup-root.page.html',
  styleUrls: ['./signup-root.page.scss'],
})
export class SignupRootPage implements OnInit {

  singupRootForm: FormGroup;
  viewErrors: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    private keycloakService: KeycloakService,
    private toolService: ToolService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.singupRootForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
      retryPassword: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
    }, {
      validator: MustMatch('password', 'retryPassword')
    });
  }

  async signup(){
    if (this.singupRootForm.valid){
      try {
        await this.globalService.showLoading();
        await this.keycloakService.install(this.singupRootForm.value);
        await this.toolService.waitUntilToolsIsAvailable("k8s-project-keycloak");
        let res = await this.userService.login(this.singupRootForm.value);
        localStorage.setItem("keycloak_token_info", JSON.stringify(res));
        this.router.navigateByUrl('dashboard');
      } catch (error) {
        console.error(error);
        await this.globalService.dismissLoading();
        this.globalService.showError(error.status + ": " + error.statusText);
      };
    }else{
      this.viewErrors = true;
    }
  }

}
