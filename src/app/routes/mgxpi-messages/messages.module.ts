import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MessagesRoutingModule } from './messages-routing.module';
import { MgxpiMessagesComponent } from './mgxpi-messages.component';


@NgModule({
    declarations: [MgxpiMessagesComponent],
    imports: [SharedModule, MessagesRoutingModule],
    providers: []

})
export class MessagesModule {
    constructor() {
        console.log('Lazily Loaded Messages : LazyModule');
    }
}
