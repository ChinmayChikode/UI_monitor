import { Injectable } from '@angular/core';
import { ChartOptionsBean } from './chart-options-bean';
import { Series } from './series';
import { ChartDetails } from './chartdetails';

@Injectable({
  providedIn: 'root'
})
export class MgxpiApexChartService {
  chartOptions: ChartOptionsBean;

  constructor() { }

  getChartBean(series: Series[], chart: ChartDetails, title: string, categories: string[], yaxisTitle: string, xaxisTitle: string) {

   this.chartOptions = new ChartOptionsBean(series, chart, {text: title}, {
    categories,
    title: { text: xaxisTitle },
   }, {title: {text: yaxisTitle}, min: 0, decimalsInFloat: 0});

   return this.chartOptions;
  }

  updateCategories(chartId: string, categories: string[]) {
    ApexCharts.exec(chartId, 'updateOptions', {
      xaxis: {
        categories
      }
    }, false, true);
  }

  updateData(chartId: string, data: {data: number[]}[]) {
    ApexCharts.exec('mychart', 'updateSeries', data, true);
  }

  updateSeries(chart: any, data: {data: number[]}[]) {
    return chart.appendData(data);
  }

  appendSeries(chart: any, data: {data: number[]}[]) {
    return chart.appendData(data);
  }

  loadChart(element: any, chartOptions: any) {
    const achart = new ApexCharts(element, chartOptions);
    achart.render();
    return achart;
  }

  setHorizontal(chartOption: any, isHorizontal: boolean) {
    chartOption.plotOptions = {bar: {
      horizontal: isHorizontal,
      columnWidth: '45%',
    }};
  }
}
