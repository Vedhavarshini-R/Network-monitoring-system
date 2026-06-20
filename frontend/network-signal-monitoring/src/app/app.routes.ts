import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './auth.guard';

export const routes: Routes = [

  // 🔐 LOGIN (ENTRY PAGE)
  {
    path: 'login',
    component: LoginComponent
  },

  // 🔐 DEFAULT ROUTE (PROTECTED DASHBOARD)
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // 🔐 PROTECTED ROUTES
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'analysis',
    component: AnalysisComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'activity-logs',
    component: ActivityLogsComponent,
    canActivate: [AuthGuard]
  },

  // ❌ INVALID ROUTE
  {
    path: '**',
    redirectTo: ''
  }

];