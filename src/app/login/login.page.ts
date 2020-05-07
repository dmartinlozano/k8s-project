import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  viewErrors: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
    });
  }

  async login(){
    if (this.loginForm.valid){
      try {
        this.globalService.showLoading();
        let res = await this.loginService.login(this.loginForm.value);
        localStorage.setItem("keycloak_token_info", JSON.stringify(res));
        this.router.navigateByUrl('dashboard');
      } catch (error) {
        console.error(error);
        this.globalService.showError(error.status + ": " + error.statusText);
      };
    }else{
      this.viewErrors = true;
    }
  }

}
