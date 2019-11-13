import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../_helpers/electron.service';
import { KeycloakService } from '../services-tools/keycloak.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-signup-root',
  templateUrl: './signup-root.component.html',
  styleUrls: ['./signup-root.component.scss']
})
export class SignupRootComponent implements OnInit {

  signForm: FormGroup;
  signFormSubmitted = false;

  constructor(private router: Router, private electronService: ElectronService, private keycloakService: KeycloakService, private formBuilder: FormBuilder) { }
  get f() { return this.signForm.controls; }

  ngOnInit() {
    try {
      this.signForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
        verifyPassword: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
      }, {
            validator: MustMatch('password', 'verifyPassword')
        });
    } catch (err) {
      console.error(err);
    }
  }

  async signup() {
    this.signFormSubmitted = true;
    if (this.signForm.invalid) {
      return;
    }
    try{
      this.electronService.installKeycloak(this.signForm.value);
      this.keycloakService.waitUntilToolIsAvailable('keycloak');
      this.keycloakService.fixEmailForAdmin(this.signForm.value);
      this.router.navigateByUrl('dashboard');
     } catch (err) {
      console.error(err);
    } 
  }

}
