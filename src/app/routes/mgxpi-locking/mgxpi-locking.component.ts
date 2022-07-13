import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { HeaderComponent } from '../admin-layout/header/header.component';

export interface locking {
  fsidCreated;
  name;
  createDate;
}

@Component({
  selector: 'app-mgxpi-locking',
  templateUrl: './mgxpi-locking.component.html',
  styleUrls: ['./mgxpi-locking.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiLockingComponent implements OnInit, AfterViewInit {

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  locking: locking[];
  cols: any[];
  interval:any;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,public headerSrv: HeaderComponent) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {

    this.getLockingDataByProjectKey(this.http,'A_Locking');
    this.interval = setInterval(() => { 
      this.getLockingDataByProjectKey(this.http,'A_Locking');
    }, 5000);

    this.cols = [
        { field: 'fsidCreated', header: 'FSID' },
        { field: 'name', header: 'Resource Name' },
        { field: 'createDate', header: 'Lock Date & Time' },
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

  getLockingDataByProjectKey(http: any,inputProjectKey: any) {

    var projectKey = inputProjectKey;

    let tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa("admin:admin"),
        'Accept': 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.Locking + projectKey, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.locking = tokenResponse;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

}
