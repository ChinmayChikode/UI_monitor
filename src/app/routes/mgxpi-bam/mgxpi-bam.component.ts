import { SidenavService } from 'app/services/sidenav.service';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ViewEncapsulation, EventEmitter, Output, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { urls } from './../../../environments/accessurls';
import { SettingsService } from './../../core/services/settings.service';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MatTooltip, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from '../admin-layout/header/header.component';
import { RefreshIntervalComponent } from '../refresh-interval/refresh-interval.component';
import { MgxpiBAMFiltersComponent } from './mgxpi-bam-filters';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';


export interface Blob {
  value: string;
  viewValue: string;
}

export interface bam {
  displayCreatedTime;
  createTimeStamp;
  category:string;
  severity:number;
  statuscode:number;
  messagestring:string;
  blobexists:boolean;
  userKey1: string;
  userKey2: string;
  userblob: string;
  filter:string;
}

export interface bamFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

export interface bamFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

export const MY_DATE_FORMATS = {
  parse: {
      dateInput: 'DD-MM-YYYY HH:mm:ss'
  },
  display: {
      dateInput: 'DD-MM-YYYY HH:mm:ss',
      monthYearLabel: 'YYYY MMM',
      dateA11yLabel: 'DD-MM-YYYY HH:mm:ss',
      monthYearA11yLabel: 'YYYY MMM'
  }
}

@Component({
  selector: 'app-mgxpi-bam',
  templateUrl: './mgxpi-bam.component.html',
  styleUrls: ['./mgxpi-bam.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    HeaderComponent,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class MgxpiBamComponent implements OnInit, OnDestroy, AfterViewInit {

  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'dt', 
  }

  options = this.settings.getOptions();
  opened = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  bam: bam[];
  cols: any[];
  interval: any;

  showFiller = false;

  testValue = '';
  stats: {
    title: string;
    // amount: this.bamfiltercom.filterFromDate,
    amount: any; progress: { value: number; }; color: string;
  }[];
  
  lblFromDateValue: string;
  lblToDateValue: string;
  userkey1: string;
  userkey2: string;

  categorypriority: any;
  category: any[]=[];
  priority: any[]=[];
  format: any;
  msgid: any;
  data: any;
  ext: any;
  var_cell: string;
  FSID: any;
  rootFsid: any;
  flowRequestId: any;
  message: any;

  bamDetails : bam[];


  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection, private settings: SettingsService,
              public headerSrv: HeaderComponent,
              public dialog: MatDialog,
              private exportAsService: ExportAsService) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnInit() {
    
    this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey);
    this.interval = setInterval(() => {
      this.getFlowDataByProjectKey(this.http,this.projectSelection.projectKey);
    }, SharedModule.global_interval);

        this.cols = [
        { field: 'displayCreatedTime', header: 'Date & Time',width: '20%' },
        { field: 'category', header: 'Category',width: '8%' },
        { field: 'severity', header: 'Priority',width: '8%' },
        { field: 'statuscode', header: 'Status',width: '8%' },
        { field: 'userkey1', header: 'UserKey 1',width: '8%' },
        { field: 'userkey2', header: 'UserKey 2',width: '8%' },
		    { field: 'messagestring', header: 'Message',width: '30%' },
        { field: 'userblob', header: 'Blob',width: '10%' },
    ];

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getFlowDataByProjectKey(http: any, inputProjectKey: any) {

    this.stats = [
      {
      title: 'Log From',
      amount: 'All',        
        progress: {
          value: 100,
        },
        color: 'bg-indigo-500',
      },
      {
      title: 'Log To',
       amount: 'All',
        progress: {
          value: 100,
        },
        color: 'bg-blue-500',
      },
      {
        title: 'User Key 1',
        amount: 'All',
        progress: {
          value: 100,
        },
        color: 'bg-green-500',
      },
      {
      title: 'User Key 2',
      amount: 'All',
        progress: {
          value: 100,
        },
        color: 'bg-teal-500',
      },
    ];


    console.log('Called Every 5 Second');

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.ActivityLog +'/'+ inputProjectKey, { headers: tokenHeaders })
            .subscribe(
              (tokenResponse: any) => {
                this.bam = tokenResponse.bamData;
                console.log(this.bam);
                for (const cat of tokenResponse.category) {
                  if (cat === 'All') {
                    this.category.push({label: cat, value: null});
                  } 
                  else {
                    this.category.push({label: cat, value: cat});
                  }
                }

                for (const pri of tokenResponse.priority) {
                  if (pri === 'All') {
                    this.priority.push({label: pri, value: null});
                  } 
                  else {
                    this.priority.push({label: pri, value: pri});
                  }
                }

                    console.log(this.bam);
              },         
          
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
    }

      getFilterBamDataByProjectKey(inputProjectKey: any) {

        console.log('inside bam..');
        this.stats = [
          {
          title: 'Log From',
          amount: this.lblFromDateValue,        
            progress: {
              value: 100,
            },
            color: 'bg-indigo-500',
          },
          {
          title: 'Log To',
           amount: this.lblToDateValue,
            progress: {
              value: 100,
            },
            color: 'bg-blue-500',
          },
          {
            title: 'User Key 1',
            amount: this.userkey1,
            progress: {
              value: 100,
            },
            color: 'bg-green-500',
          },
          {
          title: 'User Key 2',
          amount: this.userkey2,
            progress: {
              value: 100,
            },
            color: 'bg-teal-500',
          },
        ];
  
      const tokenHeaders = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin'),
          Accept: 'application/json'
        }
      );
  
      console.log("Body data");
      const body = {
        projKey: inputProjectKey,
        projLocation: this.projectSelection.projectLocation,
         lblFromDateValue: this.lblFromDateValue,
         lblToDateValue: this.lblToDateValue,
         userkey1: this.userkey1,
         userkey2: this.userkey2 };

         if(this.lblFromDateValue == "")
         { this.lblFromDateValue= "ALL"; }

         if(this.lblToDateValue== "")
         { this.lblToDateValue= "ALL"; }
       
         if(this.userkey1 == "")
         { this.userkey1 = "ALL"; }
        
         if(this.userkey2 == "")
         { this.userkey2 = "ALL"; }
        
         this.stats = [
          {
          title: 'Log From',
          amount: this.lblFromDateValue,        
            progress: {
              value: 100,
            },
            color: 'bg-indigo-500',
          },
          {
          title: 'Log To',
           amount: this.lblToDateValue,
            progress: {
              value: 100,
            },
            color: 'bg-blue-500',
          },
          {
            title: 'User Key 1',
            amount: this.userkey1,
            progress: {
              value: 100,
            },
            color: 'bg-green-500',
          },
          {
          title: 'User Key 2',
          amount: this.userkey2,
            progress: {
              value: 100,
            },
            color: 'bg-teal-500',
          },
        ];


         console.log(inputProjectKey);
         console.log(this.projectSelection.projectLocation);
         console.log(this.lblFromDateValue);
         console.log(this.lblToDateValue);
         console.log(this.userkey1);
         console.log(this.userkey2);
         console.log(this.userkey2);
        console.log('body data....'+body);
  
      this.http.post(urls.SERVER_URL + urls.BamFilter, body, { headers: tokenHeaders })
        .subscribe( (tokenResponse: any) => {
          this.bam = tokenResponse;
          console.log(tokenResponse);
      },
      (errorResponse: any) => {
        console.log(errorResponse);
      }
    );
   }

  onClickPanelResize() {
      document.getElementById('sideContentHideScroll').style.overflow = 'hidden';
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        this.timeout();
    }, 250);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {

    const dialogRef = this.dialog.open(MgxpiBAMFiltersComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.lblFromDateValue = result.fromdt;
      this.lblToDateValue = result.todt;
      this.userkey1 = result.uk1;
      this.userkey2 = result.uk2;

      if(this.lblFromDateValue == "clear"){
        this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey);        
      }
      else{
      this.getFilterBamDataByProjectKey(this.projectSelection.projectKey);
      }

      console.log("Filter values obtained are "+ this.lblFromDateValue +this.lblToDateValue +this.userkey1 + this.userkey2);
      });



    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.opened = true;
  }

  closePanel() {
    this.opened = false;
  }

  togglePanel() {
    this.opened = !this.opened;
  }

  sendOptions() {
    this.optionsEvent.emit(this.options);
  }


  refresh(){
    let dialogref = this.dialog.open(RefreshTableComponent,{
      data:{ refresh_interval:SharedModule.global_interval/1000}
    });

    dialogref.afterClosed().subscribe(result=>{

      console.log("activity compoenent received data "+result.data_interval);
      // console.log("activity compoenent received data "+typeof(result.data_interval)); 
      if(result.data_interval){
        SharedModule.global_interval = result.data_interval*1000
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey); 
        },SharedModule.global_interval );
        
      }
      
    })
  }


  //   showBlob(user) {
  //   const fileURL = URL.createObjectURL(new Blob([atob(user.userblob)], { type: 'application/text', }));
  //   window.open(fileURL);

  //   console.log(fileURL);
  // }

  // getBlob(inputProjectKey: any) {
  //   const tokenHeaders = new HttpHeaders(
  //     {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Basic ' + btoa('admin:admin'),
  //       Accept: 'application/json'
  //     }
  //   );

  //   let params = new HttpParams();
  //   params = params.append('projectKey', inputProjectKey);    
  //   params = params.append('msgid', this.msgid);
  //   //params = params.append('blobformat', this.format);

  //   console.log("call in getblob method");

  //   this.http.get<any>(urls.SERVER_URL + urls.blob, { headers: tokenHeaders, params })
  //   .subscribe( (tokenResponse: any) => {
      
  //     console.log(tokenResponse);
  //   });

  //   // window.open(this.data);

  // }

  // openBlob(msgid:any,blobFormat){

  //   this.msgid = msgid;
  //   this.format = blobFormat;
  // //  console.log("msg id is : ",this.msgid);
  //   console.log(this.msgid);
  //   //console.log("format for blob is : " , blobFormat);

  //   this.getBlob(this.projectSelection.projectKey);
  //  // window.open("http://localhost:8090/ViewPdfProject/viewPdf","_blank");

  // }

//     downloadFile(msgid:any) {

//     this.msgid = msgid;
//     const tokenHeaders = new HttpHeaders(
//       {
//         'Content-Type': 'application/json',
//         Authorization: 'Basic ' + btoa('admin:admin'),
//         Accept: 'application/json'
//       }
//     );

//     let params = new HttpParams();
//     params = params.append('projectKey', this.projectSelection.projectKey);    
//     params = params.append('msgid', this.msgid);
//     //params = params.append('blobformat', this.format);

//     console.log("call in getblob method");

//     this.http.get<any>(urls.SERVER_URL + urls.blob, { headers: tokenHeaders, params })
//     .subscribe( (tokenResponse: any) => {
//       console.log(tokenResponse.format);
//       this.ext = tokenResponse.format;
//     });

//   window.open("http://localhost:8083/xpi/"+this.msgid+"."+this.ext,"_blank",'height=300,width=640,top=150,left=180,scrollbars=yes,status=yes');   
  
// }


  exportexcel(): void
  {
    console.log("excel exportation");
    /* pass here the table id */
    let element = document.getElementById('dt');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.projectSelection.projectKey+'_bamData.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_bamData',  //project key is required to be passed
     // image : {type:'jpeg'},
      html2canvas:{}
      //jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_bamData").subscribe(() => {
      // save started
    });
    
  }

  onRightClick(var_cell:any){

    
    console.log(var_cell);
    this.var_cell = var_cell;
    window.addEventListener("contextmenu",function(event){
      event.preventDefault();
      let contextElement = document.getElementById("context-menu");
      contextElement.style.top = event.clientY + "px";
      contextElement.style.left = event.clientX + "px";
      contextElement.classList.add("active");
    });
    window.addEventListener("click",function(){
      document.getElementById("context-menu").classList.remove("active");
    });
    console.log("right click has been executed and returning false");

    
  }

  copy_cell_value(){

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.var_cell;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }

  // getToolTip(user){
  //   //console.log("Tooltip Working");
  // }

  details(user:any){
  
    let dialogref = this.dialog.open(MgxpiBamDetailsComponent,{
      data:{ bamDetails:user},
      height: '567px',
      width: '360px',
    });
  }

  // record_details(activity:any){
      
  //   let dialogref = this.activityLogRefresh.open(MgxpiBamDetailsComponent,{
  //     data:{ activitylog:activity},
  //     height: '567px',
  //     width: '360px',
  //   });  
  // }

}

@Component({
  selector: 'mgxpi-bam-details',
  templateUrl: 'mgxpi-bam-details.html',
  styleUrls: ['mgxpi-bam-details.scss'],
})

export class MgxpiBamDetailsComponent {
  msgid: any;
  ext: any;

  constructor(private http: HttpClient, private projectSelection: ProjectSelection, 
            public dialogRef:MatDialogRef<MgxpiBamDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any) {
                
               }

  ngOnInit() {
        console.log(this.data.bamDetails);
    }   
    
  user=this.data.bamDetails;

  downloadFile(msgid:any) {

    this.msgid = msgid;
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', this.projectSelection.projectKey);    
    params = params.append('msgid', this.msgid);
    //params = params.append('blobformat', this.format);

    console.log("call in getblob method");

    this.http.get<any>(urls.SERVER_URL + urls.blob, { headers: tokenHeaders, params })
    .subscribe( (tokenResponse: any) => {
      console.log(tokenResponse.format);
      
      this.ext = tokenResponse.format;
    });
    window.open("http://localhost:8083/xpi/"+this.msgid+"."+this.ext,"_blank",'height=300,width=640,top=150,left=180,scrollbars=yes,status=yes');   
  }
  
  exit(){
    this.dialogRef.close();
    
  }

}
