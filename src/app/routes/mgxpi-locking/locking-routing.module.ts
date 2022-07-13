import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiLockingComponent } from './mgxpi-locking.component';

const routes: Routes = [
    { path: '', component: MgxpiLockingComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class LockingRoutingModule {}
