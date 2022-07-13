import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from '../admin-layout/header/header.component';

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

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  triggers: triggers[];
  cols: any[];
  interval: any;

  bpList: any[] = [];
  flowList: any[] = [];
  tiggerTypeList: any[] = [];
  tiggerStates: any[] = [];
  serversList: any[] = [];

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

  ngOnInit() {

    this.getTriggersDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);
    /*this.interval = setInterval(() => {
      this.getTriggersDataByProjectKey(this.http,'DEBMAS_Trigger');
    }, 5000);*/

    this.cols = [
        { field: 'triggerName', header: 'Name', width: '17%'  },
        { field: 'triggerType', header: 'Type', width: '15%'  },
        { field: 'triggerId', header: 'Trigger ID', width: '5%'  },
        { field: 'serverId', header: 'Server ID', width: '8%'  },
		    { field: 'bpName', header: 'BP Name', width: '15%'  },
        { field: 'flowName', header: 'Flow Name', width: '10%'  },
        { field: 'lastMessagedAtDate', header: 'Last Message At', width: '18%'  },
		    { field: 'bufferSize', header: 'Total Messages', width: '5%'  },
        { field: 'triggerState', header: 'State', width: '8%'  },
        { field: 'startedAtDate', header: 'Started At', width: '18%'  },
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
            for (const triggerState of tokenResponse.triggerStates) {
              if (triggerState === 'ALL') {
                this.tiggerStates.push({label: triggerState, value: null});
              } else {
                this.tiggerStates.push({label: triggerState, value: triggerState});
              }
            }
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

  exists(servers: any[], search: string) {
    let result: boolean;
    for (const server of servers) {
      if (server.label === search) {
        result = true;
      } else {
        result = false;
      }
    }
    return result;
  }

}
