import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MgxpiSubscriptionComponent } from './mgxpi-subscription.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';

@NgModule({
    declarations: [MgxpiSubscriptionComponent],
    imports: [SharedModule, SubscriptionRoutingModule],
    providers: []

})
export class SubscriptionModule {
    constructor() {
        console.log('Lazily Loaded Subscription : LazyModule');
    }
}
