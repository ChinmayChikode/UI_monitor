import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-refresh-table',
  templateUrl: './refresh-table.component.html',
  styleUrls: ['./refresh-table.component.scss']
})
export class RefreshTableComponent implements OnInit {


  interval: number;
  time:number;  

  constructor(public dialogRef:MatDialogRef<RefreshTableComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any) {
                
               }

  ngOnInit() {
        
    }
    
  seconds=this.data.refresh_interval;
  
  setRefreshInterval(intervalTime:number){
    console.log("recieved dig data: "+this.data.refresh_interval);
    this.interval = +intervalTime;
    this.dialogRef.close({ data_interval: this.interval });
    
  }

}
