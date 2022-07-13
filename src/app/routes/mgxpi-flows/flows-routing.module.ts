import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiFlowsComponent } from './mgxpi-flows.component';

const routes: Routes = [
    { path: '', component: MgxpiFlowsComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class FlowsRoutingModule {}
