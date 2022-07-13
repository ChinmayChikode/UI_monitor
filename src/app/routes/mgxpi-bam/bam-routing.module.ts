import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiBamComponent } from './mgxpi-bam.component';

const routes: Routes = [
    { path: '', component: MgxpiBamComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class BAMRoutingModule {}
