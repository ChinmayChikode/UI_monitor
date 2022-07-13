import { Injectable } from '@angular/core';
import { Series } from './series';
import { ChartDetails } from './chartdetails';
import { ChartOptionsBean } from './chart-options-bean';

@Injectable({
  providedIn: 'root'
})
export class PrepaireChartBeanService {
  chartOptions: ChartOptionsBean;
  constructor() { }

  getChartBean(series: Series[], chart: ChartDetails, title: string, categories: string[]) {

   this.chartOptions = new ChartOptionsBean(series, chart, {text: title}, {
      categories
   });

   return this.chartOptions;
  }
}
