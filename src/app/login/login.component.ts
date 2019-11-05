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
    this.loginService.login(this.loginForm.value).then(
      (res: any) => {
        localStorage.setItem("keycloak_token", res.access_token);
        this.router.navigateByUrl('dashboard');
      },
      (error) => {
        console.error(error);
        this.error = error.code + ": " + error.message;
      });
  }

}
