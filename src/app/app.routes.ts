import { Routes } from '@angular/router';
import { CheckInOrOutComponent } from './check-in-or-out/check-in-or-out.component';
import { BoatListComponent } from './boat-list/boat-list.component';

export const routes: Routes = [
    { path: '', component: CheckInOrOutComponent },
    { path: 'check-in-or-out', component: CheckInOrOutComponent },
    { path: 'boat-list', component: BoatListComponent },
    { path: '**', redirectTo: '' }
];
