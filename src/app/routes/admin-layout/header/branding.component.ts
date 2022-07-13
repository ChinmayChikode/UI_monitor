import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@core/services/settings.service';
import { ProjectSelection } from '../sidemenu/projectselection.service';

@Component({
  selector: 'app-branding',
  template: `
    <div style="background-color: #bdd4e7 !important;background-image: linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%) !important;height: 35px;">
    <a class="matero-branding" href="#/">
      <span class="matero-branding-name f-s-18" style="color:black;">Magic Monitor</span>
      <img src="./assets/images/MSE_Company_Logo.png" class="matero-branding-logo-expanded" alt="logo" />
    </a>
    </div>
    <div style="margin-top: 0px;width: 123% !important;border-top: 2px solid rgba(0, 0, 0, 0.12);margin-left: -10px;">
    <!--<div style="margin-left: 0.1em;">import { style } from '@angular/animations';

      <label class="status">Status</label>
      <label class="project-name">Project Name</label>
      <label class="action">Action</label>
    </div> -->
    </div>
    <div [ngClass]="options.dir === 'ltr' ? 'searchtext-ltr' : 'searchtext-rtl'">
      <p-dropdown appendTo="body" [matTooltipClass]="{ 'tool-tip': true }" matTooltip="Filter Running/Stopped Projects..." [options]="statuses" [(ngModel)]="projectStatus" (onChange)="projectSelection.getProjectFilter(projectStatus)">
        <ng-template let-item pTemplate="selectedItem" style="padding: 0px;">
            <img src="assets/images/{{item.label}}.png" style="width:15px;vertical-align:middle" />
        </ng-template>
        <ng-template let-car pTemplate="item" style="padding: 0px;">
            <div class="ui-helper-clearfix" style="position: relative;height: 15px;">
                <img src="assets/images/{{car.label}}.png" style="width:15px;position:absolute;top:1px;left:5px"/>
            </div>
        </ng-template>
      </p-dropdown>
      <input type="text" [matTooltipClass]="{ 'tool-tip': true }" matTooltip="Search Projects..." style="font-size: 14px;height: 27px;margin-top: 5px;width: 82%;" 
            (input)="projectSelection.getProjectFilter($event.target.value)"
            placeholder="Search Projects...">
      </div>
  `,
  styles: [ 'label{ padding: 0px;}' ],
})
export class BrandingComponent {

  statuses: any[];
  searchProjectQuery: any;
  projectStatus = '';

  options = this.settings.getOptions();

  constructor(public projectSelection: ProjectSelection,private settings: SettingsService) {
    this.statuses = [
      { label: 'projects-all', value: 'ALL' },
      { label: 'project-stopped', value: 'STOPPED' },
      { label: 'project-running', value: 'RUNNING' }
    ];
  }
}
