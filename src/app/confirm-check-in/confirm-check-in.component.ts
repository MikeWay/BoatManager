import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { StateService } from '../state-service';    
import { firstValueFrom } from 'rxjs';
import { Boat } from '../../model/Boat';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppState } from '../app-state';
import { MatInputModule } from "@angular/material/input";
@Component({
  selector: 'app-confirm-check-in',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatCheckboxModule, MatRadioModule, FormsModule, MatInputModule],
  templateUrl: './confirm-check-in.component.html',
  styleUrl: './confirm-check-in.component.sass'
})

export class ConfirmCheckInComponent implements OnInit {

  boatName: any;
  userName: any;
  currentState: AppState | undefined;
problemsWithBoat: any;
returnedKey: any;
refueledBoat: any;
iAmTheUser: any;
engineHours: string = '0:00';

  constructor(private stateService: StateService, private router: Router) {}


  async ngOnInit() {
    this.currentState = await firstValueFrom(this.stateService.currentState);
    const boat: Boat | null = this.currentState.currentBoat;
    if (boat) {
      this.boatName = boat.name; // Assuming the Boat object has a 'name'
      this.userName = boat.checkedOutToName; // Assuming checkedOutTo is a property
    } else {
      console.error('No boat selected for check-in confirmation.');
      this.router.navigate(['/']);
    }
    this.currentState.enableNextButton = true; // Enable Next button
  }

  onProblemsChange($event: MatRadioChange<any>) {
    this.problemsWithBoat = $event.value;
    this.currentState!.problemsWithBoat = this.problemsWithBoat === 'Yes';
    this.stateService.updateState(this.currentState!);
  }

  modelChange(): void {
    // Write the current properties to the currentState
    
    if (this.currentState) {
      // Convert engineHours string (e.g., "2:30") to a number (e.g., 2.5)
      if (this.engineHours) {
        const [hoursStr, minutesStr] = this.engineHours.split(':');
        const hours = parseInt(hoursStr, 10) || 0;
        const minutes = parseInt(minutesStr, 10) || 0;
        this.currentState.engineHours = hours + minutes / 60;
      } else {
        this.currentState.engineHours = 0;
      }
      this.currentState.returnedKey = this.returnedKey;
      this.currentState.refueledBoat = this.refueledBoat;
      this.stateService.updateState(this.currentState);
    }
  }

}

    