import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-refresh-interval',
  templateUrl: './refresh-interval.component.html',
  styleUrls: ['./refresh-interval.component.scss']
})
export class RefreshIntervalComponent implements OnInit,OnDestroy {
  interval: number;

  
  constructor(public dialogRef:MatDialogRef<RefreshIntervalComponent>,) { }

  ngOnInit() {
    
  }

  ngOnDestroy(){
      clearInterval(this.interval);
  }
  
  seconds=30;
  setRefreshInterval(intervalTime:number){

    this.interval = +intervalTime;
    this.dialogRef.close({ data_interval: this.interval });
    

  }
}

