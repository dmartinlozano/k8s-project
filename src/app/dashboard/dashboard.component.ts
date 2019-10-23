import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('mainContent', {static: false}) mainContent: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  goto(tool:string){
    $("#mainContent").setAttribute("data", "http://40.87.141.55/auth/admin")
  }

}
