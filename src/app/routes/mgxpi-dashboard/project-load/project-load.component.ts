import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';

@Component({
  selector: 'app-project-load',
  templateUrl: './project-load.component.html',
  styleUrls: ['./project-load.component.scss']
})
export class ProjectLoadComponent implements OnInit, AfterViewInit {

  projectLoadGraph: any;

  constructor(private dashboardService: DashboardService,private projectSelection: ProjectSelection) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.projectLoadGraph = new ApexCharts(document.querySelector('#projectLoadChart'), this.dashboardService.loadProjectLoadGraph());
    this.projectLoadGraph.render();
    this.getProjectLoadData(this.projectSelection.projectKey, '10_minute'); // TO DO ganesh pass the actual project name
  }
  load(value: string) {
    this.getProjectLoadData(this.projectSelection.projectKey, value); // TO DO ganesh pass the actual project name
  }

  getProjectLoadDataOnProjectChange() {
    console.log("Pending Graph Called");
    const elementExists = document.getElementById('projectLoadChart');
    if (elementExists) {
      document.getElementById('projectLoadChart').innerHTML = '';
    }
    this.projectLoadGraph = new ApexCharts(document.querySelector('#projectLoadChart'), this.dashboardService.loadProjectLoadGraph());
    this.projectLoadGraph.render();
    this.getProjectLoadData(this.projectSelection.projectKey, '10_minute');
  }

  getProjectLoadData(projectKet: string, type: string) {
    this.dashboardService.getProjectLoadData(projectKet, type).subscribe(data => {
      const timeseries: string[] = data.timeSeries;
      this.projectLoadGraph.updateOptions({
        xaxis: ({
          categories: timeseries
        })
      });
      this.projectLoadGraph.updateSeries([
        {
          name: 'Processed',
          data: data.processed,
        },
        {
          name: 'Arrived',
          data: data.arrived,
        },
        {
          name: 'Pending',
          data: data.pending
        }]
      );
    });
  }

}
