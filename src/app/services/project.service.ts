import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project';
import { urls } from '@env/accessurls';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjectList(): Observable<Project[]> {
    return this.http.get<Project[]>(urls.SERVER_URL + urls.ProjectsList, { headers: this.getHeader() });
  }

  getHeader() {
    return new HttpHeaders(
      {
        Authorization: 'Basic ' + btoa('admin:admin')
      }
    );
  }
}
