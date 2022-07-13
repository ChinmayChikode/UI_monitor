import { Component, OnInit, AfterViewInit, NgZone, OnDestroy , ViewChild ,ElementRef} from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { SummaryService } from './summary.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';
import D3Funnel from 'd3-funnel';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from '@core/services/settings.service';
import * as html2pdf from 'html2pdf.js';
import { MatDialog } from '@angular/material';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
//import * as Highcharts from 'highcharts';
// import HC_exporting from 'highcharts/modules/exporting';
//import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-mgxpi-summary',
  templateUrl: './mgxpi-summary.component.html',
  styleUrls: ['./mgxpi-summary.component.scss'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(180deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})
export class MgxpiSummaryComponent implements OnInit, OnDestroy , AfterViewInit {

//  Highcharts=Highcharts;  
   //items: MenuItem[];
   items:any;
  // windows:any;
  //  menu:any;
  //  menuVisible:boolean;
  startedDate: Date;
  lastInvokeDate: Date;
  lastWorkerActivityDate: Date;
  chartOptions: any;
  chartOptionsfinal:any;
  projectLoadChart = null;
  peakcount = 1;
  toggleButtonStatus: boolean;
  toggleIconChange: boolean;
  interval: any;
  barInterval: any;
  stats: any[];
  flip = 'inactive';
  options = this.settingsSrv.getOptions();

  

  constructor(private ngZone: NgZone, private sidenavSrv: SidenavService,
              private summarySrv: SummaryService, private projectSelection: ProjectSelection,
              private spinner: NgxSpinnerService, private settingsSrv : SettingsService,public activityLogRefresh: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();

    
  }

  ngOnInit(): void {  

    console.log("on init");
   //this.spinner.hide();
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
            data: [this.summarySrv.reservedLicenseThreads, 0, 0,0]
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
      setTimeout(() =>{
        this.spinner.hide();
      },5000);
     },5000);
    



// this.chartOptionsfinal{
// Highcharts.chart('container', {
// chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: null,
//         plotShadow: false,
//         type: 'pie'
//     },
//     title: {
//         text: 'Alternate Data'
//     },
//     tooltip: {
//         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//     },
//     accessibility: {
//         point: {
//             valueSuffix: '%'
//         }
//     },
//     plotOptions: {
//         pie: {
//             allowPointSelect: true,
//             cursor: 'pointer',
//             dataLabels: {
//                 enabled: false
//             },
//             showInLegend: true
//         }
//     },
//     exporting:{
//       enabled:true
//     },

//     credits:{
//       enabled:false
//     }

//     series: [{
//         name: 'Linceses',
//         colorByPoint: true,
//         data: [{
//             name: 'Reserved licenses',
//             y: {{this.summarySrv.reservedLicenseThreads}} ,
//             sliced: true,
//             selected: true
//         }, {
//             name: 'Consumed licenses',
//             y: {{this.summarySrv.reservedLicenseThreads}}
//         }, {
//             name: 'Production licenses',
//             y: {{this.summarySrv.workeCount}}
//         }, {
//             name: 'No-production licenses',
//             y: {{this.summarySrv.workeCount}}
//         }]
//     }] 
//  }
// }


     
}


  ngAfterViewInit() {
    console.log("after view init");
    this.barInterval = setInterval(() => {
    this.ngZone.runOutsideAngular(() => this.initiateChart());
    clearInterval(this.barInterval);
    this.spinner.hide();
    }, 1000);
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

  toggleFlip() {
    this.flip = (this.flip === 'inactive') ? 'active' : 'inactive';
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_Summarydata',  //project key is required to be passed
     // image : {type:'jpeg'},
      html2canvas:{}
      //jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  onRightClick(){
        
    //this.flow_data_for_contextmenu = flowsdata;
    
    window.addEventListener("contextmenu",function(event){
      event.preventDefault();
      let contextElement = document.getElementById("context-menu");
      contextElement.style.top = event.clientY + "px";
      contextElement.style.left = event.clientX + "px";
      contextElement.classList.add("active");
    });
    window.addEventListener("click",function(){
      document.getElementById("context-menu").classList.remove("active");
    });
    console.log("right click has been executed and returning false");
  }

  refresh(){
    let dialogref = this.activityLogRefresh.open(RefreshTableComponent,{
      data:{ refresh_interval:SharedModule.global_interval/1000}
    });
  
    dialogref.afterClosed().subscribe(result=>{
  
      console.log("activity compoenent received data "+result.data_interval);
      // console.log("activity compoenent received data "+typeof(result.data_interval)); 
      if(result.data_interval){
        SharedModule.global_interval = result.data_interval*1000
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.summarySrv.getProjectSummary(this.projectSelection.projectKey);
        },SharedModule.global_interval );
        
      }
      
    })
  }



}
