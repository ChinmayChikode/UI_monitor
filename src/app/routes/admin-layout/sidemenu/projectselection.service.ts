import { Injectable, EventEmitter } from '@angular/core';
import { ProjectsList } from './sidemenu.component';


@Injectable({
  providedIn: 'root'
})
export class ProjectSelection {

  $projectKey = new EventEmitter();
  $projectLocation = new EventEmitter();
  $projectStartedSince = new EventEmitter();

  $projectStatus = new EventEmitter();
  $searchProjectQuery = new EventEmitter();

  projectKey: any;
  projectLocation: any;
  projectStartedSince: any;

  projectStatus: any;
  searchProjectQuery: any;

  constructor() { }

  getProjectKey(project: any) {

    this.projectKey = project.projectKey;
    this.projectLocation = project.projectLocation;
    this.projectStartedSince = project.uptime;

    console.log('Emmiter : ' + project.projectLocation);

    this.$projectKey.emit(this.projectKey);
    this.$projectLocation.emit(this.projectLocation);
    this.$projectStartedSince.emit(this.projectStartedSince);

  }

  getProjectFilter(searchProjectQuery: any) {
    if (searchProjectQuery === 'RUNNING' || searchProjectQuery === 'STOPPED' || searchProjectQuery ==='ALL'){
      this.projectStatus = searchProjectQuery;
      this.$projectStatus.emit(this.projectStatus);
    } else {
      this.searchProjectQuery = searchProjectQuery;
      this.$searchProjectQuery.emit(this.searchProjectQuery);
    }
  }

}
