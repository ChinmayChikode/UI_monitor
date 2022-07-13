import { Injectable } from '@angular/core';

/*@Injectable({
    providedIn: 'root'
  })*/
export class ChartDetails {
    constructor(private id: string, private height: number, private type: string, private events?: any) {}
}
