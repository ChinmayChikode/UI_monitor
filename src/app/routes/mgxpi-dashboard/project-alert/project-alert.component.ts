import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AlertData } from './alert-data';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';
import { SharedModule } from '@shared';

@Component({
  selector: 'app-project-alert',
  templateUrl: './project-alert.component.html',
  styleUrls: ['./project-alert.component.scss']
})
export class ProjectAlertComponent implements OnInit, AfterViewInit, OnDestroy {
  alertData: AlertData[] ;
  interval: any;

  constructor(private dashboardService: DashboardService, private projectSelection: ProjectSelection) { }
  // alertData: AlertData[] = [
  //   { message: 'High CPU Usage', severity: 'High', createdTimestamp: '14-10-2020 17:14:22.245',alertStatus:'Resolved'},
  //   { message: 'Mirror Persistency Failure', severity: 'High', createdTimestamp: '14-10-2020 17:25:22.245',alertStatus: 'Resolved'},
  // ];
  //alertData : any;
  topcols = [
    { field: 'message', header: 'Description' },
    { field: 'severity', header: 'Severity' },
    { field: 'createdTimestamp', header: 'Created Date/Time' },
  
  ];
  ngOnInit() {

  }
  ngAfterViewInit() {

    this.interval = setInterval(()=>{
      this.load();
    },SharedModule.global_interval);
  }

  ngOnDestroy(){

    clearInterval(this.interval);
  }

    // this.dashboardService.getAlertData(this.projectSelection.projectKey).subscribe(data => {

    //    this.alertData = data;
    //   // const data_alert =data;
    //   //console.log(' this.alertData = data---' + JSON.stringify( this.alertData));
    //   // console.log("alert data");
    //   console.log(this.alertData);
    //   //console.log(data_alert);
    // });

  // }

  load(){
    this.dashboardService.getAlertData(this.projectSelection.projectKey).subscribe(data => {

      this.alertData = data;
     // const data_alert =data;
     //console.log(' this.alertData = data---' + JSON.stringify( this.alertData));
     // console.log("alert data");
     console.log(this.alertData);
     //console.log(data_alert);
   });
  }

}
