import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'k8s-project-form-error',
  templateUrl: './k8s-project-form-error.component.html',
  styleUrls: ['./k8s-project-form-error.component.scss'],
})
export class K8sProjectFormErrorComponent implements OnInit {

  @Input('form') form: FormGroup;
  @Input('field') field: string;
  @Input('view-errors') viewErrors: boolean;

  constructor() { }

  ngOnInit() {}

}
