import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SidenavService } from './../../services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from './../admin-layout/header/header.component';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
import { MatDialog } from '@angular/material';

export interface flows {
  bpId;
  businessProcess;
  flowId;
  flowName;
  maxInstance;
  instanceCounter;
  isEnable;
  recoveryPolicy;
  timeoutPolicy;
  timeout;
}

export interface triggers {
  triggerType;
  triggerId;
  serverId;
  bpName;
  flowId;
  flowName;
  lastMessagedAtDate;
  bufferSize;
  triggerState;
  startedAtDate;
}

@Component({
  selector: 'app-mgxpi-flows',
  templateUrl: './mgxpi-flows.component.html',
  styleUrls: ['./mgxpi-flows.component.scss'],
  providers: [HeaderComponent]
})
export class MgxpiFlowsComponent implements OnInit, AfterViewInit, OnDestroy {

  //fileName= 'ExcelSheet.xlsx';
  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'dt', 
  }

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;
  flag:boolean;

  flows: flows[];
  triggers: triggers[];
  flowColumns: any[];
  interval: any;
  triggerColumns: any[];
  count: number;
  isDisable: number;

  bpList: any[];
  flowList: any[];
  tiggerTypeList: any[] = [];
  tiggerStates: any[] = [];
  serversList: any[] = [];
  flowStats: any[];
  isEnable: number;
  isenable:any;
  bpid:any;
  flowid:any;
  invocation: number;
  interval_trigger: any;
  showFilters = true;
  flow_data_for_contextmenu: flows;
  enable_var: any;
  enable_list: any;
  var_cell: any;
  project_key: any;
  automatic_refersh_interval: number = SharedModule.global_interval;
  //flow_data_for_contextmenu: any;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection,
              public headerSrv: HeaderComponent,
              private exportAsService: ExportAsService,
              public activityLogRefresh: MatDialog,) {

    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();

  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
      clearInterval(this.interval_trigger);
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

    this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);
      this.interval = setInterval(() => {
        this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
          this.projectSelection.projectLocation);
      },SharedModule.global_interval );


    
    this.flowStats = [
      {
        title: 'Total Flows',
        amount:0,
        progress: {
          value: 70,
        },
        color: 'bg-indigo-500',
      },
      {
        title: 'Enabled',
        amount: 0, // need to be changed
        progress: {
          value: 70,
        },
        color: 'bg-green-500',
      },
      {
        title: 'Disabled',
        amount: 0, // need to be changed
        progress: {
          value: 70,
        },
        color: 'bg-red-500',
      },
      {
        title: 'Total Requests Invoked',
        amount: 0,
        progress: {
          value:70,
        },
        color: 'bg-teal-500',
      },
    ];
    
    this.flowColumns = [
        { field: 'bpId', header: 'BP ID',width:'7%' },
        { field: 'bpName', header: 'BP Name',width:'15%'  },
        { field: 'flowId', header: 'Flow ID', width:'7%' },
        { field: 'flowName', header: 'Flow Name', width:'15%' },
		    { field: 'maxInstance', header: 'Running Instances',width:'8%'},
        { field: 'instanceCounter', header: 'Total Invocations'},
        { field: 'isEnable', header: 'Enabled'  },
		    { field: 'recoveryPolicy', header: 'Recovery Policy'  },
        { field: 'timeoutPolicy', header: 'Timeout Policy' },
        { field: 'timeout', header: 'Timeout'}
    ];

    this.triggerColumns = [
      { field: 'triggerName', header: 'Name', width: '12%'  },
      { field: 'triggerType', header: 'Type', width: '13%'  },
      { field: 'triggerId', header: 'Trigger ID', width: '5%'  },
      { field: 'serverId', header: 'Server ID', width: '5%'  },
      { field: 'bpName', header: 'BP Name', width: '14%'  },
      { field: 'flowId', header: 'Flow ID', width: '5%'  },
      { field: 'flowName', header: 'Flow Name', width: '8%'  },
      { field: 'lastMessagedAtDate', header: 'Last Message At', width: '16.5%'  },
      { field: 'instanceCounter', header: 'Total Messages', width: '5%'  },
      { field: 'triggerState', header: 'State', width: '8%'  },
      { field: 'startedAtDate', header: 'Started At', width: '16.5%'  },
    ];

    this.enable_list = [
      {label: "ALL", value: null},
      {label: "Yes", value: true},
      {label: "No", value: false},
      
    ]

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }
  

  getFlowDataByProjectKey(http: any, inputProjectKey: any, projectLocation: any) {

       if(this.project_key != inputProjectKey){
        this.project_key = inputProjectKey;
        this.bpList =[{label: 'ALL', value: null}];
        this.flowList =[{label: 'ALL', value: null}];
    }
    
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', inputProjectKey);
    params = params.append('projectLocation', projectLocation);

    http.get(urls.SERVER_URL + urls.Flows, { headers: tokenHeaders, params })
        .subscribe(
          (tokenResponse: any) => {
            console.log(tokenResponse);
            this.flows = tokenResponse.flowData;
            // console.log(tokenResponse.bpList);
            console.log(this.flows);
            this.count = tokenResponse.flowData.length;
            for (const bp of tokenResponse.bpList) {
              
              if(!this.exists(this.bpList,bp.bpName)) {
                this.bpList.push({label: bp.bpName, value: bp.bpName});
              }
            }

            for (const flow of tokenResponse.flowList) {
              
              if(!this.exists(this.flowList,flow.flowName)) {
                this.flowList.push({label: flow.flowName, value: flow.flowName});
              }
            }
            
            this.isEnable=0;
            this.isDisable = 0;  //it can be removed 
            this.invocation=0;
            for(let index=0;index<tokenResponse.flowData.length;index++){
                if(tokenResponse.flowData[index].isEnable==true){
                  this.isEnable = this.isEnable+1;
                }
                else{
                  this.isDisable = this.isDisable+1;
                }
            }

            for(let index=0;index<tokenResponse.flowData.length;index++){
              
              this.invocation = this.invocation + tokenResponse.flowData[index].instanceCounter;
            }

            this.flowStats = [
              {
                title: 'Total Flows',
                amount:this.count,
                progress: {
                  value: 50,
                },
                color: 'bg-indigo-500',
              },
              {
                title: 'Enabled',
                amount: this.isEnable, 
                progress: {
                  value: 70,
                },
                color: 'bg-green-500',
              },
              {
                title: 'Disabled',
                amount: this.isDisable,
                progress: {
                  value: 70,
                },
                color: 'bg-red-500',
              },
              {
                title: 'Total Requests Invoked',
                amount: this.invocation, 
                progress: {
                  value: 70,
                },
                color: 'bg-teal-500',
              },
            ];
          },

          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }


  updateFlowEnableStatus(){
    
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/string'
      }
    );
    
    let toggle_enable = !(this.isenable);
    let var_enable = String(toggle_enable);

    let params = new HttpParams();
    
    params = params.append('projectKey', this.projectSelection.projectKey);
    params = params.append('bpId',this.bpid);
    params = params.append('flowId',this.flowid);
    params = params.append('isEnable',var_enable);
    console.log("executing enable flow");
    this.http.get(urls.SERVER_URL + urls.updateFlowStatus, { headers: tokenHeaders, params }).subscribe(
      (data:any)=>{
        console.log("executing updateflowstatus");
        console.log(data);
      },
      (errorResponse: any) => {
        console.log("errors in updateflowstatus");
        console.log(errorResponse);
      }

    );

  }

  

  canWorkEnable(bpid:any,flowid:any){
      
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', this.projectSelection.projectKey);
    params = params.append('bpId',bpid);
    params = params.append('flowId',flowid);
  //  params = params.append('isEnable',enable);
    console.log("executing canworkenable flow");
    this.http.get(urls.SERVER_URL + urls.canWorkEnable, { headers: tokenHeaders, params }).subscribe(
      (data:any) => {
        console.log("canworkenable executing");
        console.log(data)
      },
      (errorResponse: any) => {
        console.log("canworkenable executing showing errors");
        console.log(errorResponse);
      }
    );

  }

  getTriggersDataByFlows(flowsData: any) {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', this.projectSelection.projectKey);
    params = params.append('projectLocation', this.projectSelection.projectLocation);
    this.http.get(urls.SERVER_URL + urls.TriggersByProject, { headers: tokenHeaders, params })
        .subscribe(
          (tokenResponse: any) => {
            this.triggers = tokenResponse.triggerData;
            
            for (const triggerState of tokenResponse.triggerStates) {
              
              if (triggerState === 'ALL') {
                this.tiggerStates.push({label: triggerState, value: null});
              } else {
                this.tiggerStates.push({label: triggerState, value: triggerState});
              }
            }

            for (const bp of tokenResponse.bpList) {
              
              if(!this.exists(this.bpList,bp.bpName)) {
                this.bpList.push({label: bp.bpName, value: bp.bpName});
              }
            }

            for (const flow of tokenResponse.flowList) {
              
              if(!this.exists(this.flowList,flow.flowName)) {
                this.flowList.push({label: flow.flowName, value: flow.flowName});
              }
            }


            for (const triggerType of tokenResponse.triggerTypes) {
              if (triggerType === 'ALL') {
                this.tiggerTypeList.push({label: triggerType, value: null});
              } else {
                this.tiggerTypeList.push({label: triggerType, value: triggerType});
              }
            }
            for (const trigger of tokenResponse.triggerData) {
              if (this.serversList.length === 0) {
                this.serversList.push({label: 'ALL', value: null});
              }
              if (!this.exists(this.serversList, 'Server_' + trigger.serverId)) {
                this.serversList.push({label: 'Server_' + trigger.serverId, value: trigger.serverId});
              }
            }
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  load(flowsData: any){
    console.log(flowsData);
    this.getTriggersDataByFlows(flowsData);
    this.interval_trigger = setInterval(() => {
     // this.clearFilters(document.getElementById('dt'));
      this.getTriggersDataByFlows(flowsData);
    },SharedModule.global_interval);
    
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
    XLSX.writeFile(wb, this.projectSelection.projectKey+'.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_flowdata',  //project key is required to be passed
     // image : {type:'jpeg'},
     html2canvas:{width: 1130,
      height: 800},
      jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey).subscribe(() => {
      // save started
    });
    
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
          this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
            this.projectSelection.projectLocation);
        },SharedModule.global_interval );
        
      }
      
    })
  }


  onRightClick(bpid:any,flowid:any,isenable:any,var_cell:any){

    //console.log(flowsdata);
    console.log(var_cell);
    this.var_cell = var_cell;
    this.flag = isenable;
    //this.flow_data_for_contextmenu = flowsdata;
    this.bpid = bpid;
    this.flowid = flowid;
    this.isenable = isenable;
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

  

  onClickPanelResize() {
      document.getElementById('sideContentHideScroll').style.overflow = 'hidden';
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        this.timeout();
    }, 250);
  }

  exists(servers: any[], search: string) {
    
    for (const server of servers) {
      if (server.label === search) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  
  getFlowTriggersStep(workerDataRow: any, col: any): any {

    if (workerDataRow.flowRuntimeTree.length > 0 && workerDataRow.flowRuntimeTree[0].stepId != null && workerDataRow.flowRuntimeTree[0].stepName != null) {
      const nestedProperties: string[] = col.field.split('.');
      for (const property of nestedProperties) {
        workerDataRow = workerDataRow[property][0].stepName;
      }
      return workerDataRow;
    }
  }

}
