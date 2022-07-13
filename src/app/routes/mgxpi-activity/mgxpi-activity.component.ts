import { SidenavService } from 'app/services/sidenav.service';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SettingsService } from './../../core/services/settings.service';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DATE_FORMATS} from '@angular/material';
import { ActivityService } from './mgxpi-activity-services';
import { ActivityFiltersService } from './activity-filters.service';
import { urls } from '@env/accessurls';
import {trigger, style, animate, transition} from '@angular/animations';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { HeaderComponent } from '../admin-layout/header/header.component';

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
  serverName;
  bpName;
  flowName;
}

export interface recordsPerPage {
  value: number;
  label: number;
}

export interface activityFilters {
  display: boolean;
  write: boolean;
  messageName: string;
}

export interface Color {
  colorName: string;
  colorCode: string;
}

export const MY_DATE_FORMATS = {
  parse: {
      dateInput: 'DD-MM-YYYY HH:mm:ss'
  },
  display: {
      dateInput: 'DD-MM-YYYY HH:mm:ss',
      monthYearLabel: 'YYYY MMM',
      dateA11yLabel: 'DD-MM-YYYY HH:mm:ss',
      monthYearA11yLabel: 'YYYY MMM'
  }
}

@Component({
  selector: 'app-mgxpi-activity',
  templateUrl: './mgxpi-activity.component.html',
  styleUrls: ['./mgxpi-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ActivityService,
    HeaderComponent,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(1000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class MgxpiActivityComponent implements OnInit, OnDestroy, AfterViewInit {

  activityFilters: activityFilters[];
  activityFiltersColumns: any[];

  recordsFilter = [
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 500, label: 500 },
  ];

  color2: any = {
    r: 100, g: 130, b: 150
  };

  // color: Color[];
  // colorVal: string;

  options = this.settings.getOptions();
  openedFilterDialog = false;
  openedActLogDeleteDialog = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  activityLog: activityLog[];
  displayedColumns: any[];
  cols: any[];
  interval: any;

  selectedRowData: any[];

  showFiller = false;

  testValue = '';

  showFilters = false;
  activityLogMsgFilter: activityFilters[];
  isActivityLogMsgFilterWritten: any;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient,
              public projectSelection: ProjectSelection, private settings: SettingsService,
              public activityLogDelete: MatDialog,
              public activityService: ActivityService,
              public activityFilterMsgSrv: ActivityFiltersService,
              public headerSrv: HeaderComponent) {

    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();

  //   this.color = [
  //     {colorName:'Select City', colorCode:null},
  //     {colorName:'Red', colorCode:"#CC0000"},
  //     {colorName:'Green', colorCode:"#00C851"},
  //     {colorName:'Blue', colorCode:"#0d47a1"},
  //     {colorName:'Purple', colorCode:"#9933CC"},
  //     {colorName:'Orange', colorCode:"#ff6d00"},
  // ];

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
    }, 5000);
  }

  ngOnInit() {


  this.activityFiltersColumns = [
      { field: 'display', header: 'Display',
      width: '10%' },
      { field: 'write', header: 'Write',
      width: '10%' },
      { field: 'color', header: 'Color',
      width: '10%' },
      { field: 'messageName', header: 'Message Name',
      width: '70%' },
  ];

  // this.activityFilters = [

  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},
  //   {display: true, write: true, messageName: 'Server Started'},

  // ];

    //this.activityService.loadDataLazyInitial(this.projectSelection.projectKey);
    //this.activityService.loadDataLazy(null, this.projectSelection.projectKey);
    //this.activityService.getInitialActLogRecordsCountProjectKey(this.projectSelection.projectKey);

    /*this.interval = setInterval(() => {
      this.getFlowDataByProjectKey(this.http,this.projectName);
    }, 5000);*/

  this.cols = [
        {
          field: 'displayCreatedTime',
          header: 'Date & Time',
          checked: true,
          width: '17%'
        },
        {
          field: 'messageType',
          header: 'Message Type',
          checked: true,
          width: '20%'
        },
        {
          field: 'messagestring',
          header: 'Message String',
          checked: true,
          width: '20%'
        },
        {
          field: 'serverName',
          header: 'Server Name',
          checked: false,
          width: '10%'
        },
        {
          field: 'bpName',
          header: 'Business Process',
          checked: false,
          width: '15%'
        },
        {
          field: 'flowName',
          header: 'Flow Name',
          checked: false,
          width: '12%'
        },
        {
          field: 'stepName',
          header: 'Step Name',
          checked: true,
          width: '15%'
        },
		    {
          field: 'fsid',
          header: 'FSID',
          checked: false,
          width: '5%'
        },
        {
          field: 'flowrequestid',
          header: 'Flow Request ID',
          checked: false,
          width: '5%'
        },
        {
          field: 'rootfsid',
          header: 'Root FSID',
          checked: false,
          width: '5%'
        },
        {
          field: 'blobexists',
          header: 'Blob',
          checked: true,
          width: '5%'
        },
    ];

    this.displayedColumns = this.cols.filter(item => item.checked);

    this.activityService.firstDisabled = true;
    this.activityService.previousDisabled = true;

  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
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

    // const dialogRef = this.activityFiltersdialog.open(MgxpiActivityFiltersComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   this.testValue = result;
    // });

    this.getActLogFilterSettingsByProjKey();

    // if (this.dragging) {
    //   this.dragging = false;
    //   return;
    // }
    // this.opened = true;
  }

  openActLogDeletePanel(event: MouseEvent) {

    const dialogRef = this.activityLogDelete.open(MgxpiActivityLogDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.testValue = result;
    });

    this.openedActLogDeleteDialog = true;
  }

  closePanel() {
    this.openedFilterDialog = false;
  }

  togglePanel() {
    this.openedFilterDialog = !this.openedFilterDialog;
  }

  sendOptions() {
    this.optionsEvent.emit(this.options);
  }

  toggleColumns() {
    this.displayedColumns = this.cols.filter(item => item.checked);
  }

  showFilter(){
    this.showFilters = !this.showFilters;
  }

  getActLogFilterSettingsByProjKey() {

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    const body = {
      ProjKey: this.projectSelection.projectKey,
      ProjLocation: this.projectSelection.projectLocation,
    };

    this.http.post(urls.SERVER_URL + urls.ActivityLogMsgFilters, body, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            this.activityLogMsgFilter = tokenResponse;
            if (this.dragging) {
              this.dragging = false;
              return;
            }
            this.openedFilterDialog = true;
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );

}

writeActivityLogMsgFilters() {

  const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  const body = {
    ProjKey: this.projectSelection.projectKey,
    ProjLocation: this.projectSelection.projectLocation,
    actMsgFiltersMetadata: this.activityLogMsgFilter,
  };

  this.http.post(urls.SERVER_URL + urls.ActivityLogWriteMsgFilters, body, { headers: tokenHeaders })
      .subscribe(
        (tokenResponse: any) => {
          this.isActivityLogMsgFilterWritten = tokenResponse;
          //this.activityService.getActivityLogByProjectKey(this.projectSelection.projectKey);
          this.activityService.loadDataLazyInitial(this.projectSelection.projectKey);
          this.closePanel();
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );

}

}

// Dialog
@Component({
  selector: 'mgxpi-activity-filters',
  templateUrl: 'mgxpi-activity-filters.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiActivityFiltersComponent {

  activityFilters: activityFilters[];
  cols: any[];

  constructor() {  }

  ngOnInit() {

    this.cols = [
        { field: 'display', header: 'Display' },
        { field: 'write', header: 'Write' },
        { field: 'messageName', header: 'Name' },
    ];

    this.activityFilters = [

      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},
      {display: true, write: true, messageName: 'Server Started'},

    ];

  }

}

// Dialog
@Component({
  selector: 'mgxpi-activitylog-delete',
  templateUrl: 'mgxpi-activitylog-delete.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
  providers: [
    ActivityService,
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class MgxpiActivityLogDeleteComponent {

  constructor(public activityServices: ActivityService, public projectSelection: ProjectSelection) {  }

  ngOnInit() {



  }

}
