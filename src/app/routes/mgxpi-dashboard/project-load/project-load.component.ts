import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';
import { SharedModule } from '@shared';


@Component({
  selector: 'app-project-load',
  templateUrl: './project-load.component.html',
  styleUrls: ['./project-load.component.scss']
})
export class ProjectLoadComponent implements OnInit, AfterViewInit,OnDestroy {

  projectLoadGraph: any;
  interval: any;
  timer: any;
  flag = false;
 

  constructor(private dashboardService: DashboardService,private projectSelection: ProjectSelection) { }

  ngOnInit() {
    this.projectLoadGraph = new ApexCharts(document.querySelector('#projectLoadChart'), this.dashboardService.loadProjectLoadGraph());
    this.projectLoadGraph.render();
    this.getProjectLoadData(this.projectSelection.projectKey, '10_minute');
    this.load('10_minute');
    // this.getProjectLoadData(this.projectSelection.projectKey, '30_minute');
    // this.interval = setInterval(() => {
    //     this.getProjectLoadData(this.projectSelection.projectKey, '30_minute');
    //   }, 5000);
  }

  ngAfterViewInit() {
     // TO DO ganesh pass the actual project name
  }

  load(value: string) {
    
    clearInterval(this.interval);
    this.getProjectLoadData(this.projectSelection.projectKey, value);
    this.interval = setInterval(() => {
        this.getProjectLoadData(this.projectSelection.projectKey, value);
      }, SharedModule.global_interval);
   // this.getProjectLoadData(this.projectSelection.projectKey, value);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  // getProjectLoadDataOnProjectChange() {
  //   console.log("Pending Graph Called");
  //   const elementExists = document.getElementById('projectLoadChart');
  //   if (elementExists) {
  //     document.getElementById('projectLoadChart').innerHTML = '';
  //   }
  //   this.projectLoadGraph = new ApexCharts(document.querySelector('#projectLoadChart'), this.dashboardService.loadProjectLoadGraph());
  //   this.projectLoadGraph.render();
  //   this.load('30_minute');
  // }

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
