import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '@env/accessurls';
import { OdsData } from './ods-data';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class OdsService {

  constructor(private http: HttpClient) { }

  getOdsData(projectKey: string): Observable<OdsData[]> {
    console.log("refreshing..");
    return this.http.get<OdsData[]>(urls.SERVER_URL + urls.ODS + projectKey, { headers: this.getHeader() });
  }


  getOdsChildData(projectKey: string): Observable<OdsData[]> {
      return this.http.get<OdsData[]>(urls.SERVER_URL + urls.ODSChild + projectKey, { headers: this.getHeader() });
  }

  getHeader() {
    return new HttpHeaders(
      {
        Authorization: 'Basic ' + btoa('admin:admin')
      }
    );
  }

  // clearOdsTable(){
  //   this.leng = this.odsData.length;
  // //  console.log("length is "+ this.leng);
  //   this.odsData.splice(0,this.leng);
  //   console.log("clear ODS is being executed");
  // //  this.getOdsData();
  // }
} 

@Component({
  selector: 'app-ods-clear-all',
  templateUrl: './ods-clear-all.component.html',

  providers: [
    //OdsService
    //MgxpiOdsComponent
  ]
})
export class OdsClearAllComponent{
  constructor(public odsComponent: OdsService){}

  ngOnInit(){}

  
  
}
