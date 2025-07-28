import { Routes } from '@angular/router';
import { CheckInOrOutComponent } from './check-in-or-out/check-in-or-out.component';
import { BoatListComponent } from './boat-list/boat-list.component';
import { WhoAreYouComponent } from './who-are-you/who-are-you.component';
import { TellUsWhyComponent } from './tell-us-why/tell-us-why.component';
import { CheckOutCompleteComponent } from './check-out-complete/check-out-complete.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: CheckInOrOutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'check-in-or-out', component: CheckInOrOutComponent },
    { path: 'boat-list', component: BoatListComponent },
    { path: 'who-are-you', component: WhoAreYouComponent },
    { path: 'tell-us-why', component: TellUsWhyComponent },
    { path: 'check-out-complete', component: CheckOutCompleteComponent },
    { path: '**', redirectTo: '' }
];
