import { SidenavService } from 'app/services/sidenav.service';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { urls } from './../../../environments/accessurls';
import { SettingsService } from './../../core/services/settings.service';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from '../admin-layout/header/header.component';

export interface bam {
  createTimeStamp;
  category;
  severity;
  statuscode;
  messagestring;
  blobexists;
}

export interface bamFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

export interface bamFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

@Component({
  selector: 'app-mgxpi-bam',
  templateUrl: './mgxpi-bam.component.html',
  styleUrls: ['./mgxpi-bam.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiBamComponent implements OnInit, OnDestroy, AfterViewInit {

  options = this.settings.getOptions();
  opened = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  bam: bam[];
  cols: any[];
  interval: any;

  showFiller = false;

  testValue = '';

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              private projectSelection: ProjectSelection, private settings: SettingsService,
              public headerSrv: HeaderComponent,
              public dialog: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnInit() {

    this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey);
    /*this.interval = setInterval(() => {
      this.getFlowDataByProjectKey(this.http,this.projectName);
    }, 5000);*/

    this.cols = [
        { field: 'createTimeStamp', header: 'Date & Time' },
        { field: 'category', header: 'Category' },
        { field: 'severity', header: 'Priority' },
        { field: 'statuscode', header: 'Status' },
		    { field: 'messagestring', header: 'Message' },
        { field: 'blobexists', header: 'Blob' },
    ];

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getFlowDataByProjectKey(http: any, inputProjectKey: any) {

    console.log('Called Every 5 Second');

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    http.get(urls.SERVER_URL + urls.ActivityLog + inputProjectKey + '/' + 1 + '/' + 50, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.bam = tokenResponse;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  onClickPanelResize() {
      document.getElementById('sideContentHideScroll').style.overflow = 'hidden';
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        this.timeout();
    }, 250);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {

    const dialogRef = this.dialog.open(MgxpiBAMFiltersComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.testValue = result;
    });

    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.opened = true;
  }

  closePanel() {
    this.opened = false;
  }

  togglePanel() {
    this.opened = !this.opened;
  }

  sendOptions() {
    this.optionsEvent.emit(this.options);
  }

}

// Dialog
@Component({
  selector: 'mgxpi-bam-filters',
  templateUrl: 'mgxpi-bam-filters.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiBAMFiltersComponent {

  bamFilters: bamFilters[];
  cols: any[];

  constructor() {  }

  ngOnInit() {

    this.cols = [
        { field: 'display', header: 'Display' },
        { field: 'write', header: 'Write' },
        { field: 'messageName', header: 'Name' },
    ];

    this.bamFilters = [

      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},
      {'display': true,'write': true,'messageName':'Server Started'},

    ];

  }

}
