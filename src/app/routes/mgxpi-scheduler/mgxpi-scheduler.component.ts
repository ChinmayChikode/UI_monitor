import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { HeaderComponent } from './../admin-layout/header/header.component';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
// import { Pipe } from '@angular/core';
// import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
//import {ConfirmationService} from 'primeng/api';

export interface scheduler {
  execDateTimeOrg;
  bpId;
  bpName;
  flowId;
  flowName;
  schedulerName;
}

@Component({
  selector: 'app-mgxpi-scheduler',
  templateUrl: './mgxpi-scheduler.component.html',
  styleUrls: ['./mgxpi-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiSchedulerComponent implements OnInit, OnDestroy,AfterViewInit {

  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'dt', 
  }

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  scheduler: scheduler[];
  cols: any[];
  bpList:any[];
  flowList:any[];
  interval:any;
  var_cell: string;
  project_key: any;
  flowName:any;
  schedulerData:any;
  TriggerId:any;

  


  constructor(private sidenavSrv: SidenavService, private http: HttpClient, public headerSrv: HeaderComponent,
    private projectSelection: ProjectSelection,public dialog: MatDialog,
    private exportAsService: ExportAsService, public activityLogRefresh: MatDialog) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {
    
    // this.getSchedulerDataByProjectKey(this.http,'RtView_Scheduler_and_Lock');
    // this.interval = setInterval(() => { 
    //   this.getSchedulerDataByProjectKey(this.http,'RtView_Scheduler_and_Lock');
    this.getSchedulerDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);
    this.interval=setInterval(() => {
      this.getSchedulerDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);
    }, 5000);

  

    this.cols = [
        { field: 'execDateTimeOrg', header: 'Invocation Time' },
        { field: 'bpId', header: 'BP ID' },
        { field: 'bpName', header: 'BP Name' },
        { field: 'flowId', header: 'Flow ID' },
        { field: 'flowName', header: 'Flow Name' },
        { field: 'schedulerName', header: 'Name' },
        // { field: 'stepId', header: 'StepID' },
        // { field: 'type', header: 'InvokeType' }
   ];

   


}



  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined){
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

  clickOnToggle(){
    this.toggleButtonStatus = !this.toggleButtonStatus;   
    this.toggleIconChange = !this.toggleIconChange;    
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }


  getSchedulerDataByProjectKey(inputProjectKey: any,projectLocation:any) {
   
    var projectKey = inputProjectKey;

    let tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
         Authorization: 'Basic ' + btoa("admin:admin"),
         Accept: 'application/json'
      }
    );

    console.log('projectKey : ' + projectKey);
    console.log('projectLocation : ' + projectLocation);

    let params = new HttpParams();
    params = params.append('projectKey', projectKey);
    params = params.append('projectLocation', projectLocation);

    this.http.get(urls.SERVER_URL + urls.Scheduler , { headers: tokenHeaders,params})
        .subscribe(
          (tokenResponse: any) => {
             //this.scheduler = tokenResponse.schedulermain;
             this.scheduler = tokenResponse.scheduler;
             this.Schedulerproject(this.scheduler);
             
            
          console.log(tokenResponse);
           
        
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
   // }

  }




  Invoke(){
    
        let tokenHeaders = new HttpHeaders(
          {
            'Content-Type': 'application/json',
             Authorization: 'Basic ' + btoa("admin:admin"),
             Accept: 'application/json'
          }
        );
    
        this.TriggerId=0;
    
        let params = new HttpParams();
        params = params.append('projectKey', this.projectSelection.projectKey);
        console.log("bpId is:"+ this.projectSelection.projectKey);
        params = params.append('bpId', this.schedulerData.bpId);
        console.log("bpId is:"+ this.schedulerData.bpId);
        params = params.append('flowId', this.schedulerData.flowId);
        params = params.append('triggerId', this.TriggerId);
        params = params.append('schedulerId', this.schedulerData.schedulerId);

        this.http.get(urls.SERVER_URL + urls.InvokeScheduler , { headers: tokenHeaders,params})
            .subscribe(
              (tokenResponse: any) => {  

              console.log(tokenResponse);
            
              },
              (errorResponse: any) => {
                console.log(errorResponse);
              }
            );


        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "42%";
        dialogConfig.height = "25%"
        this.dialog.open(MgxpiInvokeSchedulerComponent,dialogConfig);

  }

  Schedulerproject(_scheduler: any[]) {
      for(const scheduler of _scheduler){
        if(scheduler.flowName===null){
            this.scheduler=null;
        }
      }
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
    XLSX.writeFile(wb, this.projectSelection.projectKey+'_schedulerData.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_schedulerData',  //project key is required to be passed
     // image : {type:'jpeg'},
      html2canvas:{}
      //jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_schedulerData").subscribe(() => {
      // save started
    });
    
  }

  onRightClick(scheduler:any,var_cell:any){

    
    console.log(var_cell);
    console.log(scheduler);
    this.var_cell = var_cell;

    this.schedulerData=scheduler;

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
          this.getSchedulerDataByProjectKey(this.projectSelection.projectKey,
            this.projectSelection.projectLocation);
        },SharedModule.global_interval );
        
      }
      
    })
  }



}


@Component({
  selector: 'app-mgxpi-invoke-scheduler',
  templateUrl: 'mgxpi-scheduler-Invoke.component.html',
  styles: [
            ` .fill-remaining-space{
              flex: 1 1 auto;
            }
            `
  ],
  //providers: [MgxpiSchedulerComponent,SidenavService,HeaderComponent]

})
export class MgxpiInvokeSchedulerComponent implements OnInit{


  constructor(){}


  ngOnInit() {

    //  this.InvokeScheduler();
  }

//  InvokeScheduler(){

//   let tokenHeaders = new HttpHeaders(
//     {
//       'Content-Type': 'application/json',
//        Authorization: 'Basic ' + btoa("admin:admin"),
//        Accept: 'application/json'
//     }
//   );


//   let params = new HttpParams();
//   params = params.append('bpId', this.schedulermain.schedulerData.bpId);
//   console.log("bpId is:"+ this.schedulermain.schedulerData.bpId);
//   params = params.append('flowId', this.schedulermain.schedulerData.flowId);
//   params = params.append('stepId', this.schedulermain.schedulerData.stepId);
//   params = params.append('type', this.schedulermain.schedulerData.type);

//   this.http.get(urls.SERVER_URL + urls.InvokeScheduler , { headers: tokenHeaders,params})
//       .subscribe(
//         (tokenResponse: any) => {  

//         console.log(tokenResponse);
      
//         },
//         (errorResponse: any) => {
//           console.log(errorResponse);
//         }
//       );

//  } 



}
