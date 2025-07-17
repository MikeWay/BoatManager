import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StateService } from './state-service';
import { AppState } from './app-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {

  private currentPage: string = 'check-in-or-out';
  private currentState: AppState | undefined;

  // Note: these transtion names MUST match the route names in app.routes.ts
  private pageTransitionsCheckOut: { [key: string]: string } = {
    'check-in-or-out': 'boat-list',
    'boat-list': 'whoAreYou',
    'whoAreYou': 'reasonForCheckout',
    'reasonForCheckout': 'checkedOut'
  };

  private pageTransitionsCheckIn: { [key: string]: string } = {
    'check-in-or-out': 'startCheckIn',
    'startCheckIn': 'recordEngineHours',
    'recordEngineHours': 'areThereDefects',
    'areThereDefects': 'reportFault',
    'reportFault': 'checkInComplete',
    'checkInComplete': 'page1'
  };

  title = 'BoatManager';

  constructor(private router: Router, private stateService: StateService) { }
  ngOnDestroy(): void {
    // Cleanup logic if needed
    console.log('AppComponent destroyed');
    // this.stateService.currentState.unsubscribe(); -- Uncomment if you need to unsubscribe from the state service
    // Note: BehaviorSubject does not require manual unsubscription, but if you have other subscriptions
  }
    

  ngOnInit(): void {
    // Initialize the state service or any other necessary setup
    this.stateService.currentState.subscribe(state => {
      // Handle state changes if needed
      console.log('Current state:', state);
      this.currentState = state;
    });
  }
   

  onNextClick(): void {
    // Handle Next button click logic here
    console.log('Next button clicked');
    const transitions = this.currentState?.checkOutInProgress ? this.pageTransitionsCheckOut : this.pageTransitionsCheckIn;
    // route to 'next' page
    this.currentPage = transitions[this.currentPage] || 'check-in-or-out';  
    this.router.navigate([`/${this.currentPage}`]);
  }

  onPreviousClick(): void {
    // Handle Previous button click logic here
    console.log('Previous button clicked');
    const transitions = this.currentState?.checkOutInProgress ? this.pageTransitionsCheckOut : this.pageTransitionsCheckIn;
    // route to 'previous' page
    const previousPage = Object.keys(transitions).find(key => transitions[key] === this.currentPage);
    this.currentPage = previousPage || 'check-in-or-out';
    this.router.navigate([`/${this.currentPage}`]);
  }
}
