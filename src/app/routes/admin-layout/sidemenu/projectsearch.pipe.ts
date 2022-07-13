import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProject'
})
export class ProjectSearchPipe implements PipeTransform {

  transform(projectList: any[], project: string, searchProjectString: string): any[] {

    if (!projectList) {
      return [];
    }

    if (!project) {
      return  projectList;
    }

    if (project === '' || projectList == null) {
      return [];
    }

    if(project === 'ALL'){
      return  projectList;
    }

    return projectList.filter(e => e[searchProjectString].search(new RegExp(project, 'i')) !== -1);

  }

}
