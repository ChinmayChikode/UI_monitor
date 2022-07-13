import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';
import { SharedModule } from '@shared';

@Component({
  selector: 'app-license-usages',
  templateUrl: './license-usages.component.html',
  styleUrls: ['./license-usages.component.scss']
})
export class LicenseUsagesComponent implements OnInit, AfterViewInit,OnDestroy {

  licenseUsageGraph = null;
  interval: any;

  constructor(private dashboard: DashboardService,private projectSelection: ProjectSelection) { }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.licenseUsageGraph = new ApexCharts(document.querySelector('#licenseUsageGraph'), this.dashboard.loadLicenseUsagesGraph());
    this.licenseUsageGraph.render();
    // clearInterval(this.interval);
    //   this.interval = setInterval(() => {
    //     this.getLicenseDetail(this.projectSelection.projectKey, '10_minute');
    //   }, 5000);
    this.load('10_minute');
     
  }
  load(value: string) {
    this.getLicenseDetail(this.projectSelection.projectKey, value);
    clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.getLicenseDetail(this.projectSelection.projectKey, value);
      }, SharedModule.global_interval);
  }
  
  getProjectLoadDataOnProjectChange() {
    console.log("License Graph Called");
    document.getElementById('licenseUsageGraph').innerHTML = '';
    this.licenseUsageGraph = new ApexCharts(document.querySelector('#licenseUsageGraph'), this.dashboard.loadLicenseUsagesGraph());
    this.licenseUsageGraph.render();
    // this.getLicenseDetail(this.projectSelection.projectKey, '10_minute');
    // clearInterval(this.interval);
    //   this.interval = setInterval(() => {
    //     this.getLicenseDetail(this.projectSelection.projectKey, '10_minute');
    //   }, 5000);
    this.load('10_minute');
  }

  getLicenseDetail(projectKey: string, type: string) {
    this.dashboard.getLicenseDetail(projectKey, type).subscribe(data => {
      const timeseries: string[] = data.time;
      const license: number[] = data.projectLicense;
      const processes: number[] = data.worker;
      // console.log(processes);
      // console.log(data);
      this.licenseUsageGraph.updateOptions({
        xaxis: ({
          categories: timeseries
        }),
        yaxis: ({
          
          title: {
            text: 'running processes'
          },
        })
      });

      this.licenseUsageGraph.updateSeries([
        
        {
          name: 'License',
          data: license,
        },
        {
          name: 'Workers',
          data: processes,
        }
        // ,
        // {
        //   name: 'Arrived',
        //   data: data.arrived,
        // }
      ]);
    });
  }

}
