import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from '../admin-layout/header/header.component';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
import { MatDialog } from '@angular/material';

export interface triggers {
  triggerName;
  triggerType;
  triggerId;
  serverId;
  bpName;
  flowName;
  lastMessagedAtDate;
  bufferSize;
  triggerState;
  startedAtDate;
}

@Component({
  selector: 'app-mgxpi-triggers',
  templateUrl: './mgxpi-triggers.component.html',
  styleUrls: ['./mgxpi-triggers.component.scss'],
  providers: [HeaderComponent]
})
export class MgxpiTriggersComponent implements OnInit, AfterViewInit, OnDestroy {

  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'triggersTable', 
  }

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  triggers: triggers[];
 // flowList: flowList[];
  cols: any[];
  interval: any;
  count: any;
  total_messages :any;
  
  bpList: any[] = [{label: 'ALL', value: null}];
  flowList: any[] = [{label: 'ALL', value: null}];
  tiggerTypeList: any[] = [{label: 'ALL', value: null}];
  tiggerStates: any[] = [{label: 'ALL', value: null}];
  serversList: any[] = [{label: 'ALL', value: null}];
  messageStats: any[];
  triggerStats: { title: string; amount: any; progress: { value: number; }; color: string; }[];
  var_cell: any;
  running_count: number;
  stateless_count: number;
  //invocationList : any[] = [];

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection,
              public headerSrv: HeaderComponent,
              private exportAsService: ExportAsService,
              public activityLogRefresh: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnInit() {
    this.getTriggersDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);
    this.interval = setInterval(() =>{
      this.getTriggersDataByProjectKey(this.http, this.projectSelection.projectKey,
        this.projectSelection.projectLocation);
      }, SharedModule.global_interval);
    

    this.cols = [
        { field: 'triggerName', header: 'Name', width: '17%'  },
        { field: 'triggerType', header: 'Type', width: '15%'  },
        { field: 'triggerId', header: 'Trigger ID', width: '5%'  },
        { field: 'serverId', header: 'Server ID', width: '8%'  },
		    { field: 'bpName', header: 'BP Name', width: '15%'  },
        { field: 'flowName', header: 'Flow Name', width: '10%'  },
        { field: 'lastMessagedAtDate', header: 'Last Message At', width: '18%'  },
		    { field: 'instanceCounter', header: 'Total Messages', width: '5%'  },
        { field: 'triggerState', header: 'State', width: '8%'  },
        { field: 'startedAtDate', header: 'Started At', width: '18%'  },
        
    ];

    this.triggerStats = [
      {
        title: 'Total Triggers',
        amount: this.count,
        progress: {
          value: 50,
        },
        color: 'bg-indigo-500',
      },
      {
        title: 'Total Messages Generated',
        amount: this.total_messages,
        progress: {
          value: 70,
        },
        color: 'bg-teal-500',
      },
      {
        title: 'Running Triggers',
        amount: this.running_count,
        progress: {
          value: 50,
        },
        color: 'bg-green-500',
      },
      {
        title: 'Stateless Triggers',
        amount: this.stateless_count,
        progress: {
          value: 50,
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

  getTriggersDataByProjectKey(http: any, inputProjectKey: any, projectLocation: any) {

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

    http.get(urls.SERVER_URL + urls.TriggersByProject, { headers: tokenHeaders, params })
        .subscribe(
          (tokenResponse: any) => {
            this.triggers = tokenResponse.triggerData;
            console.log("first data recieved")
            console.log(this.triggers);
            this.count = tokenResponse.triggerData.length;
            
            this.total_messages=0;
            this.running_count=0;
            this.stateless_count =0;

            for(let index=0;index<tokenResponse.triggerData.length;index++){
                this.total_messages = this.total_messages + tokenResponse.triggerData[index].instanceCounter;
                if(tokenResponse.triggerData[index].triggerState=="RUNNING"){
                    this.running_count = this.running_count + 1
                  }
                
                if(tokenResponse.triggerData[index].stateless==true){
                    this.stateless_count = this.stateless_count + 1
                  }
            }
            
          //   for(let index_flow=0;index_flow<tokenResponse.triggerData.length;index_flow++){
          //       this.triggers[index_flow].flowName = tokenResponse.flowList[index_flow].flowName;
          // }
              console.log("flowlist");
              console.log(tokenResponse.flowList);
              console.log("after data recieved")
            console.log(this.triggers);

            for (const triggerState of tokenResponse.triggerStates) {
              
              if(!this.exists(this.tiggerStates,triggerState)) {
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
              
              if(!this.exists(this.tiggerTypeList,triggerType)) {
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

            this.triggerStats = [
              {
                title: 'Total Triggers',
                amount: this.count,
                progress: {
                  value: 50,
                },
                color: 'bg-indigo-500',
              },
              {
                title: 'Total Messages Generated',
                amount: this.total_messages,
                progress: {
                  value: 70,
                },
                color: 'bg-teal-500',
              },
              {
                title: 'Running Triggers',
                amount: this.running_count,
                progress: {
                  value: 50,
                },
                color: 'bg-green-500',
              },
              {
                title: 'Stateless Triggers',
                amount: this.stateless_count,
                progress: {
                  value: 50,
                },
                color: 'bg-red-500',
              },
              
            ];
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  exists(servers: any[], search: string) {
    //let result: boolean;
    for (const server of servers) {
      if (server.label === search) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  exportexcel(): void
  {
    console.log("excel exportation");
    /* pass here the table id */
    let element = document.getElementById('triggersTable');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.projectSelection.projectKey+'_triggerData.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_triggerData',  //project key is required to be passed
     // image : {type:'jpeg'},
     html2canvas:{width: 1130,
      height: 800},
      jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('triggersTable');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_triggersData").subscribe(() => {
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
          this.getTriggersDataByProjectKey(this.http, this.projectSelection.projectKey,
            this.projectSelection.projectLocation);
        },SharedModule.global_interval );
        
      }
      
    })
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


}
