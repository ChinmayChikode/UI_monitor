import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MgxpiSchedulerComponent } from './mgxpi-scheduler.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { DateformatPipe } from './dateformat.pipe';
//import { DateformatPipe } from './dateformat.pipe';
//import { MypipePipe } from './mypipe.pipe';

@NgModule({
    declarations: [MgxpiSchedulerComponent, DateformatPipe],
    imports: [SharedModule, SchedulerRoutingModule],
    providers: []

})
export class SchedulerModule {
    constructor() {
        console.log('Lazily Loaded Scheduler : LazyModule');
    }
}
