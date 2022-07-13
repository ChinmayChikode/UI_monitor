import { SidenavService } from 'app/services/sidenav.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from '@core';
import { Subject, from, merge, Observable } from 'rxjs';
import { ChatService } from './ChatService';
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';
import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';
import { SharedModule } from '@shared';
import { MatDialog } from '@angular/material';

export interface UserData {
  desc: string;
  severity: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(180deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ],
  providers: [DashboardService,ChatService],
})

export class DashboardComponent implements OnInit, AfterViewInit {

  openedFilterDialog = false;
  dragging = false;

  public feed: Observable<Message[]>;

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };

  private local: Subject<Message> = new Subject<Message>();

  @Input() showToggle = true;
  @Output() toggleRightSide = new EventEmitter<void>();
  flip = 'inactive';
  options = this.settings.getOptions();

  toggleButtonStatus: boolean;
  toggleIconChange: boolean;
  constructor(private sidenavSrv: SidenavService, private spinner: NgxSpinnerService,
              public settings: SettingsService, private svc: ChatService,
              private projectSelection: ProjectSelection,
              public activityLogRefresh: MatDialog, ) {

                const hello: Message = {
                  author: this.bot,
                  suggestedActions: [{
                    type: 'reply',
                    value: 'Activity Log'
                  }, {
                    type: 'reply',
                    value: 'Magic Studio'
                  }],
                  timestamp: new Date(),
                  text: 'Hello,Welcome To Magic XPI,I am your Magic XPI Knowledge Assistant.'
                };

                // Merge local and remote messages into a single stream
                this.feed = merge(
                  from([ hello ]),
                  this.local,
                  this.svc.responses.pipe(
                    map((response): Message => ({
                      author: this.bot,
                      text: response
                    })
                  ))
                ).pipe(
                  // ... and emit an array of all messages
                  scan((acc: Message[], x: Message) => [...acc, x], [])
                );

  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.toggleButtonStatus = this.sidenavSrv.getToggleButtonStatus();
    this.toggleIconChange = this.sidenavSrv.getToggleIconChange();
  }

  clickOnToggle() {
    this.toggleButtonStatus = !this.toggleButtonStatus;
    this.toggleIconChange = !this.toggleIconChange;
    this.sidenavSrv.setToggleButtonStatus(this.toggleButtonStatus);
    this.sidenavSrv.setToggleIconChange(this.toggleIconChange);

  }
  toggleFlip() {
    this.flip = (this.flip === 'inactive') ? 'active' : 'inactive';
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: true
    });

    this.svc.submit(e.message.text);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {
    this.openedFilterDialog = true;
  }

  closePanel() {
    this.openedFilterDialog = false;
  }

  exportPDF(){

    const options = {
      filename : this.projectSelection.projectKey+'_dashboard',
     // image : {type:'jpeg'},
      html2canvas:{width: 900,
        height: 800}
      //jsPDF : {orientation: 'landscape'}

    };

    const content : Element = document.getElementById('download');

    html2pdf().from(content).set(options).save();
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
        
        // clearInterval(this.interval);
        // this.interval = setInterval(() => {
        //   this.getFlowDataByProjectKey(this.http, this.projectSelection.projectKey,
        //     this.projectSelection.projectLocation);
        // },SharedModule.global_interval );
        
      }
      
    })
  }

  onRightClick(){

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


}

