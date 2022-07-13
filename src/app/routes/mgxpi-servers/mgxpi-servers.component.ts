import { Component, OnInit, OnChanges, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { workers } from 'cluster';
import { SettingsService } from '@core';
import { MatDialog,MatDialogConfig } from '@angular/material';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { HeaderComponent } from './../admin-layout/header/header.component';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MgxpiServersInstancesComponent } from './mgxpi-servers-instances.component';
import { TimeoutComponent } from '../admin-layout/sidemenu/sidemenu.component';
import { ServersService } from './servers.service';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
import { SharedModule } from '@shared';
// import { Component, ViewChild, ElementRef } from '@angular/core';  
// import * as jsPDF from 'jspdf';  
 

export interface servers {
  serverId;
  primaryHost;
  processId;
  loadScheduler;
  loadTriggers;
  numberOfWorkers;
  startReqTime;
  lastUpdtReqTime;
  status;
  restartTimes;
  licenseFeature;
  licenseSN;
}

export interface workers {
  workerId;
  createdTimestamp;
  statusSTR;
  wrkrLastAliveTimestamp;
  flowRuntimeTree;
  currentMessageId;
  messagesDone;
  upTime;
  licenseStatus;
  licenseType;
}

@Component({
  selector: 'app-mgxpi-servers',
  templateUrl: './mgxpi-servers.component.html',
  styleUrls: ['./mgxpi-servers.component.scss'],
  providers: [HeaderComponent]
})
export class MgxpiServersComponent implements OnInit, OnDestroy,AfterViewInit {

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

  panelOpenState = false;
  testValue: any;
  totalmessagesprocessed:number;
  Servers_count:number;
  

  servers: servers[];
  workers: workers[];
  serverColumns: any[];
  workerColumns: any[];
  interval: any;
  hostList: any[] = [];
  statusList: any[] = [];
  licenseFeatureList: any[] = [];
  stats: any[];
  bpid: any;
  flowid: any;
  isenable: any;
  var_cell: any;
  flag: any;
  //service: any;
  myProp: string;
  serverId: any;
  serverData: any;

  // recordsFilter = [
  //   { value: 50, label: 50 },
  //   { value: 100, label: 100 },
  //   { value: 200, label: 200 },
  //   { value: 500, label: 500 },
  // ];



  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection,
              private exportAsService: ExportAsService,
              private settings: SettingsService,public dialog: MatDialog,
              public headerSrv: HeaderComponent,private service: ServersService,public activityLogRefresh: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
    console.log('Not Lazily Loaded : NotALazyModule');
    
  }

  ngOnInit() {

    this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey);
    this.interval=setInterval(()=>{
      this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey);
       
      this.stats=[
        { 
         title: 'Total',
         amount: this.Servers_count,
         progress: {
           value: 100
         },
         color: 'bg-indigo-500',
      },
      {
        title:'Total Messages Processed',
        amount:this.totalmessagesprocessed,
        progress:{
          value: 100
        },
        color: 'bg-blue-500',
      }
 
     ];
 

    },5000)
  


     
    this.serverColumns = [
        { field: 'serverId', header: 'ID', width: '5%'   },
        { field: 'primaryHost', header: 'Host', width: '10%'   },
        { field: 'processId', header: 'Process ID', width: '5%'    },
        { field: 'loadScheduler', header: 'Load Schedulers', width: '5%'    },
		    { field: 'loadTriggers', header: 'Load Triggers', width: '5%'    },
        { field: 'numberOfWorkers', header: 'Workers', width: '5%'    },
        { field: 'startReqTime', header: 'Started At', width: '15%'    },
		    { field: 'lastUpdtReqTime', header: 'Last Checked', width: '15%'    },
        { field: 'status', header: 'Status', width: '8%'    },
        { field: 'restartTimes', header: 'Restart(times)', width: '5%'    },
        { field: 'licenseFeature', header: 'License Feature', width: '8%'    },
        { field: 'licenseSN', header: 'License Serial Number', width: '8%'    },
    ];

    this.workerColumns = [
      { field: 'workerId', header: 'ID', width: '4%' },
      { field: 'wrkrCreatedTimestamp', header: 'Created', width: '13%' },
      { field: 'statusSTR', header: 'Status', width: '6%' },
      { field: 'wrkrLastAliveTimestamp', header: 'Last is Alive', width: '13%' },
      { field: 'currentMessageId', header: 'Flow Request ID', width: '5%' },
      { field: 'flowRuntimeTree', subfield: 'stepName', header: 'Current Step', width: '11%' },
      { field: 'messagesDone', header: 'Total Messages', width: '5%' },
      { field: 'displayWrkrUpTime', header: 'Up Time', width: '13%' },
      { field: 'licenseStatus', header: 'License Status', width: '8%' },
      { field: 'licenseType', header: 'License Type', width: '8%' },
    ];


    this.stats=[
      { 
       title: 'Total',
       amount:0,
       progress: {
         value: 100
       },
       color: 'bg-indigo-500',
    },
    {
      title:'Total Messages Processed',
      amount:0,
      progress:{
        value: 100
      },
      color: 'bg-blue-500',
    }

 ];

 //this.OnRefreshLicense();


}

onCreate() {
  console.log("Inside onCreate");
  this.service.initializeFormGroup();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "45%";
  this.dialog.open(MgxpiServersInstancesComponent,dialogConfig);
}

onShutdown()
{
  //console.log(serverId + "Shutdown");
  
  const dialogRef = this.dialog.open(TimeoutComponent);
  if (this.myProp) {
    dialogRef.componentInstance.input = this.myProp;
  }
  dialogRef.afterClosed().subscribe(timeout => {
    if (timeout !== '' && timeout !== null) {

      const tokenHeaders = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin'),
          Accept: 'application/json'
        }
      );

      this.http.get(urls.SERVER_URL + urls.StopServer + this.projectSelection.projectKey + '/' + this.serverData.serverId + '/' + timeout 
      , { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
           // console.log(tokenResponse);
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );

    } 
  });
 
}

Onstart()
{
  //console.log(ServerData.serverId);

  const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  this.http.get(urls.SERVER_URL + urls.StartServer + this.projectSelection.projectKey + '/' + this.serverData.serverId, { headers: tokenHeaders })
    .subscribe(
      (tokenResponse: any) => {
        console.log(tokenResponse);
      },
      (errorResponse: any) => {
        console.log(errorResponse);
      }
    );
  
}

onclearentry(){

  const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  this.http.get(urls.SERVER_URL + urls.ClearEntry+ this.projectSelection.projectKey+'/'+ this.serverData.serverId, { headers: tokenHeaders })
  .subscribe(
    (tokenResponse: any) => {
        console.log(tokenResponse);
    },
    (errorResponse: any) => {
      console.log(errorResponse);
    }
  );

}

OnRefreshLicense( )
{
  //console.log('Inside OnRefreshLicense' + projectKey );

  const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  this.http.get(urls.SERVER_URL + urls.Servers+ this.projectSelection.projectKey, { headers: tokenHeaders })
  .subscribe(
    (tokenResponse: any) => {
       this.servers = tokenResponse.serverData;
  
    },
    (errorResponse: any) => {
      console.log(errorResponse);
    }
  );
  
}



  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }


  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getServersDataByProjectKey(http: any, projectKey: any) {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    this.http.get(urls.SERVER_URL + urls.Servers + projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.servers = tokenResponse.serverData;
            this.totalmessagesprocessed=tokenResponse.totalmessagesprocessed;
            this.Servers_count=this.servers.length;

            console.log(tokenResponse);

            this.stats=[
              { 
               title: 'Total',
               amount: this.Servers_count,
               progress: {
                 value: 100
               },
               color: 'bg-indigo-500',
            },
            {
              title:'Total Messages Processed',
              amount:this.totalmessagesprocessed,
              progress:{
                value: 100
              },
              color: 'bg-blue-500',
            }
       
           ];
           
             

            this.empty();

            for (const host of tokenResponse.hostList) {
              if (host.hostName === 'ALL') {
                this.hostList.push({label: host.hostName, value: null});
              } else {
                this.hostList.push({label: host.hostName, value: host.hostName});
              }
            }

            for (const status of tokenResponse.statusList) {
              if (status.statusName === 'ALL') {
                this.statusList.push({label: status.statusName, value: null});
              } else {
                this.statusList.push({label: status.statusName, value: status.statusName});
              }
            }

            for (const license of tokenResponse.licenseFeatureList) {
              if (license.licenseType === 'ALL') {
                this.licenseFeatureList.push({label: license.licenseType, value: null});
              } else {
                this.licenseFeatureList.push({label: license.licenseType, value: license.licenseType});
              }
            }
                        

          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  getWorkerDataByProjectKey(server: any) {

   // console.log('Called Every 5 Second : ' + server.serverId);

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    this.http.get(urls.SERVER_URL + urls.ServerWorkersByProject + this.projectSelection.projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.workers = tokenResponse[0].workers;
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

  const dialogRef = this.dialog.open(MgxpiServerDetailsComponent);
  dialogRef.componentInstance.totalMessages = null; // this.messagesSrv.totalMessages;
  dialogRef.componentInstance.failledMessages = null; // this.messagesSrv.failledMessages;
  dialogRef.componentInstance.waitingMessages = null; // this.messagesSrv.waitingMessages;
  dialogRef.componentInstance.inProcessMessages = null; // this.messagesSrv.inProcessMessages;
  dialogRef.afterClosed().subscribe(result => {
    this.testValue = result;
  });

  if (this.dragging) {
    this.dragging = false;
    return;
  }
  this.opened = true;
}

closePanel() {
  this.opened =false;
}

togglePanel() {
  this.opened = !this.opened;
}

sendOptions() {
  this.optionsEvent.emit(this.options);
}

getFlowWorkerStep(workerDataRow: any, col: any): any {

  if (workerDataRow.flowRuntimeTree.length > 0 && workerDataRow.flowRuntimeTree[0].stepId != null && workerDataRow.flowRuntimeTree[0].stepName != null) {
    const nestedProperties: string[] = col.field.split('.');
    for (const property of nestedProperties) {
      workerDataRow = '[' + workerDataRow[property][0].bpID + '-' + workerDataRow[property][0].flowID + '-' + workerDataRow[property][0].stepId + '-' + workerDataRow[property][0].stepName + ']';
  }
    return workerDataRow;
 }
 }

  empty() {
    this.hostList.length = 0;
    this.statusList.length = 0;
    this.licenseFeatureList.length = 0;
  }

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
    XLSX.writeFile(wb, this.projectSelection.projectKey+'_ServerData.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_Serverdata',  //project key is required to be passed
     // image : {type:'jpeg'},
      html2canvas:{}
      //jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey).subscribe(() => {
      // save started
    });
    
  }


  onRightClick(serverData:any,var_cell:any){

    console.log("this data: "+serverData);
    this.serverData = serverData;

    if(serverData.status==='RUNNING')
    {
      this.flag=1;
    }
   else{
          this.flag=0;
       }

    console.log(var_cell);
    this.var_cell = var_cell;
    
    //this.flow_data_for_contextmenu = flowsdata;
    
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

  refresh(){
    let dialogref = this.activityLogRefresh.open(RefreshTableComponent,{
      data:{ refresh_interval:SharedModule.global_interval/1000}
    });

    dialogref.afterClosed().subscribe(result=>{

      console.log("activity compoenent received data "+result.data_interval);
      // console.log("activity compoenent received data "+typeof(result.data_interval)); 
      if(result.data_interval){
        SharedModule.global_interval = result.data_interval*1000
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.getServersDataByProjectKey(this.http,this.projectSelection.projectKey);
        },SharedModule.global_interval );
        
      }
      
    })
  }


}

// Dialog
@Component({
  selector: 'mgxpi-server-details',
  templateUrl: 'mgxpi-server-details.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiServerDetailsComponent implements OnInit {

  constructor() { }

  totalMessages: number;
  failledMessages: number;
  waitingMessages: number;
  inProcessMessages: number;

  public pieChartLabels: string[];
  public pieChartData: number[];
  public pieChartType: string;

  public barChartOptions = {
    responsive: true,
    showAllTooltips: true,
    borderColor: 'rgba(0,0,0,1)',
    borderWidth: 1,
    caretSize: 0,
    legend: {
      position: 'right'
    },
  };

  ngOnInit(): void {

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
