import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SidenavService } from './../../services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from './../admin-layout/header/header.component';

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

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  flows: flows[];
  triggers: triggers[];
  flowColumns: any[];
  interval: any;
  triggerColumns: any[];

  bpList: any[] = [];
  flowList: any[] = [];

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection,
              public headerSrv: HeaderComponent) {

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

    this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);
    /*this.interval = setInterval(() => {
      this.getFlowDataByProjectKey(this.http,this.projectName);
    }, 5000);*/

    this.flowColumns = [
        { field: 'bpId', header: 'BP ID', width: '5%' },
        { field: 'bpName', header: 'BP Name', width: '17%'  },
        { field: 'flowId', header: 'Flow ID', width: '5%'  },
        { field: 'flowName', header: 'Flow Name', width: '12%'  },
		    { field: 'maxInstance', header: 'Running Instances', width: '15%'  },
        { field: 'instanceCounter', header: 'Total Invocations', width: '10%'  },
        { field: 'isEnable', header: 'Enabled', width: '5%'  },
		    { field: 'recoveryPolicy', header: 'Recovery Policy', width: '10%'  },
        { field: 'timeoutPolicy', header: 'Timeout Policy', width: '10%'  },
        { field: 'timeout', header: 'Timeout', width: '5%'  },

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
      { field: 'bufferSize', header: 'Total Messages', width: '5%'  },
      { field: 'triggerState', header: 'State', width: '8%'  },
      { field: 'startedAtDate', header: 'Started At', width: '16.5%'  },
    ];

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getFlowDataByProjectKey(http: any, inputProjectKey: any, projectLocation: any) {

    console.log('Called Every 5 Second');

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
            this.flows = tokenResponse.flowData;
            for (const bp of tokenResponse.bpList) {
              if (bp.bpName === 'ALL') {
                this.bpList.push({label: bp.bpName, value: null});
              } else {
                this.bpList.push({label: bp.bpName, value: bp.bpName});
              }
            }
            for (const flow of tokenResponse.flowList) {
              if (flow.flowName === 'ALL') {
                this.flowList.push({label: flow.flowName, value: null});
              } else {
                this.flowList.push({label: flow.flowName, value: flow.flowName});
              }
            }
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  getTriggersDataByFlows(flowsData: any) {

    console.log('Called Every 5 Second : ' + flowsData.flowId);

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
            /*this.triggers = tokenResponse;*/
            console.log("Triggers : "+this.triggers);
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
