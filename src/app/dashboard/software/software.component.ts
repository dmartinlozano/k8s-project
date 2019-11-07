import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dashboard-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SoftwareComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
  install(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
