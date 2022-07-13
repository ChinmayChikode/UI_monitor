import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '@env/accessurls';
import { OdsData } from './ods-data';

@Injectable({
  providedIn: 'root'
})
export class OdsService {

  constructor(private http: HttpClient) { }

  getOdsData(projectKey: string): Observable<OdsData[]> {
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
} 