import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiTriggersComponent } from './mgxpi-triggers.component';

const routes: Routes = [
    { path: '', component: MgxpiTriggersComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class TriggersRoutingModule {}
