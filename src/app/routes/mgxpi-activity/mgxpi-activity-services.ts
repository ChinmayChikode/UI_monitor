import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LazyLoadEvent } from 'primeng/api';

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
}

@Injectable()
export class ActivityService {

  activityLog: activityLog[];


  public loading = false;

  previous = 1;
  next = 50;

  recordsFilterRange = 50;

  totalRecords: number;
  lblFromDateValue: string;
  lblToDateValue: string;
  lblFilterFSIDValue: string;
  lblFilterRootFSIDValue: string;
  lblFilterFlowReqIDValue: string;
  actLogDeletionDate: string;

  public serializedDate: FormControl;
  @Output() date = new EventEmitter<MatDatepickerInputEvent<any>>();
  nextDisabled = false;
  lastDisabled = false;
  firstDisabled = false;
  previousDisabled = false;

  constructor(private http: HttpClient, private projectSelection: ProjectSelection,
    private spinner: NgxSpinnerService) { }

    loadDataLazy(event: LazyLoadEvent, inputProjectKey: any) {

      this.loading = true;
  
      this.spinner.show();
  
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
        page: event.first / this.recordsFilterRange,
        size: event.rows
      };
  
      this.http.post(urls.SERVER_URL + '/activityLogPages', body, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.activityLog = tokenResponse.content;
            if (tokenResponse.content.length > 0) {
              this.totalRecords = tokenResponse.totalElements;
              if (this.totalRecords < this.next) {
                this.next = this.totalRecords;
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
  
    }

    loadDataLazyInitial(inputProjectKey: any) {

      this.loading = true;
  
      this.spinner.show();
  
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
        lblFilterFlowReqIDValue: this.lblFilterFlowReqIDValue
      };
  
      this.http.post(urls.SERVER_URL + '/activityLogPages', body, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.activityLog = tokenResponse.content;
            if (tokenResponse.content.length > 0) {
              this.totalRecords = tokenResponse.totalElements;
              if (this.totalRecords < this.next) {
                this.next = this.totalRecords;
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
  
    }

  /*getActivityLogByProjectKey(inputProjectKey: any) {

    this.loading = true;

    this.spinner.show();

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

  }*/

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

  /* first() {
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
  } */

  onRangeFilterChange(selectedValue: any) {
    this.previous = 1;
    if (this.totalRecords > selectedValue) {
      this.next = selectedValue;
      this.nextDisabled = false;
      this.lastDisabled = false;
    } else {
      this.next = this.totalRecords;
      this.nextDisabled = true;
      this.lastDisabled = true;
    }
    //this.getInitialActLogRecordsCountProjectKey(this.projectSelection.projectKey);
    //this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

  onFromDateChange(fromDate: any) {
    console.log("Here we go : " + fromDate);
    this.lblFromDateValue = fromDate;
  }

  onToDateChange(toDate: any) {
    console.log("Here we go : " + toDate);
    this.lblToDateValue = toDate;
  }

  onToDeleteDateChange(logDeletionDate: any) {
    console.log("Here we go To Delete Log : " + logDeletionDate);
    this.actLogDeletionDate = logDeletionDate;
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

  clearFilters() {
    this.lblFromDateValue = "";
    this.lblToDateValue = "";
    this.lblFilterFSIDValue = "";
    this.lblFilterRootFSIDValue = "";
    this.lblFilterFlowReqIDValue = "";
    //this.getActivityLogByProjectKey(this.projectSelection.projectKey);
  }

}
