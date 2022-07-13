import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { OdsData } from './ods-data';
import { OdsService } from './ods.service';

@Component({
  selector: 'app-mgxpi-ods',
  templateUrl: './mgxpi-ods.component.html',
  styleUrls: ['./mgxpi-ods.component.scss']
})
export class MgxpiOdsComponent implements OnInit {

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  odsData: OdsData[] = [];
  odsChildData: OdsData[] = [];
  topcols = [
    { field: 'userKey', header: 'Name' },
    { field: 'global', header: 'Type' },
    { field: 'fsId', header: 'FSID' },
    { field: 'odsindex', header: 'Index' }
  ];
  childCols = [
    { field: 'odsindex', header: 'Index' },
    { field: 'userString', header: 'String' },
    { field: 'userNumber', header: 'Number' },
    { field: 'userLogical', header: 'Logical' },
    { field: 'userDate', header: 'Date' },
    { field: 'userTime', header: 'Time' },
    { field: 'createDate', header: 'Created' },
    { field: 'modifyDate', header: 'Modified' },
    { field: 'userBlob', header: 'Blob' }
  ];

  constructor(private sidenavSrv: SidenavService, private odsService: OdsService) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  ngOnInit() {
    this.getOdsData();
  }

  clickOnToggle(){
    this.toggleButtonStatus = !this.toggleButtonStatus;   
    this.toggleIconChange = !this.toggleIconChange;    
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getOdsData() {
    // TODO ganesh change the hard coded project name
    this.odsService.getOdsData('ODSClear_prob').subscribe(data => {
      this.odsData = data;
    });
  }
  getOdsChildData(userKey: string) {
    this.odsService.getOdsChildData(userKey).subscribe(data => {
      this.odsChildData = data;
    });
  }
  showBlob(user) {
    const fileURL = URL.createObjectURL(new Blob([atob(user.userBlob)], { type: 'application/text', }));
    window.open(fileURL);
  }

}
