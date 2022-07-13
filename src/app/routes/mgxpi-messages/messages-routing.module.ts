import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgxpiMessagesComponent } from './mgxpi-messages.component';

const routes: Routes = [
    { path: '', component: MgxpiMessagesComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})


export class MessagesRoutingModule {}
