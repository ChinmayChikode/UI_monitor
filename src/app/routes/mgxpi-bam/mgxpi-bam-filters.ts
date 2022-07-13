import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DATE_FORMATS,MAT_DIALOG_DATA } from '@angular/material';
import { bamFilters } from "./mgxpi-bam.component";


export const MY_DATE_FORMATS = {
  parse: {
    //  dateInput: 'DD-MM-YYYY HH:mm:ss'
      dateInput: 'yyyy-MM-dd HH:mm:ss.SSS'
  },
  display: {
      dateInput: 'YYYY-MM-DD HH:mm:ss.SSS',
      monthYearLabel: 'YYYY MMM',
      dateA11yLabel: 'DD-MM-YYYY HH:mm:ss',
      monthYearA11yLabel: 'YYYY MMM'
  }
}

// Dialog
@Component({
    selector: 'mgxpi-bam-filters',
    templateUrl: 'mgxpi-bam-filters.html',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    providers: [
          {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    ]
  })
  export class MgxpiBAMFiltersComponent implements OnInit{
  
    bamFilters: bamFilters[];
    cols: any[];
  
  
   filterFromDate: string;
   filterToDate: string;
   filterUserKey1: string;
  filterUserKey2: string;

    constructor(public dialogRef:MatDialogRef<MgxpiBAMFiltersComponent>,
        @Inject(MAT_DIALOG_DATA) public data:any) { }
  
    ngOnInit() {}
    
    //@Output() filterEvent = new EventEmitter<string>();
  
    applyFilters(fromDate:string, toDate:string, userKey1:string, userKey2:string){
     
        console.log("Call inside apply filters funcion");
        if(fromDate != null){
        this.filterFromDate= fromDate;
        this.filterToDate = toDate;
        this.filterUserKey1= userKey1;
        this.filterUserKey2 = userKey2;
        console.log("Apply filters attributes obtained");
        }
        else
        {
          this.filterFromDate= "clear";
          this.filterToDate = "";
          this.filterUserKey1= "";
          this.filterUserKey2 = "";
          console.log("Clear filters requested");
        }
        this.dialogRef.close({ fromdt: this.filterFromDate ,todt :this.filterToDate ,uk1: this.filterUserKey1 ,uk2: this.filterUserKey2});
    }
  }
