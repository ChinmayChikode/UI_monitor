import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';

export interface activityLogMsgFilter {
  display;
  write;
  messageName;
}

@Injectable()
export class ActivityFiltersService {

  activityLogMsgFilter: any[];
    
  constructor(private http: HttpClient, private projectSelection: ProjectSelection) {}

  getData() {
    return this.http
      .get('assets/UserSettings/ActivityFiltersSettings.json');
  }

}