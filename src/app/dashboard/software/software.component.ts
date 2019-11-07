import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Software } from './software.interface';

@Component({
  selector: 'dashboard-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SoftwareComponent>, @Inject(MAT_DIALOG_DATA) public availableSoftware: Software) { }

  close(): void {
    this.dialogRef.close();
  }
  install(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.availableSoftware);
  }

}
