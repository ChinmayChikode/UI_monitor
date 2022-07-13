import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { HeaderComponent } from './../admin-layout/header/header.component';

export interface scheduler {
  execDateTimeOrg;
  bpId;
  bpName;
  flowId;
  flowName;
  schedulerName;
}

@Component({
  selector: 'app-mgxpi-scheduler',
  templateUrl: './mgxpi-scheduler.component.html',
  styleUrls: ['./mgxpi-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiSchedulerComponent implements OnInit, AfterViewInit {

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  scheduler: scheduler[];
  cols: any[];
  interval:any;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient, public headerSrv: HeaderComponent) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {

    this.getSchedulerDataByProjectKey(this.http,'RtView_Scheduler_and_Lock');
    this.interval = setInterval(() => { 
      this.getSchedulerDataByProjectKey(this.http,'RtView_Scheduler_and_Lock');
    }, 5000);

    this.cols = [
        { field: 'execDateTimeOrg', header: 'Invocation Time' },
        { field: 'bpId', header: 'BPID' },
        { field: 'bpName', header: 'BP Name' },
        { field: 'flowId', header: 'Flow ID' },
        { field: 'flowName', header: 'Flow Name' },
        { field: 'schedulerName', header: 'Name' }
    ];

  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined){
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }

  clickOnToggle(){
    this.toggleButtonStatus = !this.toggleButtonStatus;   
    this.toggleIconChange = !this.toggleIconChange;    
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getSchedulerDataByProjectKey(http: any,inputProjectKey: any) {

    var projectKey = inputProjectKey;

    let tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa("admin:admin"),
        'Accept': 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.Scheduler, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.scheduler = tokenResponse;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

}
