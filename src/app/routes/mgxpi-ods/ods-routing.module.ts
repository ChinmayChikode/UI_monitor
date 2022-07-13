import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiOdsComponent } from './mgxpi-ods.component';

const routes: Routes = [
    { path: '', component: MgxpiOdsComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class ODSRoutingModule {}
