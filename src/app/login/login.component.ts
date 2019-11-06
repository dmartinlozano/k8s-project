import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFormSubmitted = false;
  showSpinner = false;
  @Input() error: string | null;

  constructor(private router: Router, private loginService: LoginService, private formBuilder: FormBuilder) { }
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    localStorage.clear();
    if (window["installKeyCloak"] === "true") {
      this.router.navigateByUrl('singup-root');
    }
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
    });
  }

  async login() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    try {
      let res = await this.loginService.login(this.loginForm.value);
      localStorage.setItem("keycloak_token_info", JSON.stringify(res));
      this.router.navigateByUrl('dashboard');
    } catch (error) {
      console.error(error);
      this.error = error.code + ": " + error.message;
    };
  }
}
