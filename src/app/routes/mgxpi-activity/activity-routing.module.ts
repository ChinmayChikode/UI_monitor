import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiActivityComponent } from './mgxpi-activity.component';

const routes: Routes = [
    { path: '', component: MgxpiActivityComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class ActivityRoutingModule {}
