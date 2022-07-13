import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiServersComponent } from './mgxpi-servers.component';

const routes: Routes = [
    { path: '', component: MgxpiServersComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class ServersRoutingModule {}
