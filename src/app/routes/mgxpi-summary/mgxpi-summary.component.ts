import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { SummaryService } from './summary.service';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';
import D3Funnel from 'd3-funnel';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from '@core/services/settings.service';

@Component({
  selector: 'app-mgxpi-summary',
  templateUrl: './mgxpi-summary.component.html',
  styleUrls: ['./mgxpi-summary.component.scss']
})
export class MgxpiSummaryComponent implements OnInit, OnDestroy , AfterViewInit {

  startedDate: Date;
  lastInvokeDate: Date;
  lastWorkerActivityDate: Date;
  chartOptions: any;
  projectLoadChart = null;
  peakcount = 1;
  toggleButtonStatus: boolean;
  toggleIconChange: boolean;
  interval: any;
  barInterval: any;
  stats: any[];
  options = this.settingsSrv.getOptions();

  constructor(private ngZone: NgZone, private sidenavSrv: SidenavService,
              private summarySrv: SummaryService, private projectSelection: ProjectSelection,
              private spinner: NgxSpinnerService, private settingsSrv : SettingsService) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit(): void {

    console.log("on init");
    this.spinner.show();
    this.startedDate = new Date();
    this.lastInvokeDate = new Date();
    this.lastWorkerActivityDate = new Date();

    this.summarySrv.getProjectSummary(this.projectSelection.projectKey);
    this.interval = setInterval(() => {

    this.summarySrv.getProjectSummary(this.projectSelection.projectKey);

    this.stats = [
        {
          title: 'Servers',
          amount: this.summarySrv.serverCount,
          progress: {
            value: 100,
          },
          color: 'bg-indigo-500',
        },
        {
          title: 'Workers',
          amount: this.summarySrv.workeCount,
          progress: {
            value: 100,
          },
          color: 'bg-blue-500',
        },
        {
          title: 'Polling triggers',
          amount: this.summarySrv.triggerCount,
          progress: {
            value: 100,
          },
          color: 'bg-green-500',
        },
        {
          title: 'Request Served',
          amount: this.summarySrv.requestServed,
          progress: {
            value: 100,
          },
          color: 'bg-teal-500',
        },
        {
          title: 'Pending Request',
          amount: this.summarySrv.pendingRequest,
          progress: {
            value: 100,
          },
          color: 'bg-orange-500',
        },
      ];

    const data = [
        ['Last Trigger Invocation\n',      this.summarySrv.lastTriggerActivity],
        ['Last Worker Activity\n', this.summarySrv.latestWorker,  ' #0e76a8'],
        ['Started At\n',     this.summarySrv.startedAt,  ' #90EE90', '#FFFFFF']
      ];

    const options = {
        chart: {
          width: 325,
          height: 325,
          bottomWidth: 1 / 3,
          bottomPinch: 0,
          inverted: false,
          hoverEffects : true,
          horizontal: false,
          animate: 0,
          curve: {
              enabled: true,
          },
          totalCount: null,
        },
        block: {
          dynamicHeight: true,
          dynamicSlope: false,
          barOverlay: false,
          fill: {
              type: 'gradient',
          },
          minHeight: 0,
          highlight: false,
        },
        label: {
          enabled: true,
          fontFamily: null,
          fontSize: '12px',
          fill: '#fff',
          format: '{l}\n----------------------------------------\n{f}',
        },
        tooltip: {
          enabled: true,
          format: '{l} {f}',
        },
        events: {
          click: {
              block: null,
          },
        },
    };

    const chart = new D3Funnel('#funnel');
    chart.draw(data, options);

    this.chartOptions = {
        series: [
          {
            name: 'Total Count',
            data: [5, 10, 0, this.summarySrv.workeCount]
          }
        ],
        chart: {
          type: 'bar',
          height: 375
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '30%',
            // endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          type: 'category',
          categories: [
            'Reserved licenses',
            'Consumed licenses',
            'Production licenses',
            'Non-Production licenses'
          ]
        },
        yaxis: {
          title: {
            text: 'Licenses Available'
          }
        },
        fill: {
          type: 'gradient',
          colors: ['#1A73E8', '#B32824', '#7E36AF'],
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: []
          }
        },
        tooltip: {
          y: {
            formatter(val) {
              return  val;
            }
          }
        }
      };
      this.spinner.hide();
     }, 3000);

  }

  ngAfterViewInit() {
    console.log("after view init");
    this.barInterval = setInterval(() => {
    this.ngZone.runOutsideAngular(() => this.initiateChart());
    clearInterval(this.barInterval);
    this.spinner.hide();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
      clearInterval(this.barInterval);
    }
  }

  initiateChart() {
    this.projectLoadChart = new ApexCharts(document.querySelector('#projectLoadChart'), this.chartOptions);
    this.projectLoadChart.render();
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }


}
