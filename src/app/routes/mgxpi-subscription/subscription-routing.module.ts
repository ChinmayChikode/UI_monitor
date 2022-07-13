import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiSubscriptionComponent } from './mgxpi-subscription.component';

const routes: Routes = [
    { path: '', component: MgxpiSubscriptionComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})



export class SubscriptionRoutingModule {}
