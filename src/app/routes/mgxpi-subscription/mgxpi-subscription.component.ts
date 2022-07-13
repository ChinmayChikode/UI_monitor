import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SidenavService } from 'app/services/sidenav.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
import { ProjectSelection } from './../admin-layout/sidemenu/projectselection.service';
import { HeaderComponent } from './../admin-layout/header/header.component';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';


export interface PSSData {
  pssName;
  bpId;
  bpname;
  flowId;
  flowname;
  oneTime;
}

@Component({
  selector: 'app-mgxpi-subscription',
  templateUrl: './mgxpi-subscription.component.html',
  styleUrls: ['./mgxpi-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderComponent]
})
export class MgxpiSubscriptionComponent implements OnInit, AfterViewInit {

  exportAsConfig: ExportAsConfig = {
    type: 'png', 
    elementIdOrContent: 'dt', 
  }

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;

  pssdata: PSSData[];
  cols: any[];
  interval:any;
  flows1: any;
  flows2: any;
  leng: any;
  var_cell: string;

  constructor(private sidenavSrv: SidenavService, private http: HttpClient, public headerSrv: HeaderComponent,
    private projectSelection: ProjectSelection,
    private exportAsService: ExportAsService) { 
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }


  ngOnInit() {
    this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);
    // this.interval = setInterval(() =>{
    //   this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey,
    //     this.projectSelection.projectLocation);
    //   }, 5000);
      
      // this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
      //           this.projectSelection.projectLocation);

      this.cols = [
        { field: 'pssName', header: 'Event Name' },
        { field: 'bpId', header: 'BPID' },
        { field: 'bpName', header: 'BP Name' },
        { field: 'flowId', header: 'Flow ID' },
        { field: 'flowName', header: 'Flow Name' },
        { field: 'oneTime', header: 'Once ?' },
    ];

  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined){
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }
  
  clickOnToggle(){
    this.toggleButtonStatus = !this.toggleButtonStatus;   
    this.toggleIconChange = !this.toggleIconChange;    
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);
  }

  // ClearPanel(){
  //   $("#DataTable").remove(); 
  // }

  ClearPanel(){

    this.leng = this.pssdata.length;
  //  console.log("length is "+ this.leng);
    this.pssdata.splice(0,this.leng);
    this.getServersDataByProjectKey(this.http, this.projectSelection.projectKey,
      this.projectSelection.projectLocation);

  }

  getServersDataByProjectKey(http: any,inputProjectKey: any, projectLocation: any) {

    var projectKey = inputProjectKey;

    const tokenHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa("admin:admin"),
        'Accept': 'application/json'
      }
    );

    
    let params = new HttpParams();
    params = params.append('projectKey', inputProjectKey);
    params = params.append('projectLocation', projectLocation);

    console.log("project location is"+params);

    http.get(urls.SERVER_URL + urls.Subscription, { headers: tokenHeaders ,  params})
        .subscribe(
          (tokenResponse: any) => {
            this.pssdata = tokenResponse;
            console.log(this.pssdata);
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );
  }

  exportexcel(): void
  {
    console.log("excel exportation");
    
    let element = document.getElementById('dt');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
     
    XLSX.writeFile(wb, this.projectSelection.projectKey+'_subscriptionData.xlsx');
    
 
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_subscriptionData',  //project key is required to be passed
     // image : {type:'jpeg'},
      html2canvas:{width: 1130,
      height: 800},
      jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('dt');

    html2pdf().from(content).set(options).save();
  }

  exportPNG(){
    this.exportAsService.save(this.exportAsConfig, this.projectSelection.projectKey+"_subscriptionData").subscribe(() => {
      // save started
    });
    
  }

  onRightClick(var_cell:any){

    
    console.log(var_cell);
    this.var_cell = var_cell;
    window.addEventListener("contextmenu",function(event){
      event.preventDefault();
      let contextElement = document.getElementById("context-menu");
      contextElement.style.top = event.clientY + "px";
      contextElement.style.left = event.clientX + "px";
      contextElement.classList.add("active");
    });
    window.addEventListener("click",function(){
      document.getElementById("context-menu").classList.remove("active");
    });
    console.log("right click has been executed and returning false");

    
  }

  copy_cell_value(){

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