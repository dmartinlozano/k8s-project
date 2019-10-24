import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../_helpers/electron.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-signup-root',
  templateUrl: './signup-root.component.html',
  styleUrls: ['./signup-root.component.scss']
})
export class SignupRootComponent implements OnInit {

  //MORE INFO: 
  //https://itnext.io/materror-cross-field-validators-in-angular-material-7-97053b2ed0cf

  signForm: FormGroup;
  signFormSubmitted = false;

  constructor(private router: Router, private electronService: ElectronService, private formBuilder: FormBuilder) { }
  get f() { return this.signForm.controls; }

  async ngOnInit() {
    try {
      this.signForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
        verifyPassword: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])|(?=.*[A-Z])$")]],
      }, {
            validator: MustMatch('password', 'verifyPassword')
        });
      let keycloakIsInstalled: boolean = await this.electronService.checkIfKeyCloakIsInstalled();
      if (keycloakIsInstalled === true) {
        this.router.navigateByUrl('/login');
      }
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
      await this.electronService.installKeycloak();
      this.router.navigateByUrl('dashboard');
     } catch (err) {
      console.error(err);
    } 
  }

}
