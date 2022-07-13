import { Project } from './../../services/project';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { LicenseSummaryData } from './license-summary-data';
import { LicenseSummaryService } from './license-summary.service';
import { Series } from '../chartbeans/series';
import { ChartDetails } from '../chartbeans/chartdetails';
import { MgxpiApexChartService } from '../chartbeans/mgxpi-apex-chart.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { ProjectService } from 'app/services/project.service';
import { LicensePeakData } from './license-peak-data';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-mgxpi-license-summary',
  templateUrl: './mgxpi-license-summary.component.html',
  styleUrls: ['./mgxpi-license-summary.component.scss']
})
export class MgxpiLicenseSummaryComponent implements OnInit {
  chartOptions: any;
  toggleButtonStatus: boolean;
  toggleIconChange: boolean;
  licenseDataProject = null;
  licenseDataProjectWise: LicenseSummaryData[] = [];
  licenseData: LicenseSummaryData[] = [];
  selectedProject: string;
  rangeFilter = 'pWeek';
  fDate: Date;
  tDate: Date;
  frmDate: Date;
  projects: Project[];
  itemSeries: Series;
  series: Series[] = [];
  chartDetails: ChartDetails;
  categories: string[] = [];
  data: {data: number[]}[] = [];
  chartType: string;
  plotType = 'horizontal';
  peakBy: string;
  peakByProject: string;
  xaxistitle: string;
  yaxistitle: string;

  licenseTableColms = [
    // { field: 'projectKey', header: 'Project Name' },
    { field: 'dateTimeString', header: 'Peak reached on' }
  ];

  licensePeakData: LicensePeakData[] = [];

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  constructor(private sidenavSrv: SidenavService,
              private licenseSummaryService: LicenseSummaryService,
              private mgxpiApexChartService: MgxpiApexChartService,
              private projectService: ProjectService) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {
    this.peakBy = 'sStart';
    this.chartType = 'bar';
    this.selectedProject = 'FlowProj';
    this.rangeFilter = 'sStart';
    this.loadProjectList();
    this.getDefaultLicenseData();
    this.getProjectAndPeakLicenseData();

  }

  loadProjectList() {
    this.projectService.getProjectList().subscribe(data => {
        this.projects = data;
      }
    );
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }


  initChart() {
    this.loadLicenseChart();
  }

  reloadChart() {
    if (this.selectedProject === 'All') {
      this.getProjectWiseLicenseData();
    } else {
      this.getDefaultLicenseData();
    }
  }

  loadLicenseChart() {
    this.setAxisTitle();
    if (this.licenseDataProject) {
      this.licenseDataProject.destroy();
    }
    this.chartDetails = new ChartDetails('mychart', 420, this.chartType === 'mixedLine' ? 'line' : this.chartType, {
      dataPointSelection: this.myFunc
    });
    this.chartOptions = this.mgxpiApexChartService.getChartBean(this.series, this.chartDetails, '', this.categories, this.yaxistitle, this.xaxistitle);
    this.mgxpiApexChartService.setHorizontal(this.chartOptions, this.plotType === 'horizontal');
    this.licenseDataProject = this.mgxpiApexChartService.loadChart(document.querySelector('#projectLoadChart'), this.chartOptions);
  }

  getProjectWiseLicenseData() {
    this.licenseSummaryService.getProjectWiseLicenseData(this.rangeFilter, this.fDate, this.tDate).subscribe(data => {
      this.categories = data.categories;
      this.series = data.series;
      this.initChart();
      this.peakByProject = data.categories[0];
      this.getProjectAndPeakLicenseDataAll();
    });
  }

  getProjectAndPeakLicenseData() {
    this.licenseSummaryService.getProjectAndPeakLicenseData(this.selectedProject, this.peakBy).subscribe(data => {
      this.licensePeakData = data;
    });
  }

  getProjectAndPeakLicenseDataAll() {
    this.licenseSummaryService.getProjectAndPeakLicenseData(this.peakByProject, this.rangeFilter, this.fDate, this.tDate).subscribe(data => {
      this.licensePeakData = data;
    });
  }

  getDefaultLicenseData() {
    this.licenseSummaryService.getDefaultLicenseData(this.selectedProject).subscribe(data => {
      this.categories = data.categories;
      this.series = data.series;
      console.log(this.series);
      this.initChart();
    });
    this.getProjectAndPeakLicenseData();
  }

  fromdata() {
  }
  projectChange() {
    console.log(this.selectedProject);
  }

  dateChanged() {
    console.log('hi');
    // this.frmDate = this.fDate;
  }

  public chartClick(event: any, chartContext: any) {
    console.log(event, chartContext);
  }

  myFunc = function(event, chartContext, config) {
    console.log(event);
    console.log(config.selectedDataPoints[0][0]);
    this.lableVal = config.w.globals.chartID;
    this.chartClick(config.selectedDataPoints[0][0], chartContext);
  };

  setAxisTitle() {
    if (this.plotType === 'horizontal') {
      this.xaxistitle = 'Number of Licenses';
      this.yaxistitle = 'Frequency';
    } else {
      this.xaxistitle = 'Frequency';
      this.yaxistitle = 'Number of Licenses';
    }
  }
}

