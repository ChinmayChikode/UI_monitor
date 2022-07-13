import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AlertData } from './alert-data';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';

@Component({
  selector: 'app-project-alert',
  templateUrl: './project-alert.component.html',
  styleUrls: ['./project-alert.component.scss']
})
export class ProjectAlertComponent implements OnInit, AfterViewInit {

  constructor(private dashboardService: DashboardService, private projectSelection: ProjectSelection) { }
  alertData: AlertData[] = [
    { message: 'High CPU Usage', severity: 'High', createdTimestamp: '14-10-2020 17:14:22.245'},
    { message: 'Mirror Persistency Failure', severity: 'High', createdTimestamp: '14-10-2020 17:25:22.245'},
  ];
  topcols = [
    { field: 'message', header: 'Description' },
    { field: 'severity', header: 'Severity' },
    { field: 'createdTimestamp', header: 'Created Date/Time' }
  ];
  ngOnInit() {

  }
  ngAfterViewInit() {

    this.dashboardService.getAlertData(this.projectSelection.projectKey).subscribe(data => {

      //this.alertData = data;
      console.log(' this.alertData = data---' + JSON.stringify( this.alertData));

    });

  }

}
