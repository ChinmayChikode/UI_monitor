import { Series } from './series';
import { ChartDetails } from './chartdetails';
import { Injectable } from '@angular/core';
/*@Injectable({
    providedIn: 'root'
  })*/
export class ChartOptionsBean {
    constructor(public series: Series[], public chart: ChartDetails, public title: {text: string}, public xaxis: any,        public yaxis?: {title: {text: string}, min: number, decimalsInFloat?: number}) {}

}
