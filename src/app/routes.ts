import { Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { AvailabilityFormComponent } from './availability-form/availability-form.component';
import {ShifttableComponent} from "./shifttable/shifttable.component";
import {SplashScreenComponent} from "./splash-screen/splash-screen.component";

export const routes: Routes = [
  { path: 'shift-plan', component: ShifttableComponent },
  { path: 'member-list', component: MemberListComponent },
  { path: 'availability-form', component: AvailabilityFormComponent },
  { path: '', redirectTo: '/shift-plan', pathMatch: 'full' },
];
