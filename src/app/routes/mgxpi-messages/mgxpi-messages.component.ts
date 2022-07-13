import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import {
  SidenavService
} from './../../services/sidenav.service';
import {
  MessagesService
} from './messages.service';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import {
  urls
} from './../../../environments/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import {
  SettingsService
} from '@core';
import {
  MatDialog
} from '@angular/material';
import {
  CdkDragStart
} from '@angular/cdk/drag-drop';
import { HeaderComponent } from '../admin-layout/header/header.component';

@Component({
  selector: 'app-mgxpi-messages',
  templateUrl: './mgxpi-messages.component.html',
  styleUrls: ['./mgxpi-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [MessagesService,HeaderComponent]
})

export class MgxpiMessagesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private sidenavSrv: SidenavService, public messagesSrv: MessagesService,
              private projectSelection: ProjectSelection,
              private settings: SettingsService,
              public dialog: MatDialog,
              public headerSrv: HeaderComponent) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  options = this.settings.getOptions();
  opened = false;
  dragging = false;
  @Output() optionsEvent = new EventEmitter<object>();

  totalMessages: number;
  failledMessages: number;
  waitingMessages: number;
  inProcessMessages: number;

  projectName: string;

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  panelOpenState = false;
  testValue: any;

  cols: any[];
  messageStats: any[];
  interval: any;
  bpNames: any[];

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnInit() {

    /*this.projectSelection.$projectSelection.subscribe((projectKey: any) => {
      this.projectName = projectKey;
    });*/

    this.messagesSrv.getMessageDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);
    this.interval = setInterval(() => {
      this.messagesSrv.getMessageDataByProjectKey(this.projectSelection.projectKey, this.projectSelection.projectLocation);

      this.messageStats = [
        {
          title: 'Messages',
          amount: this.messagesSrv.totalMessages,
          progress: {
            value: 50,
          },
          color: 'bg-indigo-500',
        },
        {
          title: 'Processing Time',
          amount: 0,
          progress: {
            value: 70,
          },
          color: 'bg-blue-500',
        },
        {
          title: 'In Process',
          amount: this.messagesSrv.inProcessMessages,
          progress: {
            value: 80,
          },
          color: 'bg-green-500',
        },
        {
          title: 'Pending',
          amount: this.messagesSrv.waitingMessages,
          progress: {
            value: 40,
          },
          color: 'bg-teal-500',
        },
        {
          title: 'Failed',
          amount: this.messagesSrv.failledMessages,
          progress: {
            value: 40,
          },
          color: 'bg-red-500',
        },
      ];

    }, 5000);

    this.cols = [{
      field: 'displayFormattedDate',
      header: 'Created',
      width: '17%'
    },
    {
      field: 'messageId',
      header: 'ID',
      width: '8%'
    },
    {
      field: 'messageStatus',
      header: 'Status',
      width: '12%'
    },
    {
      field: 'invokeCompType',
      header: 'Invocation Type',
      width: '15%'
    },
    {
      field: 'bpName',
      header: 'BP',
      width: '15%'
    },
    {
      field: 'flowName',
      header: 'Flow',
      width: '10%'
    },
    {
      field: 'workerId',
      header: 'Worker ID',
      width: '8%'
    },
    {
      field: 'messageTimeout',
      header: 'Timeout',
      width: '8%'
    },
    ];

    this.messageStats = [
      {
        title: 'Messages',
        amount: this.messagesSrv.totalMessages,
        progress: {
          value: 50,
        },
        color: 'bg-indigo-500',
      },
      {
        title: 'Processing Time',
        amount: 0,
        progress: {
          value: 70,
        },
        color: 'bg-blue-500',
      },
      {
        title: 'In Process',
        amount: this.messagesSrv.inProcessMessages,
        progress: {
          value: 80,
        },
        color: 'bg-green-500',
      },
      {
        title: 'Pending',
        amount: this.messagesSrv.waitingMessages,
        progress: {
          value: 40,
        },
        color: 'bg-teal-500',
      },
      {
        title: 'Failed',
        amount: this.messagesSrv.failledMessages,
        progress: {
          value: 40,
        },
        color: 'bg-red-500',
      },
    ];

  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {

    /*const dialogRef = this.dialog.open(MgxpiMessageDetailsComponent);
    dialogRef.componentInstance.totalMessages = this.messagesSrv.totalMessages;
    dialogRef.componentInstance.failledMessages = this.messagesSrv.failledMessages;
    dialogRef.componentInstance.waitingMessages = this.messagesSrv.waitingMessages;
    dialogRef.componentInstance.inProcessMessages = this.messagesSrv.inProcessMessages;
    dialogRef.afterClosed().subscribe(result => {
      this.testValue = result;
    }); */

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

declare var Chart: any;

// Dialog
/*@Component({
  selector: 'mgxpi-message-details',
  templateUrl: 'mgxpi-message-details.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MgxpiMessageDetailsComponent implements OnInit {

  constructor() { }

  totalMessages: number;
  failledMessages: number;
  waitingMessages: number;
  inProcessMessages: number;

  public pieChartLabels: string[];
  public pieChartData: number[];
  public pieChartType: string;

  public barChartOptions = {
    responsive: true,
    showAllTooltips: true,
    borderColor: 'rgba(0,0,0,1)',
    borderWidth: 1,
    caretSize: 0,
    legend: {
      position: 'right'
    },
  };

  ngOnInit(): void {
    this.pieChartLabels = ['Total', 'Average Message Processing Time', 'In Process', 'Pending', 'Failed'];
    this.pieChartData = [this.totalMessages, 0, this.inProcessMessages, this.waitingMessages, this.failledMessages];
    this.pieChartType = 'pie';

    Chart.pluginService.register({
      beforeDraw: (chart) => {
      if (chart.config.options.showAllTooltips) {
        chart.pluginTooltips = [];
        chart.config.data.datasets.forEach(function(dataset, i) {
          let counter = 0;
          console.log('Hi->' + chart.config.data.datasets[0].data[counter]);
          chart.getDatasetMeta(i).data.forEach(function(sector, j) {
            if(chart.config.data.datasets[0].data[counter] !== 0) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart));
          }
            counter++;
          });
        });
        chart.options.tooltips.enabled = false;
      }
    },
    afterDraw: (chart, easing) => {
      if (chart.config.options.showAllTooltips) {
        if (!chart.allTooltipsOnce) {
          if (easing !== 1) {
            return;
          }
          chart.allTooltipsOnce = true;
        }
        chart.options.tooltips.enabled = true;
        Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
          tooltip.initialize();
          tooltip.update();
          tooltip.pivot();
          tooltip.transition(easing).draw();
        });
        chart.options.tooltips.enabled = false;
      }
    }
  });

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

} */
