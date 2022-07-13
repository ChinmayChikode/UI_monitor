import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ProjectSelection } from 'app/routes/admin-layout/sidemenu/projectselection.service';
import { SharedModule } from '@shared';


@Component({
  selector: 'app-trigger-activity',
  templateUrl: './trigger-activity.component.html',
  styleUrls: ['./trigger-activity.component.scss']
})

export class TriggerActivityComponent implements OnInit, AfterViewInit, OnDestroy {

  interval: any;
  array_category = [];
  array_count = [];

  constructor(private dashboardSrv: DashboardService,private projectSelection: ProjectSelection) { }
  triggerActivityGraph: any;
 // triggerActivityData = null;

  ngOnInit() {
    this.triggerActivityGraph = new ApexCharts(document.querySelector('#triggerActivityGraph'), this.dashboardSrv.loadGraphTriggerConfig());
    this.triggerActivityGraph.render();
    this.load( '10_minute');
    
  }


  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    // this.triggerActivityGraph = new ApexCharts(document.querySelector('#triggerActivityGraph'), this.dashboardSrv.loadGraphTriggerConfig());
    // this.triggerActivityGraph.render();
   
    // this.gettriggerActivityData(this.projectSelection.projectKey, '3_DAY');
    // this.gettriggerActivityData(this.projectSelection.projectKey, '10_MINUTE');
    // this.gettriggerActivityData(this.projectSelection.projectKey, '30_MINUTE'); // TO DO ganesh pass the actual project name
  }

  gettriggerActivityData(project_Key: string, type: string) {
          
        this.dashboardSrv.gettriggerActivityData(project_Key,type).subscribe(data=>{

          const categories =data.categories;
          const series = data.series;
          // console.log(data);
          // console.log(data.series);
          // console.log(data.categories[0]);
          // console.log(data.categories[1]);
          // console.log(series[0].data[0]);
          // console.log(series[1].data[0]);
          //0: {name: "Scheduler Utility", data: Array(1)}
            // 1: {name: "HTTP_1_2_7", data: Array(1)}
            // length: 2
            // __proto__: Array(0)
         //  this.triggerActivityGraph.updateSeries(categories);

            for (let index = 0; index < data.categories.length; index++) {
                this.array_category[index] = data.categories[index];
                
            }

            for (let index = 0; index < series.length; index++) {
              this.array_count[index] =series[index].data[0];
              
            }
          this.triggerActivityGraph.updateOptions({

            xaxis: {
              categories: this.array_category
            },
            series: [
              {
                name: 'Total Count',
                data: this.array_count
              }
            ]
          });

        });
      

  }

  load(value: string) {
    
    clearInterval(this.interval);
    this.gettriggerActivityData(this.projectSelection.projectKey, value);
    this.interval = setInterval(() => {
      this.gettriggerActivityData(this.projectSelection.projectKey, value);
    }, SharedModule.global_interval);
    
  }


}
