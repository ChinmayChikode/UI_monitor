import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';

@Component({
  selector: 'app-license-usages',
  templateUrl: './license-usages.component.html',
  styleUrls: ['./license-usages.component.scss']
})
export class LicenseUsagesComponent implements OnInit, AfterViewInit {

  licenseUsageGraph = null;

  constructor(private dashboard: DashboardService,private projectSelection: ProjectSelection) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.licenseUsageGraph = new ApexCharts(document.querySelector('#licenseUsageGraph'), this.dashboard.loadLicenseUsagesGraph());
    this.licenseUsageGraph.render();
    this.getLicenseDetail(this.projectSelection.projectKey, '10_minute'); // TO DO ganesh pass the actual project name
  }
  load(value: string) {
    this.getLicenseDetail(this.projectSelection.projectKey, value); // TO DO ganesh pass the actual project name
  }
  
  getProjectLoadDataOnProjectChange() {
    console.log("License Graph Called");
    document.getElementById('licenseUsageGraph').innerHTML = '';
    this.licenseUsageGraph = new ApexCharts(document.querySelector('#licenseUsageGraph'), this.dashboard.loadLicenseUsagesGraph());
    this.licenseUsageGraph.render();
    this.getLicenseDetail(this.projectSelection.projectKey, '10_minute');
  }

  getLicenseDetail(projectKey: string, type: string) {
    this.dashboard.getLicenseDetail(projectKey, type).subscribe(data => {
      const timeseries: string[] = data.time;
      const license: number[] = data.projectLicense;
      this.licenseUsageGraph.updateOptions({
        xaxis: ({
          categories: timeseries
        })
      });

      this.licenseUsageGraph.updateSeries([
        {
          name: 'License',
          data: license,
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
