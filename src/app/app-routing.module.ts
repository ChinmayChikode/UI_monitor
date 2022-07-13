import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './routes/admin-layout/admin-layout.component';
import { DashboardComponent } from './routes/mgxpi-dashboard/dashboard.component';
import { MgxpiLoginComponent } from './routes/mgxpi-login/mgxpi-login.component';

const routes: Routes = [
  {
    path: 'login',
    component: MgxpiLoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
    { path: '', redirectTo: 'xpi/dashboard', pathMatch: 'full'},
    {
      path: 'xpi/dashboard',
      component: DashboardComponent
    },
    {
      path: 'xpi/messages',
      //component: MgxpiMessagesComponent,
      loadChildren: () => import('./routes/mgxpi-messages/messages.module').then(m => m.MessagesModule)
    },
    {
      path: 'xpi/flows',
      //component: MgxpiFlowsComponent,
      loadChildren: () => import('./routes/mgxpi-flows/flows.module').then(m => m.FlowsModule)
    },
    {
      path: 'xpi/triggers',
      //component: MgxpiTriggersComponent,
      loadChildren: () => import('./routes/mgxpi-triggers/triggers.module').then(m => m.TriggersModule)
    },
    {
      path: 'xpi/servers',
      //component: MgxpiServersComponent,
      loadChildren: () => import('./routes/mgxpi-servers/servers.module').then(m => m.ServersModule)
    },
    {
      path: 'xpi/activity',
      //component: MgxpiActivityComponent,
      loadChildren: () => import('./routes/mgxpi-activity/activity.module').then(m => m.ActivityModule)
    },
    {
      path: 'xpi/ods',
      //component: MgxpiOdsComponent,
      loadChildren: () => import('./routes/mgxpi-ods/ods.module').then(m => m.ODSModule)
    },
    {
      path: 'xpi/bam',
      //component: MgxpiBamComponent,
      loadChildren: () => import('./routes/mgxpi-bam/bam.module').then(m => m.BAMModule)
    },
    {
      path: 'xpi/locking',
      //component: MgxpiLockingComponent,
      loadChildren: () => import('./routes/mgxpi-locking/locking.module').then(m => m.LockingModule)
    },
    {
      path: 'xpi/subscription',
      //component: MgxpiSubscriptionComponent,
      loadChildren: () => import('./routes/mgxpi-subscription/subscription.module').then(m => m.SubscriptionModule)
    },
    {
      path: 'xpi/scheduler',
      //component: MgxpiSchedulerComponent,
      loadChildren: () => import('./routes/mgxpi-scheduler/scheduler.module').then(m => m.SchedulerModule)
    },
    {
      path: 'xpi/summary',
      //component: MgxpiSummaryComponent,
      loadChildren: () => import('./routes/mgxpi-summary/summary.module').then(m => m.SummaryModule)
    },
    ]
  },
  {
    path: '**',
    redirectTo: 'xpi/dashboard'
  },
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
