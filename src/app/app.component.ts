import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StateService } from './state-service';
import { AppState } from './app-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {

  private currentPage: string = 'check-in-or-out'; // The current page in the state machine
  public currentState: AppState | undefined;

  // Note: these transtion names MUST match the route names in app.routes.ts
  private pageTransitionsCheckOut: { [key: string]: string } = {
    'check-in-or-out': 'boat-list',
    'boat-list': 'who-are-you',
    'who-are-you': 'tell-us-why',
    'tell-us-why': 'check-out-complete',
    'check-out-complete': 'check-in-or-out'
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
      enableNextPrev(state)
    });
    // observe changes to the router URL  
    this.router.events.subscribe(() => {
      // Update the current page based on the router URL
      this.currentPage = this.router.url.replace('/', '') || 'check-in-or-out';
      console.log('Current page:', this.currentPage);
      enableNextPrev(this.currentState!);
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

  onHomeClick(): void {
    // Navigate to the home page
    console.log('Home button clicked');
    this.currentPage = 'check-in-or-out';

    this.router.navigate(['/check-in-or-out']);
  }
}
function enableNextPrev(state: AppState) {
  console.log('Enabling Next/Previous buttons based on state:', state);
  if(state.enableNextButton) {
    document.querySelector('button[mat-button="elevated"]:last-of-type')?.removeAttribute('disabled');
  }
  else {
    document.querySelector('button[mat-button="elevated"]:last-of-type')?.setAttribute('disabled', 'true');
  }
  if(state.enablePreviousButton) {
    document.querySelector('button[mat-button="elevated"]:first-of-type')?.removeAttribute('disabled');
  }
  else {
    document.querySelector('button[mat-button="elevated"]:first-of-type')?.setAttribute('disabled', 'true');
  }
}

