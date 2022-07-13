import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';

export interface Messages {
  displayFormattedDate;
  messageId;
  messageStatus;
  invokeCompType;
  bpName;
  flowName;
  workerId;
  messageTimeout;
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

  constructor(private http: HttpClient) { }

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
          console.log('BpList : '+ this.bpList);
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
}
