import {Component,OnInit} from '@angular/core';
import { ServersService } from './servers.service';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from '@shared/notification.service';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';





@Component({
    selector: 'mgxpi-servers-instances',
    templateUrl: 'mgxpi-servers-instances.html',
     styles: [`
                div.container{
                  margin: 0px 4px;
                }
                .fill-remaining-space{
                  flex: 1 1 auto;
                }
                form.normal-form{
                  margin: 10px;
                }
                .controles-container{
                  width: 100%;
                  padding: 5%;
                }
                .controles-container > *{
                  width:100%;
                }
                .add-bottom-padding{
                  padding-bottom: 10px;
                }
   `            
    ],
   // providers: [HeaderComponent]
})
  export class MgxpiServersInstancesComponent implements OnInit {

    constructor(public service: ServersService,public dialogRef: MatDialogRef<MgxpiServersInstancesComponent>,
      private notificationService: NotificationService,private projectSelection: ProjectSelection) { }

    ngOnInit():void{
           
    }

    onClear() {
      this.service.form.reset();
//      this.service.initializeFormGroup();
    //  this.notificationService.success(':: Submitted Cleared');
    }
  
    onSubmit() {
      console.log("Inside onSubmit1");
      if (this.service.form.valid) {
     //  this.service.form.reset();
 //       this.service.initializeFormGroup();
         console.log("Inside onSubmit2");
        this.service.SaveFormGroup(this.service.form.value,this.projectSelection.projectKey);
        this.notificationService.success(':: Submitted successfully');
        this.onClose();
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onClose() {
      this.service.form.reset();
     // this.service.initializeFormGroup();
      this.dialogRef.close();
    }


    

  }