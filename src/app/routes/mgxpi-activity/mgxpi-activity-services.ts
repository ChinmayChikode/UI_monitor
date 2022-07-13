import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { NgxSpinnerService } from "ngx-spinner";

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

@Injectable()
export class ActivityService {

  activityLog: activityLog[];


  public loading = false;

  previous = 1;
  next = 50;

  recordsFilterRange = 50;

  bpList: any[] = [{label: 'ALL', value: null}];
  flowList: any[] = [{label: 'ALL', value: null}];
  serverList: any[] = [{label: 'ALL', value: null}];

  totalRecordsCount: number;
  lblFromDateValue= "";
  lblToDateValue= "";
  lblFilterFSIDValue= "";
  lblFilterRootFSIDValue= "";
  lblFilterFlowReqIDValue= "";
  actLogDeletionDate= "";

  
  public serializedDate: FormControl;
  @Output() date = new EventEmitter<MatDatepickerInputEvent<any>>();
  nextDisabled = false;
  lastDisabled = false;
  firstDisabled = false;
  previousDisabled = false;
  stats: any[];
  project_key: any;

  constructor(private http: HttpClient, private projectSelection: ProjectSelection,
    private spinner: NgxSpinnerService) { }


  getActivityLogByProjectKey(inputProjectKey: any) {

    this.loading = true;    

    if(this.project_key != inputProjectKey){
      this.project_key = inputProjectKey;
      this.bpList =[{label: 'ALL', value: null}];
      this.flowList =[{label: 'ALL', value: null}];
  }

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
        title: 'Root FSID',
        amount: this.lblFilterRootFSIDValue,
        progress: {
          value: 100,
        },
        color: 'bg-green-500',
      },
      {
        title: 'FSID',
        amount: this.lblFilterFSIDValue,
        progress: {
          value: 100,
        },
        color: 'bg-teal-500',
      },
      {
        title: 'Flow Request ID',
        amount: this.lblFilterFlowReqIDValue,
        progress: {
          value: 100,
        },
        color: 'bg-orange-500',
      },
    ];

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    const body = {
      ProjKey: inputProjectKey,
      ProjLocation: this.projectSelection.projectLocation,
      Previous: this.previous,
      Next: this.next,
      lblFromDateValue: this.lblFromDateValue,
      lblToDateValue: this.lblToDateValue,
      lblFilterFSIDValue: this.lblFilterFSIDValue,
      lblFilterRootFSIDValue: this.lblFilterRootFSIDValue,
      lblFilterFlowReqIDValue: this.lblFilterFlowReqIDValue,
    };

    this.http.post(urls.SERVER_URL + urls.ActivityLog, body, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          this.activityLog = tokenResponse;
          console.log(tokenResponse);
          if (tokenResponse.length > 0) {
            this.totalRecordsCount = tokenResponse[0].totalNumberOfRecords;
            if (this.totalRecordsCount < this.next) {
              this.next = this.totalRecordsCount;
              this.nextDisabled = true;
              this.lastDisabled = true;
            }
            this.loading = false;
          }
          this.spinner.hide();
        },
        (errorResponse: any) => {
          console.log(errorResponse);
          this.loading = false;
        }
      );

   

    let params = new HttpParams();
    params = params.append('projectKey', inputProjectKey);
    params = params.append('projectLocation', this.projectSelection.projectLocation);
    this.http.get(urls.SERVER_URL + urls.TriggersByProject, { headers: tokenHeaders, params })
        .subscribe(
          (tokenResponse: any) => {
            
            console.log(tokenResponse);
            
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
            
            for (const trigger of tokenResponse.triggerData) {
              
              if (!this.exists(this.serverList, 'Server_' + trigger.serverId)) {
                this.serverList.push({label: 'Server_' + trigger.serverId, value: trigger.serverId});
              }
            }

            
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );

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

  deleteActivityLogByDays(inputProjectKey: any) {

    this.loading = true;

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    const body = {
      ProjKey: inputProjectKey,
      actLogDeletionDate: this.actLogDeletionDate,
    };

    this.http.post(urls.SERVER_URL + urls.DeleteActivityLog, body, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          this.activityLog = tokenResponse;
          this.loading = false;
        },
        (errorResponse: any) => {
          console.log(errorResponse);
          this.loading = false;
        }
      );

  }

  first() {
    this.previous = 1;
    this.next = this.recordsFilterRange;
    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
    if (this.previous <= 1) {
      this.firstDisabled = true;
      this.previousDisabled = true;
      this.nextDisabled = false;
      this.lastDisabled = false;
    }
  }

  updatePrevious() {

    if (this.previous > this.recordsFilterRange) {
      this.previous = this.previous - this.recordsFilterRange;
    } else {
      this.previous = 1;
    }

    if (this.next >= this.totalRecordsCount) {
      if (this.previous === 1) {
        const calculateNext = this.totalRecordsCount - this.recordsFilterRange;
        this.next = this.next - calculateNext;
      } else {
        this.next = this.totalRecordsCount - this.recordsFilterRange;
      }

    } else {
      this.next = this.next - this.recordsFilterRange;
    }

    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
    if (this.previous <= 1) {
      this.firstDisabled = true;
      this.previousDisabled = true;
      this.nextDisabled = false;
      this.lastDisabled = false;
    }
  }

  updateNext() {

    this.previous = this.previous + this.recordsFilterRange;
    this.next = this.next + this.recordsFilterRange;

    if (this.next > this.totalRecordsCount) {
      this.next = this.totalRecordsCount;
      this.nextDisabled = true;
      this.lastDisabled = true;
    }

    if (this.previous > 1) {
      this.previousDisabled = false;
      this.firstDisabled = false;
    }
    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

  last() {

    this.previous = this.totalRecordsCount - this.recordsFilterRange;
    this.next = this.totalRecordsCount;

    this.nextDisabled = true;
    this.lastDisabled = true;
    this.previousDisabled = false;
    this.firstDisabled = false;


    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

  onRangeFilterChange(selectedValue: any) {
    this.previous = 1;
    if (this.totalRecordsCount > selectedValue) {
      this.next = selectedValue;
      this.nextDisabled = false;
      this.lastDisabled = false;
    } else {
      this.next = this.totalRecordsCount;
      this.nextDisabled = true;
      this.lastDisabled = true;
    }
    //this.getInitialActLogRecordsCountProjectKey(this.projectSelection.projectKey);
    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

  onFromDateChange(fromDate: any) {
    console.log("from date : " + fromDate,typeof(fromDate));
    this.lblFromDateValue = fromDate;
   
  }

  onToDateChange(toDate: any) {
    console.log("to date : " + toDate);
    this.lblToDateValue = toDate;
  }

  onToDeleteDateChange(logDeletionDate: any) {
    console.log("Here we go To Delete Log : " + logDeletionDate+ " "+typeof(logDeletionDate));
    this.actLogDeletionDate = logDeletionDate;
    this.deleteActivityLogByDays(this.projectSelection.projectKey);

  }

  onFSIDChange(fsid: any) {
    this.lblFilterFSIDValue = fsid;
  }

  onRootFSIDChange(rootfsid: any) {
    this.lblFilterRootFSIDValue = rootfsid;
  }

  onFlowReqIdChange(flowrequestid: any) {
    this.lblFilterFlowReqIDValue = flowrequestid;
  }

 
  applyFilters(fromDate:string,toDate:string,rootfsid:string,flowrequest:string,fsid:string){
   
    
    this.lblFromDateValue = fromDate;
    this.lblToDateValue = toDate;
    this.lblFilterFSIDValue = fsid;
    this.lblFilterRootFSIDValue = rootfsid;
    this.lblFilterFlowReqIDValue = flowrequest;
    console.log(this.lblFilterFSIDValue);
    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

  clearFilters() {
    console.log("clear filter is being executed");
    this.lblFromDateValue = "";
    this.lblToDateValue = "";
    this.lblFilterFSIDValue = "";
    this.lblFilterRootFSIDValue = "";
    this.lblFilterFlowReqIDValue = "";
    this.previous = 1;
    this.next = 50;
    this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

}
