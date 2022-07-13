import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiSummaryComponent } from './mgxpi-summary.component';

const routes: Routes = [
    { path: '', component: MgxpiSummaryComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class SummaryRoutingModule {}
