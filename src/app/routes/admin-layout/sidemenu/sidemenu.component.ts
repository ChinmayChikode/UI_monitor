import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './projectselection.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { timeout } from 'rxjs/operators';
import { NotifierService, NotifierType } from '@addapptables/notifier';
import { ProjectLoadComponent } from './../../mgxpi-dashboard/project-load/project-load.component';
import { DashboardComponent } from 'app/routes/mgxpi-dashboard/dashboard.component';
import { DashboardService } from 'app/routes/mgxpi-dashboard/dashboard.service';
import { LicenseUsagesComponent } from './../../mgxpi-dashboard/license-usages/license-usages.component';

export interface ProjectsList {
  projectKey;
  status;
  alert;
  uptime;
}

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  providers: [ProjectLoadComponent, DashboardService, LicenseUsagesComponent]
})
export class SidemenuComponent implements OnInit {

  projectsList: ProjectsList[];
  cols: any[];
  interval: any;
  projectRestartInterval: any;
  searchProjectQuery: any;

  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;
  // statuses: any[];
  projectStatus = '';
  timeout = 60;
  myProp: string;
  projStatusBlink = '';
  isStartRequested = false;
  isStopRequested = false;

  constructor(private http: HttpClient, private projectSelection: ProjectSelection,
              private router: Router, public dialog: MatDialog,
              private notifierService: NotifierService,
              public projectLoadSrv: ProjectLoadComponent,
              public licenseUsageSrv: LicenseUsagesComponent) {

    // this.statuses = [
    //   { label: 'projects-all', value: 'ALL' },
    //   { label: 'project-stopped', value: 'STOPPED' },
    //   { label: 'project-running', value: 'RUNNING' }
    // ];

  }

  ngOnInit(): void {

    this.getAllProjectsList(this.http);

    this.projectSelection.$projectStatus.subscribe((projectStatus: any) => {
      this.projectStatus = projectStatus;
    });

    this.projectSelection.$searchProjectQuery.subscribe((searchProjectQuery: any) => {
      this.searchProjectQuery = searchProjectQuery;
    });

    this.interval = setInterval(() => {
       this.getAllProjectsList(this.http);
     }, 5000);

  }

  openProjectStartSuccess() {
    this.notifierService.open({
      type: NotifierType.success,
      message: 'Project Start Request Sent'
    });
  }

  openProjectStopInfo() {
    this.notifierService.open({
      type: NotifierType.info,
      message: 'Project Stop Request Sent'
    });
  }

  openProjectRestartInfo() {
    this.notifierService.open({
      type: NotifierType.info,
      message: 'Project Restart Request Sent'
    });
  }

  getAllProjectsList(http: any) {

    console.log('Called Every 5 Second');

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.ProjectsList, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          this.projectsList = tokenResponse;
          for (const project of this.projectsList) {
            if (project.projectKey === this.projectSelection.projectKey
              && project.status === 'RUNNING' && this.isStartRequested) {
                this.projStatusBlink = '';
            }
            if (project.projectKey === this.projectSelection.projectKey
              && project.status !== 'RUNNING' && this.isStopRequested) {
                this.projStatusBlink = '';
            }
          }
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
  }

  startProject(project: any) {

    console.log('Project Start Request Sent');
    this.projStatusBlink = 'Active';
    this.isStartRequested = true;
    this.isStopRequested = false;
    this.isProjStatsChngRqstd(project);
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    const body = {
      projectKey: project.projectKey, filePath: project.projectpathWithStartXml,
      loadInDebugMode: project.loadInDebugMode
    };

    this.http.post(urls.SERVER_URL + urls.StartProject, body, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          console.log(tokenResponse);
          this.openProjectStartSuccess();
          console.log('Project Started');
        },
        (errorResponse: any) => {
          console.log(errorResponse);
          console.log('Error Occured..Project Start Request Failed');
        }
      );

  }

  stopProject(project: any) {

    console.log('Project Stop Request Sent');

    this.projStatusBlink = 'Active';
    this.isStopRequested = true;
    this.isStartRequested = false;
    this.isProjStatsChngRqstd(project);

    const dialogRef = this.dialog.open(TimeoutComponent);
    if (this.myProp) {
      dialogRef.componentInstance.input = this.myProp;
    }
    dialogRef.afterClosed().subscribe(timeout => {
      if (timeout !== '' && timeout !== null) {

        const tokenHeaders = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('admin:admin'),
            Accept: 'application/json'
          }
        );

        this.http.get(urls.SERVER_URL + urls.StopProject + project.projectKey + '/' + timeout, { headers: tokenHeaders })
          .subscribe(
            (tokenResponse: any) => {
              console.log(tokenResponse);
              this.openProjectStopInfo();
            },
            (errorResponse: any) => {
              console.log(errorResponse);
            }
          );

      } else {
        this.projStatusBlink = '';
      }
    });

  }

  RestartProject(project: any) {

    console.log('Project Stop request');

    console.log('Project Stop Request Sent');

    const dialogRef = this.dialog.open(TimeoutComponent);
    if (this.myProp) {
      dialogRef.componentInstance.input = this.myProp;
    }
    dialogRef.afterClosed().subscribe(timeout => {
      if (timeout !== '' && timeout !== null) {

        this.openProjectRestartInfo();

        const tokenHeaders = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('admin:admin'),
            Accept: 'application/json'
          }
        );

        const body = {
          projectKey: project.projectKey, filePath: project.projectpathWithStartXml,
          loadInDebugMode: project.loadInDebugMode, timeout
        };

        this.http.post(urls.SERVER_URL + urls.RestartProject, body, { headers: tokenHeaders })
          .subscribe(
            (tokenResponse: any) => {
              console.log(tokenResponse);
            },
            (errorResponse: any) => {
              console.log(errorResponse);
            }
          );

      }
    });

    console.log('Project started');

  }

  getProjectKey(project: any) {
    this.projectSelection.getProjectKey(project);
  }

  isProjectStopped(project: any) {
    if (project.status === 'STOPPED') {
      return true;
    } else {
      return false;
    }
  }

  isProjectRunning(project: any) {
    if (project.status === 'RUNNING') {
      return true;
    } else {
      return false;
    }
  }

  isProjStatsChngRqstd(project: any) {
    if (project.projectKey === this.projectSelection.projectKey && this.projStatusBlink === 'Active') {
      return true;
    } else {
      return false;
    }
  }

  getProjectNavigation(project: any) {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', project.projectKey);
    params = params.append('projectLocation', project.projectLocation);

    this.http.get(urls.SERVER_URL + urls.LoadProjectMetadata, { headers: tokenHeaders, params })
      .subscribe(
        (tokenResponse: any) => {
          // this.flows = tokenResponse;
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
    this.router.navigateByUrl('/');
  }

  getStyle(project: any) {
    if (project.projectKey === this.projectSelection.projectKey) {
      return 'project-active-link';
  } else {
      return '';
  }
  }

}
@Component({
  selector: 'timeout-form',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
  templateUrl: 'timeout.component.html',
})
export class TimeoutComponent {
  public timeout = 60;
  input: string;
}
