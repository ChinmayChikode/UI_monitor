import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '@env/accessurls';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

    lastTriggerActivity;
    latestWorker;
    pendingRequest = 0;
    projectNoOfThreads = 0;
    requestServed = 0;
    reservedLicenseThreads = 0;
    serverCount = 0;
    startedAt;
    totalWorker = 0;
    triggerCount = 0;
    workeCount = 0;
    projectState: string;

  constructor(private http: HttpClient) { }

  getProjectSummary(projectKey: any) {

    const tokenHeaders = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin'),
          Accept: 'application/json'
        }
      );

    this.http.get(urls.SERVER_URL + urls.Summary + projectKey, { headers: tokenHeaders })
          .subscribe(
            (tokenResponse: any) => {
                this.lastTriggerActivity = tokenResponse.lastTriggerActivity;
                this.latestWorker = tokenResponse.latestWorker;
                this.pendingRequest = tokenResponse.pendingRequest;
                this.projectNoOfThreads = tokenResponse.projectNoOfThreads;
                this.requestServed = tokenResponse.requestServed;
                this.reservedLicenseThreads = tokenResponse.reservedLicenseThreads;
                this.serverCount = tokenResponse.serverCount;
                this.startedAt = tokenResponse.startedAt;
                this.totalWorker = tokenResponse.totalWorker;
                this.triggerCount = tokenResponse.triggerCount;
                this.workeCount = tokenResponse.workeCount;
                this.projectState = tokenResponse.projectState;
                  console.log(tokenResponse);
                // console.log(this.latestWorker);
                // console.log(this.reservedLicenseThreads);
            },
            (errorResponse: any) => {
              console.log(errorResponse);
            }
          );

  }

}
