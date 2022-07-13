import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { HeaderComponent } from './../admin-layout/header/header.component';

export interface subscription {
  pssName;
  bpId;
  flowId;
  oneTime;
}

@Component({
  selector: 'app-mgxpi-subscription',
  templateUrl: './mgxpi-subscription.component.html',
  styleUrls: ['./mgxpi-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiSubscriptionComponent implements OnInit, AfterViewInit {

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  subscription: subscription[];
  cols: any[];
  interval:any;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient, public headerSrv: HeaderComponent) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {

    this.getServersDataByProjectKey(this.http,'A_Locking');
    this.interval = setInterval(() => { 
      this.getServersDataByProjectKey(this.http,'A_Locking');
    }, 5000);

    this.cols = [
        { field: 'pssName', header: 'Event Name' },
        { field: 'bpId', header: 'BPID' },
        { field: 'bpName', header: 'BP Name' },
        { field: 'flowId', header: 'Flow ID' },
        { field: 'flowName', header: 'Flow Name' },
        { field: 'oneTime', header: 'Once ?' },
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

  getServersDataByProjectKey(http: any,inputProjectKey: any) {

    var projectKey = inputProjectKey;

    let tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa("admin:admin"),
        'Accept': 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.Subscription + projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.subscription = tokenResponse;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

}
