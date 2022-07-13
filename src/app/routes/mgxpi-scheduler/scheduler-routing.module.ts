import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiSchedulerComponent } from './mgxpi-scheduler.component';

const routes: Routes = [
    { path: '', component: MgxpiSchedulerComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class SchedulerRoutingModule {}
