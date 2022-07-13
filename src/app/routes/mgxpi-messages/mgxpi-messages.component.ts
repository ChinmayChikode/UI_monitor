import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import {
  SidenavService
} from './../../services/sidenav.service';
import {
  MessagesService
} from './messages.service';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import {
  urls
} from './../../../environments/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import {
  SettingsService
} from '@core';
import {
  MatDialog,MatDialogConfig, MatDialogRef
} from '@angular/material';
import {
  CdkDragStart
} from '@angular/cdk/drag-drop';
import { HeaderComponent } from '../admin-layout/header/header.component';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table'
import { ContextMenuRow } from 'primeng/table';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';




@Component({
  selector: 'app-mgxpi-messages',
  templateUrl: './mgxpi-messages.component.html',
  styleUrls: ['./mgxpi-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [MessagesService,HeaderComponent]
})

export class MgxpiMessagesComponent implements OnInit, OnDestroy, AfterViewInit {
  var_cell: any;
  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'messagesTables', 
  }
  constructor(private sidenavSrv: SidenavService, public messagesSrv: MessagesService,
              private projectSelection: ProjectSelection,
              private settings: SettingsService,
              public dialog: MatDialog,private http: HttpClient,
              public headerSrv: HeaderComponent,public activityLogRefresh: MatDialog,
              private exportAsService: ExportAsService) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  options = this.settings.getOptions();
  opened = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  totalMessages: number;
  failledMessages: number;
  waitingMessages: number;
  inProcessMessages: number;

  projectName: string;

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  panelOpenState = false;
  testValue: any;

  cols: any[];
  messageStats: any[];
  interval: any;
  bpNames: any[];




  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnInit() {

    /*this.projectSelection.$projectSelection.subscribe((projectKey: any) => {
      this.projectName = projectKey;
    });*/

    this.messagesSrv.getMessageDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);
    this.interval = setInterval(() => {
      this.messagesSrv.getMessageDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);

      this.messageStats = [
        {
          title: 'Messages',
          amount: this.messagesSrv.totalMessages,
          progress: {
            value: 50,
          },
          color: 'bg-indigo-500',
        },
        {
          title: 'Processing Time',
          amount: 0,
          progress: {
            value: 70,
          },
          color: 'bg-blue-500',
        },
        {
          title: 'In Process',
          amount: this.messagesSrv.inProcessMessages,
          progress: {
            value: 80,
          },
          color: 'bg-green-500',
        },
        {
          title: 'Pending',
          amount: this.messagesSrv.waitingMessages,
          progress: {
            value: 40,
          },
          color: 'bg-teal-500',
        },
        {
          title: 'Failed',
          amount: this.messagesSrv.failledMessages,
          progress: {
            value: 40,
          },
          color: 'bg-red-500',
        },
      ];

    }, 5000);

    this.cols = [{
      field: 'displayFormattedDate',
      header: 'Created',
      width: '17%'
    },
    {
      field: 'messageId',
      header: 'ID',
      width: '8%'
    },
    {
      field: 'messageStatus',
      header: 'Status',
      width: '12%'
    },
    {
      field:'createdByServerId',
      header:'Server Id',
      width:'12%'
    },
    {
      field: 'invokeCompType',
      header: 'Invocation Type',
      width: '15%'
    },
    {
      field: 'bpName',
      header: 'BP',
      width: '15%'
    },
    {
      field: 'flowName',
      header: 'Flow',
      width: '10%'
    },
    {
      field: 'workerId',
      header: 'Worker ID',
      width: '8%'
    },
    {
      field: 'messageTimeout',
      header: 'Timeout',
      width: '8%'
    },
     
    ];

   

    this.messageStats = [
      {
        title: 'Messages',
        amount: this.messagesSrv.totalMessages,
        progress: {
          value: 50,
        },
        color: 'bg-indigo-500',
      },
      {
        title: 'Processing Time',
        amount: 0,
        progress: {
          value: 70,
        },
        color: 'bg-blue-500',
      },
      {
        title: 'In Process',
        amount: this.messagesSrv.inProcessMessages,
        progress: {
          value: 80,
        },
        color: 'bg-green-500',
      },
      {
        title: 'Pending',
        amount: this.messagesSrv.waitingMessages,
        progress: {
          value: 40,
        },
        color: 'bg-teal-500',
      },
      {
        title: 'Failed',
        amount: this.messagesSrv.failledMessages,
        progress: {
          value: 40,
        },
        color: 'bg-red-500',
      },
    ];  

  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }


  ViewActivityLog()
  {        
       console.log("Inside ViewActivity");
        const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.width = "50%";
       dialogConfig.height = "75%"
       this.dialog.open(MgxpiMessageActivityDetailsComponent,dialogConfig);
  
  }
  






  exportexcel(): void
 {
   console.log("excel exportation");
   /* pass here the table id */
   let element = document.getElementById('messagesTables');
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */  
   XLSX.writeFile(wb, this.projectSelection.projectKey+'_MessagesData.xlsx');
   

 }

 exportPDF(){

   const options = {
     filename : this.projectSelection.projectKey+'_MessagesData',  //project key is required to be passed
    // image : {type:'jpeg'},
     html2canvas:{}
     //jsPDF : {orientation: 'landscape'}

   };

   const content : Element = document.getElementById('messagesTables');

   html2pdf().from(content).set(options).save();
 }

 exportPNG(){
   this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_MessagesData").subscribe(() => {
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
        this.messagesSrv.getMessageDataByProjectKey(this.projectSelection.projectKey,this.projectSelection.projectLocation);
      },SharedModule.global_interval );
      
    }
    
  })
}

  openPanel(event: MouseEvent) {

    /*const dialogRef = this.dialog.open(MgxpiMessageDetailsComponent);
    dialogRef.componentInstance.totalMessages = this.messagesSrv.totalMessages;
    dialogRef.componentInstance.failledMessages = this.messagesSrv.failledMessages;
    dialogRef.componentInstance.waitingMessages = this.messagesSrv.waitingMessages;
    dialogRef.componentInstance.inProcessMessages = this.messagesSrv.inProcessMessages;
    dialogRef.afterClosed().subscribe(result => {
      this.testValue = result;
    }); */

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

}

declare var Chart: any;

// Dialog
/*@Component({
  selector: 'mgxpi-message-details',
  templateUrl: 'mgxpi-message-details.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiMessageDetailsComponent implements OnInit {

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
    this.pieChartLabels = ['Total', 'Average Message Processing Time', 'In Process', 'Pending', 'Failed'];
    this.pieChartData = [this.totalMessages, 0, this.inProcessMessages, this.waitingMessages, this.failledMessages];
    this.pieChartType = 'pie';

    Chart.pluginService.register({
      beforeDraw: (chart) => {
      if (chart.config.options.showAllTooltips) {
        chart.pluginTooltips = [];
        chart.config.data.datasets.forEach(function(dataset, i) {
          let counter = 0;
          console.log('Hi->' + chart.config.data.datasets[0].data[counter]);
          chart.getDatasetMeta(i).data.forEach(function(sector, j) {
            if(chart.config.data.datasets[0].data[counter] !== 0) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart));
          }
            counter++;
          });
        });
        chart.options.tooltips.enabled = false;
      }
    },
    afterDraw: (chart, easing) => {
      if (chart.config.options.showAllTooltips) {
        if (!chart.allTooltipsOnce) {
          if (easing !== 1) {
            return;
          }
          chart.allTooltipsOnce = true;
        }
        chart.options.tooltips.enabled = true;
        Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
          tooltip.initialize();
          tooltip.update();
          tooltip.pivot();
          tooltip.transition(easing).draw();
        });
        chart.options.tooltips.enabled = false;
      }
    }
  });

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

} */





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
  userblob;
}

@Component({
  selector: 'mgxpi-Activitymessage-details',
  templateUrl: 'mgxpi-Activity-message-details.html',
  styles: [
            `
            .demo-full-width {
              width: 100%;
            }

            table {
              width: 100%;
            }
          
            body .ui-table .ui-table-caption {
              color:#0083B0 !important;
            }
            .ui-table {
                height: 100%;
                display: flex;
                flex-direction: column;
                border: 1px solid #c8c8c8;
                > * {
                  flex: 0 0 auto;
                }
            
                > .ui-table-scrollable-wrapper {
                  flex: 1 1 auto;
                  overflow: hidden;
            
                  > .ui-table-scrollable-view {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
            
                    > .ui-table-scrollable-header {
                      flex: 0 0 auto;
                    }
            
                    > .ui-table-scrollable-body {
                      flex: 1 1 auto;
                    }
                  }
                }
              }            

              .fill-remaining-space{
                flex: 1 1 auto;
              }

              ::-webkit-scrollbar{

                display: none;
             }

              .btn-dialog-close{
                width: 30px;
                min-width: 0px !important;
                height: 32px;
                padding: 0px !important;
              }

              body {
                margin:0px;
                font-family:"Open Sans",sans-serif;
              }
              #context-menu {
                position:fixed;
                z-index:10000;
                width:135px;
                background:rgb(238, 229, 229);
                border-radius:5px;
                transform:scale(0);
                transform-origin:top left; 
              }
              #context-menu.active {
                transform:scale(1);
                transition:transform 300ms ease-in-out;
              }
              #context-menu .item {
                padding:8px 10px;
                font-size:12.5px;
                color:black;
              }
              #context-menu .item:hover {
                background:#555;
                color:whitesmoke;
              }
              #context-menu .item i {
                display:inline-block;
                margin-right:5px;
              }
              #context-menu hr {
                margin:2px 0px;
                border-color:#555;
              }
            `
  ],
  providers: [HeaderComponent,MessagesService]
})
export class MgxpiMessageActivityDetailsComponent implements OnInit,AfterViewInit {

  var_cell: any;
  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'dt', 
  }

  //displayedColumns: string[] = ['Date & Time', 'MESSAGETYPE', 'Message', 'FSID', 'Blob'];
  ActivityDetials :any;
  interval: any;
  activity:any[];

  recordsFilter = [
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 500, label: 500 },
  ];

  
  constructor(private projectSelection: ProjectSelection,private http: HttpClient,
    public dialogRef: MatDialogRef<MgxpiMessageActivityDetailsComponent>,public messagesSrvpopup: MessagesService,
    public headerSrv: HeaderComponent,private exportAsService: ExportAsService) { }


  //@ViewChild(MatSort) sort: MatSort;


  ngOnInit() {


    this.activity = [
      { field: 'displayCreatedTime', header: 'Date & Time' },
      { field: 'messageType', header: 'MESSAGETYPE' },
      { field: 'messagestring', header: 'Message' },
      { field: 'rootfsid', header: 'FSID' },
      { field: 'blobexists', header: 'Blob' }
  ];

  this.messagesSrvpopup.ViewActivityLogDetails();

  this.messagesSrvpopup.firstDisabled = true;
  this.messagesSrvpopup.previousDisabled = true;

  // this.interval = setInterval(() => {
  //   this.ViewActivityLogDetails();
  // },5000)

  // this.ActivityDetials.sort = this.sort;

  // this.ActivityDetials = new MatTableDataSource(this.ActivityDetials);



  }


  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined){
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }


  onClose():void {
  
    this.dialogRef.close();
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
   XLSX.writeFile(wb, this.projectSelection.projectKey+'_Messages-ActivityData.xlsx');
   

 }

 exportPDF(){

   const options = {
     filename : this.projectSelection.projectKey+'_Messages-ActivityData',  //project key is required to be passed
    // image : {type:'jpeg'},
     html2canvas:{}
     //jsPDF : {orientation: 'landscape'}

   };

   const content : Element = document.getElementById('dt');

   html2pdf().from(content).set(options).save();
 }

 exportPNG(){
   this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_Messages-ActivityData").subscribe(() => {
     // save started
   });
   
 }

 onRightClick(var_cell:any){

  console.log(var_cell);
  this.var_cell = var_cell;
  let box =document.getElementById('box');
  box.addEventListener('contextMenu',this.showmenu);
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

 showmenu(ev){
  ev.preventDefault();

 }

}