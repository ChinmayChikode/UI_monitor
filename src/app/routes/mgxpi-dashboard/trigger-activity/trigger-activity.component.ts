import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';

@Component({
  selector: 'app-trigger-activity',
  templateUrl: './trigger-activity.component.html',
  styleUrls: ['./trigger-activity.component.scss']
})
export class TriggerActivityComponent implements OnInit, AfterViewInit {

  constructor(private dashboardSrv: DashboardService,private projectSelection: ProjectSelection) { }
  triggerActivityGraph: any;
  triggerActivityData = null;

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.triggerActivityGraph = new ApexCharts(document.querySelector('#triggerActivityGraph'), this.dashboardSrv.loadGraphTriggerConfig());
    this.triggerActivityGraph.render();
    //this.gettriggerActivityData(this.projectSelection.projectKey, '10_minute'); // TO DO ganesh pass the actual project name
  }

  gettriggerActivityData(projectKey: string, type: string) {// TO DO ganesh pass the actual project name
    /*this.dashboardSrv.gettriggerActivityData(this.projectSelection.projectKey, type).subscribe(data => {
      const categories = data.categories;
      const series = data.series;
      this.triggerActivityGraph.updateOptions({
        xaxis: {
          categories
        }
      });
      this.triggerActivityGraph.updateSeries(series);
    });*/
    this.gettriggerActivityData(this.projectSelection.projectKey, '10_minute');
  }

  load(value: string) {
    this.gettriggerActivityData(this.projectSelection.projectKey, value); // TO DO ganesh pass the actual project name
  }


}
