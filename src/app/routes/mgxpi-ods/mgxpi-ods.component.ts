import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ViewEncapsulation, EventEmitter, Output, Inject } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HeaderComponent } from '../admin-layout/header/header.component';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';
import { OdsData } from './ods-data';
import { OdsClearAllComponent, OdsService } from './ods.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { urls } from '@env/accessurls';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SharedModule } from '@shared';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';

export interface Blob {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-mgxpi-ods',
  templateUrl: './mgxpi-ods.component.html',
  styleUrls: ['./mgxpi-ods.component.scss']
  // ,providers: [
  //  {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  // ],
})

export class MgxpiOdsComponent implements OnInit {

  exportAsConfig: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'dt',
  }

  exportAsConfigChild: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'dc',
  }

  blob: Blob[] = [
    { value: 'txt', viewValue: 'Text' },
    { value: 'xml', viewValue: 'Excel' },
    { value: 'pdf', viewValue: 'PDF' }
  ];

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  odsData: OdsData[] = [];
  odsChildData: OdsData[] = [];
  typeList: any[];
  bloblist: any[];
  //bpList: any[] = [];
  parentUserName: string;
  childTableHeading: string = '';
  userKeyType: any[]=[];
  //automatic_refersh_interval:number=5000;

  topcols = [
    { field: 'userKey', header: 'Name' },
    { field: 'userKeyType', header: 'Type' },
    { field: 'fsId', header: 'FSID' },
    { field: 'odsindex', header: 'Index' }
  ];


  childCols = [
    { field: 'odsindex', header: 'Index' },
    { field: 'userString', header: 'String' },
    { field: 'userNumber', header: 'Number' },
    { field: 'userLogical', header: 'Logical' },
    { field: 'userDateStr', header: 'Date' },
    { field: 'userTime', header: 'Time' },
    { field: 'createTime', header: 'Created' },
    { field: 'modifyTime', header: 'Modified' },
    { field: 'userBlob', header: 'Blob' }
  ];
  userkey: string;
  interval: NodeJS.Timer;
  type: any[] = [];
  leng: any;
  testValue: any;
  usernumber: any;
  ext: any;
  var_cell: string;
  id: any;

  constructor(private sidenavSrv: SidenavService, private odsService: OdsService, private http: HttpClient,
    private projectSelection: ProjectSelection, public dialog: MatDialog,
    private exportAsService: ExportAsService,
    public activityLogRefresh: MatDialog) {
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }


  ngOnInit() {
    this.getOdsData();
      this.interval = setInterval(() => {
      this.getOdsData();
    }, SharedModule.global_interval );

      this.typeList = [
      { label: "ALL", value: null },
      { label: "Global", value: 'Global' },
      { label: "Local", value: 'Local' }
    ]

  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, SharedModule.global_interval);
  }


  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  getOdsData() {
    // TODO ganesh change the hard coded project name
    this.odsService.getOdsData(this.projectSelection.projectKey)
      .subscribe(
        (tokenResponse: any) => {
          this.odsData = tokenResponse.odsData;
          console.log(this.odsData);

          for (const type of tokenResponse.userKeyType) {
              if (type === 'All') {
                this.userKeyType.push({label: type, value: null});
              } 
              else {
                this.userKeyType.push({label: type, value: type});
              }
            }
        }
      );
  }




  getOdsChildData(userKey: string) {
    // this.parentUserName=this.userkey;
    this.childTableHeading = userKey;
    this.odsService.getOdsChildData(userKey)
      .subscribe(data => {
        this.odsChildData = data;

        for (const a of this.odsChildData) {
          const type = a.userLogical;
          if (type == '1')
            a.userLogical = "True";
          else
            a.userLogical = "False";
        }


        console.log(this.odsChildData);
      });
  }

  // getOdsBlob(inputProjectKey: any) {
  //   const tokenHeaders = new HttpHeaders(
  //     {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Basic ' + btoa('admin:admin'),
  //       Accept: 'application/json'
  //     }
  //   );

  //   let params = new HttpParams();
  //   params = params.append('projectKey', inputProjectKey);
  //   params = params.append('ProjectLocation', this.projectSelection.projectLocation);
  //   params = params.append('lblFromDateValue', this.user);
  // }


  //    showBlob(user) {

  //     var encodedStringAtoB = user.userBlob ;
  //     // Decode the String
  //     var decodedStringAtoB = atob(encodedStringAtoB);

  //     const fileURL = URL.createObjectURL(new Blob([decodedStringAtoB], { type: 'application/text', }));

  //     var uri = 'data:text/csv;charset=utf-8,' + decodedStringAtoB;

  //     var downloadLink = document.createElement("a");
  //     downloadLink.href = uri;
  //     downloadLink.download = "ODS_blob.txt";

  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);



  //     console.log(decodedStringAtoB);

  //     console.log(fileURL);
  // }

  downloadFile(userNumber: any) {

    console.log("Call in display blob...");
    this.usernumber = userNumber;
    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin'),
        Accept: 'application/json'
      }
    );

    let params = new HttpParams();
    params = params.append('projectKey', this.projectSelection.projectKey);
    params = params.append('usernumber', this.usernumber);
    //params = params.append('blobformat', this.format);

    this.ext = '.txt';

    this.http.get<any>(urls.SERVER_URL + urls.odsblob, { headers: tokenHeaders, params })
      .subscribe((tokenResponse: any) => {
        console.log("call complete ");

      });

    window.open("http://localhost:8083/xpi/" + this.usernumber + this.ext, "_blank", 'height=250,width=600,top=150,left=180,scrollbars=yes,status=yes');

  }


  clearAll() {

    const dialogref = this.dialog.open(OdsClearAllComponent);
    // {data:{ refresh_interval:5000}});

    dialogref.afterClosed().subscribe(result => {
      this.testValue = result;
      console.log(this.testValue);

      if (this.testValue == true) {
        this.clearOdsTable();
        console.log("test value true");
      }
    });

    //this.getOdsData();
  }

  refresh(){
    let dialogref = this.activityLogRefresh.open(RefreshTableComponent,{
      data:{ refresh_interval:SharedModule.global_interval/1000}
    });

    dialogref.afterClosed().subscribe(result=>{

      console.log("activity compoenent received data "+result.data_interval);
      // console.log("activity compoenent received data "+typeof(result.data_interval)); 
      if(result.data_interval){
        SharedModule.global_interval = result.data_interval*1000
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.odsService.getOdsData(this.projectSelection.projectKey); 
        },SharedModule.global_interval );
        
      }
      
    })
  }


  clearOdsTable() {
    this.leng = this.odsData.length;
    //  console.log("length is "+ this.leng);
    this.odsData.splice(0, this.leng);
    console.log("clear ODS is being executed");
    this.getOdsData();
  }

  // RefreshInterval()
  // {
  //   let dialogref = this.dialog.open(MgxpiODSRefreshComponent,{
  //     data:{ refresh_interval:this.automatic_refersh_interval/1000}
  //   });

  //   dialogref.afterClosed().subscribe(result=>{

  //     console.log("ods component received refresh interval "+result.data_interval);
  //     // console.log("activity compoenent received data "+typeof(result.data_interval)); 

  //     if(result.data_interval){
  //       this.automatic_refersh_interval = result.data_interval*1000;
  //       clearInterval(this.interval);
  //       this.checkvalue('A');
  //     }

  //   })
  // }

//   checkvalue(event: any){
//     if(event=='A'){
//       console.log("event a is executing");
//       this.interval = setInterval(() => {
//         this.odsService.getOdsData(this.projectSelection.projectKey);
//       }, this.automatic_refersh_interval);

//     }
//     else{
//       console.log("event b is executing");
//       clearInterval(this.interval);
//       this.odsService.getOdsData(this.projectSelection.projectKey);
//     }
//  }

  exportexcel(): void {
    console.log("excel exportation");
    /* pass here the table id */
    let element = document.getElementById(this.id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.projectSelection.projectKey + '_odsData.xlsx');


  }

  exportPDF() {

    const options = {
      filename: this.projectSelection.projectKey + '_odsData',  //project key is required to be passed
      // image : {type:'jpeg'},
      html2canvas: {}
      //jsPDF : {orientation: 'landscape'}

    };

    const content: Element = document.getElementById(this.id);

    html2pdf().from(content).set(options).save();
  }

  
  exportPNG() {

    if(this.id=='dt'){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey + "_odsData").subscribe(() => {
      // save started
    });
  }
  else{
    this.exportAsService.save(this.exportAsConfigChild, this.projectSelection.projectKey + "_odsChildData").subscribe(() => {
      // save started
    });

  }

  }

  onRightClick(var_cell: any,id:any) {


    console.log(var_cell);
    this.var_cell = var_cell;
    this.id = id;
    window.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      let contextElement = document.getElementById("context-menu");
      contextElement.style.top = event.clientY + "px";
      contextElement.style.left = event.clientX + "px";
      contextElement.classList.add("active");
    });
    window.addEventListener("click", function () {
      document.getElementById("context-menu").classList.remove("active");
    });
    console.log("right click has been executed and returning false");


  }
  

  copy_cell_value() {

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.var_cell;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }

}
