import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '@env/accessurls';
import { LicenseSummaryData } from './license-summary-data';
import { LicensePeakData } from './license-peak-data';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LicenseSummaryService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  projectLicenseURI: string;
  getProjectWiseLicenseData(type: string, sDate?: Date, eDate?: Date): Observable<LicenseSummaryData> {
    this.projectLicenseURI = urls.SERVER_URL + urls.PEAKLICENCE + type;
    if (type === 'custom') {
      this.projectLicenseURI = urls.SERVER_URL + urls.LICENSECOUNTBYPROJECTANDDATE;
      this.projectLicenseURI += '?sDate=' + this.datePipe.transform(sDate, 'MM/dd/yyyy') + '&eDate=' + this.datePipe.transform(eDate, 'MM/dd/yyyy');
    }
    console.log(this.projectLicenseURI);
    return this.http.get<LicenseSummaryData>(this.projectLicenseURI, { headers: this.getHeader() });
  }

  getProjectAndPeakLicenseData(projectKey: string, type: string, sDate?: Date, eDate?: Date): Observable<LicensePeakData[]> {
    console.log(type);
    this.projectLicenseURI =  urls.SERVER_URL + urls.LICENSECOUNTBYPROJECTANDPEAK + projectKey +
       '/' + type;
    if (type === 'custom') {
      this.projectLicenseURI =  urls.SERVER_URL + urls.LICENSECOUNTBYPROJECTANDPEAK + projectKey ;
      this.projectLicenseURI += '?sDate=' + this.datePipe.transform(sDate, 'MM/dd/yyyy') + '&eDate=' + this.datePipe.transform(eDate, 'MM/dd/yyyy');
    }
    console.log(this.projectLicenseURI);
    return this.http.get<LicensePeakData[]>(this.projectLicenseURI, { headers: this.getHeader() });
  }

  getDefaultLicenseData(projectKey: string): Observable<LicenseSummaryData> {
    console.log(urls.SERVER_URL + urls.DEFAULTPEAKLICENCE + projectKey);
    return this.http.get<LicenseSummaryData>(urls.SERVER_URL + urls.DEFAULTPEAKLICENCE + projectKey, { headers: this.getHeader() });
  }

  getLicenseData(projectKey: string): Observable<LicenseSummaryData[]> {
    return this.http.get<LicenseSummaryData[]>(urls.SERVER_URL + urls.ODSChild + projectKey, { headers: this.getHeader() });
  }

  getHeader() {
    return new HttpHeaders(
      {
        Authorization: 'Basic ' + btoa('admin:admin')
      }
    );
  }

}
