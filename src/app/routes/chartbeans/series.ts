import { Injectable } from '@angular/core';

/*@Injectable({
    providedIn: 'root'
  })*/
export class Series {
    constructor(private name: string, private data: number[], private type?: string) {}

    pushData(data: number) {
      this.data.push(data);
    }
}
