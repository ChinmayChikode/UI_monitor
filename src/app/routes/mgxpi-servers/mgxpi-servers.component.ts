import { Component, OnInit, OnChanges, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { workers } from 'cluster';
import { SettingsService } from '@core';
import { MatDialog } from '@angular/material';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { HeaderComponent } from './../admin-layout/header/header.component';

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
export class MgxpiServersComponent implements OnInit, AfterViewInit {

  options = this.settings.getOptions();
  opened = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  panelOpenState = false;
  testValue: any;

  servers: servers[];
  workers: workers[];
  serverColumns: any[];
  workerColumns: any[];
  interval: any;
  hostList: any[] = [];
  statusList: any[] = [];
  licenseFeatureList: any[] = [];

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection,
              private settings: SettingsService,
              public headerSrv: HeaderComponent,
              public dialog: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
    console.log('Not Lazily Loaded : NotALazyModule');
    
  }

  ngOnInit() {

    this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey);

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

  getServersDataByProjectKey(http: any, projectKey: any) {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.Servers + projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.servers = tokenResponse.serverData;
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

    console.log('Called Every 5 Second : ' + server.serverId);

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    // this.http.get(urls.SERVER_URL + urls.ServerWorkersByProject + server.serverId, { headers: tokenHeaders })
    this.http.get(urls.SERVER_URL + urls.ServerWorkersByProject + this.projectSelection.projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.workers = tokenResponse[0].workers;
            // console.log('Sudeeps Workers : ' + this.workers);
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
  this.opened = false;
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
