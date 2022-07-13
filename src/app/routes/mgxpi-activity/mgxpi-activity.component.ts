import { SidenavService } from 'app/services/sidenav.service';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ViewEncapsulation, EventEmitter, Output, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SettingsService } from './../../core/services/settings.service';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DATE_FORMATS,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivityService } from './mgxpi-activity-services';
import { ActivityFiltersService } from './activity-filters.service';
import { urls } from '@env/accessurls';
import {trigger, style, animate, transition} from '@angular/animations';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { HeaderComponent } from '../admin-layout/header/header.component';
//import { Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { time } from 'console';
import { SharedModule } from '@shared';
import { share } from 'rxjs/operators';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
import { MgxpiApexChartService } from '../chartbeans/mgxpi-apex-chart.service';


export interface activityLog {
  displayCreatedTime;
  messageType;
  messagestring;
  stepName;
  fsid;
  blobexists;
  msgid;
  flowrequestid;
  rootfsid;
  serverName;
  bpName;
  flowName;
}

export interface recordsPerPage {
  value: number;
  label: number;
}

export interface activityFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

export interface Color {
  colorName: string;
  colorCode: string;
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
  selector: 'app-mgxpi-activity',
  templateUrl: './mgxpi-activity.component.html',
  styleUrls: ['./mgxpi-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ActivityService,
    HeaderComponent,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(1000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class MgxpiActivityComponent implements OnInit, OnDestroy, AfterViewInit {

  activityFilters: activityFilters[];
  activityFiltersColumns: any[];
  automatic_refersh_interval:number=SharedModule.global_interval;
  component_logging:boolean = false;

  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'activityLogTable', 
  }

  recordsFilter = [
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 500, label: 500 },
  ];

  color2: any = {
    r: 100, g: 130, b: 150
  };

  

  // color: Color[];
  // colorVal: string;

  options = this.settings.getOptions();
  openedFilterDialog = false;
  openedActLogDeleteDialog = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  bpId:any;
  flowId:any;
  Name:any;
  serverId:any;
  messageType:any;
  rootFsid:any;
  flowRequestId:any;
  FSID:any;
  fsstep:any;
  message:any;




  activityLog: activityLog[];
  displayedColumns: any[];
  cols: any[];
  cols2:any[];
  interval: any;

  selectedRowData: any[];

  showFiller = false;
  isChecked = true;

  testValue = '';

  showFilters = true;
  activityLogMsgFilter: activityFilters[];
  isActivityLogMsgFilterWritten: any;

  stats: any[];
  FlowRequestId: any;
  fsid: any;
  RootFsid: any;
  FromDate: any;
  ToDate: any;
  displayCreatedTime: any;
  var_cell: any;
  refresh_interval=5000;
  messageTypeList:any[];
  blobUrl: string;
  //msgid: string;
  //ext: string;
  result: any;
  refresh_status: boolean;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              public projectSelection: ProjectSelection, private settings: SettingsService,
              public activityLogDelete: MatDialog,
              public activityService: ActivityService,
              public activityFilterMsgSrv: ActivityFiltersService,
              public headerSrv: HeaderComponent,
              private exportAsService: ExportAsService,
              public activityLogRefresh: MatDialog,
              ) {

    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();

  //   this.color = [
  //     {colorName:'Select City', colorCode:null},
  //     {colorName:'Red', colorCode:"#CC0000"},
  //     {colorName:'Green', colorCode:"#00C851"},
  //     {colorName:'Blue', colorCode:"#0d47a1"},
  //     {colorName:'Purple', colorCode:"#9933CC"},
  //     {colorName:'Orange', colorCode:"#ff6d00"},
  // ];

  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
 
  }

  
  ngOnInit() {

  this.activityFiltersColumns = [
      { field: 'display', header: 'Display',
      width: '10%' },
      { field: 'write', header: 'Write',
      width: '10%' },
      { field: 'color', header: 'Color',
      width: '10%' },
      { field: 'messageName', header: 'Message Name',
      width: '70%' },
  ];

  this.messageTypeList = [
    {label: "ALL", value: null},
    {label: "Component", value: ['User-defined message']},
    {label: "Error", value: 'Error'}
    
  ],
  
  
    this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
    //this.activityService.getInitialActLogRecordsCountProjectKey(this.projectSelection.projectKey);

    this.interval = setInterval(() => {
      this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
    }, this.automatic_refersh_interval);

    

  this.cols = [
        {
          field: 'displayCreatedTime',
          header: 'Date & Time',
          checked: true,
          // width: '17%'
        },
        {
          field: 'messageType',
          header: 'Message Type',
          checked: true,
          // width: '20%'
        },
        {
          field: 'messagestring',
          header: 'Message String',
          checked: true,
          // width: '20%'
        },
        {
          field: 'stepName',
          header: 'Step Name',
          checked: true,
         // width: '15%'
        },
        {
          field: 'fsid',
          header: 'FSID',
          checked: true,
          // width: '5%'
        },
        {
          field: 'blobexists',
          header: 'Blob',
          checked: true,
         // width: '5%'
        },
        {
          field: 'serverName',
          header: 'Server Name',
          checked: false,
          // width: '10%'
        },
        {
          field: 'bpName',
          header: 'Business Process',
          checked: false,
         // width: '15%'
        },
        {
          field: 'flowName',
          header: 'Flow Name',
          checked: false,
          //width: '12%'
        },
                {
          field: 'flowrequestid',
          header: 'Flow Request ID',
          checked: false,
          // width: '5%'
        },
        {
          field: 'rootfsid',
          header: 'Root FSID',
          checked: false,
         // width: '5%'
        }
        
    ];

    this.displayedColumns = this.cols.filter(item => item.checked);
    //this.displayedColumns = this.cols2.filter(item => item.checked);

    this.activityService.firstDisabled = true;
    this.activityService.previousDisabled = true;

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
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

  
  checkvalue(event: any){
    
    if(event=='A'){
      this.refresh_status = true;
      console.log("event automatic refresh is executing");
      clearInterval(this.interval);
      this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
      this.interval = setInterval(() => {
        this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
      }, this.automatic_refersh_interval);

    }
    else{
      this.refresh_status = false;
      console.log("event no refresh is executing");
      clearInterval(this.interval);
      //this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
    }
  }
  

 exportexcel(): void
 {
   console.log("excel exportation");
   /* pass here the table id */
   let element = document.getElementById('activityLogTable');
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */  
   XLSX.writeFile(wb, this.projectSelection.projectKey+'_activityLogData.xlsx');
   

 }

 exportPDF(){

   const options = {
     filename : this.projectSelection.projectKey+'_activityLogData',  //project key is required to be passed
    // image : {type:'jpeg'},
    html2canvas:{width: 1130,
      height: 800},
      jsPDF : {orientation: 'landscape'}
  

   };

   const content : Element = document.getElementById('activityLogTable');

   html2pdf().from(content).set(options).save();
 }

 exportPNG(){
   this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_activityLogData").subscribe(() => {
     // save started
   });
   
 }

 onRightClick(flowsdata:any,var_cell:any){

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

 onRightClick_outside(){
   console.log("outside right click");
   return false;
 }

 copy_cell_value(){

   const cellValue = document.createElement('textarea');
   cellValue.style.position = 'fixed';
   // cellValue.style.left = '0';
   // cellValue.style.top = '0';
   cellValue.style.opacity = '0';
   cellValue.value = this.var_cell;
   document.body.appendChild(cellValue);
   cellValue.focus();
   cellValue.select();
   document.execCommand('copy');
   document.body.removeChild(cellValue);

 }


  // downloadFile(msgid:any) {

  //   this.msgid = msgid;

  //   const tokenHeaders = new HttpHeaders(
  //     {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Basic ' + btoa('admin:admin'),
  //       Accept: 'application/json'
  //     }
  //   );

  //   let params = new HttpParams();
  //   params = params.append('projectKey', this.projectSelection.projectKey);    
  //   params = params.append('msgid', this.msgid);
  //   //params = params.append('blobformat', this.format);

  //   console.log("call in getblob method");

  //   this.http.get<any>(urls.SERVER_URL + urls.blob, { headers: tokenHeaders, params })
  //   .subscribe( (tokenResponse: any) => {
  //     console.log("received data for blob "+tokenResponse);
  //     this.ext = tokenResponse.format;
  //   });

  //   this.run();

  //  // window.open("http://localhost:8083/xpi/"+this.msgid+"."+this.ext,"_blank","height=370,width=320,status=yes,scrollbars=yes,top=150,left=180");   
  

  // }

  // run(){
      
  //   window.open("http://localhost:8083/xpi/"+this.msgid+"."+this.ext,"_blank","height=370,width=320,status=yes,scrollbars=yes,top=150,left=180");   
  
  // }

  openPanel(event: MouseEvent) {

    // const dialogRef = this.activityFiltersdialog.open(MgxpiActivityFiltersComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   this.testValue = result;
    // });

    this.getActLogFilterSettingsByProjKey();

    // if (this.dragging) {
    //   this.dragging = false;
    //   return;
    // }
    // this.opened = true;
  }

  openActLogDeletePanel(event: MouseEvent) {

    const dialogRef = this.activityLogDelete.open(MgxpiActivityLogDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.testValue = result;
    });

    this.openedActLogDeleteDialog = true;
  }

  RefreshInterval()
  {
    let dialogref = this.activityLogRefresh.open(RefreshTableComponent,{
      data:{ refresh_interval:this.automatic_refersh_interval/1000}
    });

    dialogref.afterClosed().subscribe(result=>{

      console.log("activity compoenent received data "+result.data_interval);
      // console.log("activity compoenent received data "+typeof(result.data_interval)); 
      if(result.data_interval){
        SharedModule.global_interval = result.data_interval*1000
     
        this.automatic_refersh_interval = SharedModule.global_interval;
        if(this.refresh_status==true){
          clearInterval(this.interval);
          this.checkvalue('A');
        }
        else{
          this.checkvalue('B');
        }
        
      }
      
      
    })
  }

  record_details(activity:any){
      
    let dialogref = this.activityLogRefresh.open(MgxpiActivityLogDetailsComponent,{
      data:{ activitylog:activity},
      height: '505px',
      width: '345px',
    });

  
  }

  dateTimeFilter() {

    let dialogref = this.activityLogRefresh.open(MgxpiDateTimeFilterComponent,{
      data:{ stats:this.activityService.stats},
      height: '55%',
      width: '17%',
      
    });

    dialogref.afterClosed().subscribe(result=>{

       console.log("activity compoenent received data "+result.fsid);
       console.log("activity compoenent received data "+(result.rootfsid)); 
       //this.result = result;
       if(result.data){
         this.activityService.clearFilters();
       }
       else{
          this.activityService.applyFilters(result.fromDate,result.toDate,result.rootfsid,result.flowrequest,result.fsid);
          if(this.refresh_status==true){
            clearInterval(this.interval);
            this.checkvalue('A');
          }
          else{
            this.Refresh();
          }
        }
      });
            
  
    

   // this.openedActLogDeleteDialog = true;
  }



  closePanel() {
    this.openedFilterDialog = false;
  }

  togglePanel() {
    this.openedFilterDialog = !this.openedFilterDialog;
  }

  sendOptions() {
    this.optionsEvent.emit(this.options);
  }

  toggleColumns() {
    this.displayedColumns = this.cols.filter(item => item.checked);
  }
  

  showFilter(){
    this.showFilters = !this.showFilters;
  }

  getActLogFilterSettingsByProjKey() {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    const body = {
      ProjKey: this.projectSelection.projectKey,
      ProjLocation: this.projectSelection.projectLocation,
    };

    this.http.post(urls.SERVER_URL + urls.ActivityLogMsgFilters, body, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.activityLogMsgFilter = tokenResponse;
            if (this.dragging) {
              this.dragging = false;
              return;
            }
            this.openedFilterDialog = true;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );

}

writeActivityLogMsgFilters() {

  const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  const body = {
    ProjKey: this.projectSelection.projectKey,
    ProjLocation: this.projectSelection.projectLocation,
    actMsgFiltersMetadata: this.activityLogMsgFilter,
  };

  this.http.post(urls.SERVER_URL + urls.ActivityLogWriteMsgFilters, body, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          this.isActivityLogMsgFilterWritten = tokenResponse;
          this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
          this.closePanel();
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );

}

  Refresh(){
    this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }


}

// Dialog
@Component({
  selector: 'mgxpi-activity-filters',
  templateUrl: 'mgxpi-activity-filters.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiActivityFiltersComponent {

  activityFilters: activityFilters[];
  cols: any[];

  constructor() {  }

  ngOnInit() {

    this.cols = [
        { field: 'display', header: 'Display' },
        { field: 'write', header: 'Write' },
        { field: 'messageName', header: 'Name' },
    ];

    this.activityFilters = [

      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},

    ];

  }

}

// Dialog
@Component({
  selector: 'mgxpi-activitylog-delete',
  templateUrl: 'mgxpi-activitylog-delete.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
  providers: [
    ActivityService,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class MgxpiActivityLogDeleteComponent {

  constructor(public activityServices: ActivityService, public projectSelection: ProjectSelection) {  }

  ngOnInit() {



  }

}

@Component({
  selector: 'mgxpi-activitylog-refresh',
  templateUrl: 'mgxpi-activitylog-refresh.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
  providers: [
    ActivityService,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})


export class MgxpiActivityLogRefreshComponent {

  interval: number;
  time:number;  

  constructor(public dialogRef:MatDialogRef<MgxpiActivityLogRefreshComponent>,
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


@Component({
  selector: 'mgxpi-activitylog-details',
  templateUrl: 'mgxpi-activitylog-details.html',
  styleUrls: ['mgxpi-activitylog-details.scss'],
  // styles: [
  //   `
  //     .demo-full-width {
  //       width: 100%;
  //     }
  //   `,
  // ],
  // providers: [
  //   ActivityService,
  //   {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  // ]
})

export class MgxpiActivityLogDetailsComponent {
  msgid: any;
  //ext: any;

  // interval: number;
  // time:number;
    

  constructor(public dialogRef:MatDialogRef<MgxpiActivityLogDetailsComponent>,
    public projectSelection: ProjectSelection,private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data:any) {
                
               }

  ngOnInit() {
        console.log(this.data.activitylog);
    }
    
  activity=this.data.activitylog;

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
    
    this.http.get<any>(urls.SERVER_URL + urls.blob, { headers: tokenHeaders, params })
    .subscribe( (tokenResponse: any) => {
      console.log("received data for blob "+tokenResponse);
      //console.log(this.ext);
     // this.ext = tokenResponse.format;
      window.open("http://localhost:8083/xpi/"+this.msgid+"."+tokenResponse.format,"_blank",'height=300,width=640,top=150,left=180,scrollbars=yes,status=yes');   
  
    }); 

  }
  
  exit(){
    // console.log("recieved dig data: "+this.data.refresh_interval);
    // this.interval = +intervalTime;
    this.dialogRef.close();
    
  }

}

@Component({
  selector: 'mgxpi-dateTime-filter',
  templateUrl: 'mgxpi-dateTime-filter.html',
  // styleUrls: ['./mgxpi-dateTime-filter.scss'],
//   styles: [
//     ::-webkit-scrollbar{
//   display: none;
// }
//     // `
//     //   .demo-full-width {
//     //     width: 100%;
//     //   }
//     // `,
//   ],
  providers: [
    ActivityService,
  ]
})
export class MgxpiDateTimeFilterComponent {

  constructor(public projectSelection: ProjectSelection,
    public dialogRef:MatDialogRef<MgxpiDateTimeFilterComponent>,
    public activityService: ActivityService,
    @Inject(MAT_DIALOG_DATA) public data:any
   // public activity:MgxpiActivityComponent
    ) {  }

  ngOnInit() {

    console.log(this.data.stats[0].amount);

  }

  data1 = this.data;
  clearFilters(){
    //let btnClear = document.querySelector('button');
    let inputs = document.querySelectorAll('input');

    inputs.forEach(input =>  input.value = '');

    this.dialogRef.close({data:'clear'});
    
   
  }

  apply(fromDate:any,toDate:any,rootfsid:any,flowrequest:any,fsid:any){
    
    this.dialogRef.close({ fromDate: fromDate,toDate:toDate,rootfsid:rootfsid,flowrequest:flowrequest,fsid:fsid});
    
  }
  

}

