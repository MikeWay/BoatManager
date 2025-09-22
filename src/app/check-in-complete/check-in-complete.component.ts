import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { Router } from '@angular/router';
import { AuthenticationException, ServerService } from '../server.service';
import { StateService } from '../state-service';

@Component({
  selector: 'app-check-in-complete',
  imports: [MatCardModule],
  templateUrl: './check-in-complete.component.html',
  styleUrl: './check-in-complete.component.sass'
})
export class CheckInCompleteComponent implements OnInit {
  constructor(private stateService: StateService, private server: ServerService, private router: Router) { }

  ngOnInit(): void {
    // Perform any initialization logic here
    console.log('CheckInCompleteComponent initialized');
    this.stateService.currentState.subscribe(async (currentState) => {
      currentState.enableNextButton = false;


      try {
        // Do the actual check-in
        if (currentState.currentBoat && currentState.currentBoat.checkedOutTo) {
          const success = await this.server.checkInBoat(currentState.currentBoat, currentState.currentBoat.checkedOutTo, 
              currentState.defects,  
              currentState.engineHours, currentState.returnedKey, currentState.refueledBoat);
          if (success) {
            console.log('Check-in successful');
          } else {
            console.error('Check-in failed');
          }
        }
      } catch (error) {
        if (error instanceof AuthenticationException) {
          console.error('Authentication error:', error);
          this.router.navigate(['/login']);
        }
      }
    });
  }

}
