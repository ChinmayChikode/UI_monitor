import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';

export interface Messages {
  invocationTypeId: number;
  displayFormattedDate;
  messageId;
  messageStatus;
  invokeCompType;
  bpName;
  flowName;
  workerId;
  messageTimeout;
  invokeTypeID;
}

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
export class MessagesService {

  messages: Messages[];
  totalMessages = 0;
  failledMessages = 0;
  waitingMessages = 0;
  inProcessMessages = 0;
  msgStatuses: any[] = [];
  invocationType: any[] = [];
  bpList: any[] = [];
  flowList: any[] = [];
  //messageId=0;
 invocationTypeId:any[];

 activityLog:activityLog [];
 //ActivityDetials :any;

 totalRecordsCount: number;
 previous = 1;
 next = 50;

 recordsFilterRange = 50;

 lblFromDateValue= "";
 lblToDateValue= "";
 lblFilterFSIDValue= "";
 lblFilterRootFSIDValue= "";
 lblFilterFlowReqIDValue= "";


 nextDisabled = false;
 lastDisabled = false;
 firstDisabled = false;
 previousDisabled = false;




  constructor(private http: HttpClient,public projectSelection: ProjectSelection) { }

  getMessageDataByProjectKey(projectKey: any, projectLocation: any) {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    console.log('projectKey : ' + projectKey);
    console.log('projectLocation : ' + projectLocation);

    let params = new HttpParams();
    params = params.append('projectKey', projectKey);
    params = params.append('projectLocation', projectLocation);
    params = params.append('thresholdMinutes', '0');

    this.http.get(urls.SERVER_URL + urls.Messages, { headers: tokenHeaders, params })
      .subscribe(
        (tokenResponse: any) => {
          this.messages = tokenResponse.messages;
          this.totalMessages = tokenResponse.totalMessages;
          this.failledMessages = tokenResponse.failledMessages;
          this.waitingMessages = tokenResponse.waitingMessages;
          this.inProcessMessages = tokenResponse.inProcessMessages;
          //
         // this.messageId=this.messages.messageId;
                 
        //  for(let i=0;i<this.invocationType.length;i++)
        //  {
           
        //    this.invocationTypeId=tokenResponse.invocationType[i].msgInvoTypeId;
        //    console.log(this.invocationTypeId);
        //  }

        
        //  for(const invokeTypeID of tokenResponse.invocationType)
        //  {
        //    invokeTypeID.msgInvoTypeId 
        //   const invokeTypeID=tokenResponse.invocationType[i].msgInvoTypeId;
        //    //console.log(this.invocationTypeId);
        //  } 


         //this.invocationTypeId=tokenResponse.invocationType[1].msgInvoTypeId;
          console.log(tokenResponse);
          // console.log(this.messages);
          //console.log(this.invocationTypeId);

         // const invokeTypeID=tokenResponse.invocationType.msgInvoTypeId;


          this.empty();
          for (const msgStatus of tokenResponse.msgStatus) {
            if (msgStatus.statusName === 'ALL') {
              this.msgStatuses.push({label: msgStatus.statusName, value: null});
            } else {
              this.msgStatuses.push({label: msgStatus.statusName, value: msgStatus.statusName});
            }
          }
          for (const invoType of tokenResponse.invocationType) {
            if (invoType.msgInvoType === 'ALL') {
              this.invocationType.push({label: invoType.msgInvoType, value: null});
            } else {
              this.invocationType.push({label: invoType.msgInvoType, value: invoType.msgInvoType});
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
          //console.log('BpList : '+ this.bpList);
          //console.log('FlowList: ' + this.flowList);
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
  }

  empty() {
    this.bpList.length = 0;
    this.flowList.length = 0;
    this.msgStatuses.length = 0;
    this.invocationType.length = 0;
  }

  ViewActivityLogDetails(){



    console.log('Called Every 5 Second');
  
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
      Previous: this.previous,
      Next: this.next,
      lblFromDateValue: this.lblFromDateValue,
      lblToDateValue: this.lblToDateValue,
      lblFilterFSIDValue: this.lblFilterFSIDValue,
      lblFilterRootFSIDValue: this.lblFilterRootFSIDValue,
      lblFilterFlowReqIDValue: this.lblFilterFlowReqIDValue,
    };
 

    this.http.post(urls.SERVER_URL + urls.ActivityLog , body , { headers: tokenHeaders })
    .subscribe(
      (tokenResponse: any) => {
        this.activityLog=tokenResponse;
        console.log(this.activityLog);
        if (tokenResponse.length > 0) {
          this.totalRecordsCount = tokenResponse[0].totalNumberOfRecords;
          if (this.totalRecordsCount < this.next) {
            this.next = this.totalRecordsCount;
            this.nextDisabled = true;
            this.lastDisabled = true;
          }
        // this.ActivityDetials=this.activityLog;
      //  this.count=tokenResponse;
      //   console.log("ActivityLogCount "+this.count);
     
    }
  },       
  
  (errorResponse: any) => {
    console.log(errorResponse);
  }
);

}




  first() {
    this.previous = 1;
    this.next = this.recordsFilterRange;
    this.ViewActivityLogDetails();
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

    this.ViewActivityLogDetails();
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
    this.ViewActivityLogDetails();
  }

  last() {

    this.previous = this.totalRecordsCount - this.recordsFilterRange;
    this.next = this.totalRecordsCount;

    this.nextDisabled = true;
    this.lastDisabled = true;
    this.previousDisabled = false;
    this.firstDisabled = false;


    this.ViewActivityLogDetails();
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
    this.ViewActivityLogDetails();
  }


}
