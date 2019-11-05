import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ElectronService } from '../_helpers/electron.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private electronService: ElectronService, private formBuilder: FormBuilder) { }
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
    });

    if (window["installKeyCloak"] === "true") {
      this.router.navigateByUrl('singup-root');
    }
  }

  login() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    //https://stackoverflow.com/questions/49572291/keycloak-user-validation-and-getting-token
    this.router.navigateByUrl('dashboard');
  }

}
