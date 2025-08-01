import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { StateService } from '../state-service';    
import { firstValueFrom } from 'rxjs';
import { Boat } from '../../model/Boat';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-confirm-check-in',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatCheckboxModule,MatRadioModule, FormsModule],
  templateUrl: './confirm-check-in.component.html',
  styleUrl: './confirm-check-in.component.sass'
})

export class ConfirmCheckInComponent implements OnInit {

  boatName: any;
  userName: any;
  currentState: any;
problemsWithBoat: any;
returnedKey: any;
refueledBoat: any;
iAmTheUser: any;

  constructor(private stateService: StateService, private router: Router) {}

  async ngOnInit() {
    this.currentState = await firstValueFrom(this.stateService.currentState);
    const boat: Boat = this.currentState.getCurrentBoat();
    if (boat) {
      this.boatName = boat.name; // Assuming the Boat object has a 'name'
      this.userName = boat.checkedOutTo; // Assuming checkedOutTo is a property
    } else {
      console.error('No boat selected for check-in confirmation.');
      this.router.navigate(['/']);
    }
    this.currentState.enableNextButton = true; // Enable Next button
  }

  onProblemsChange($event: MatRadioChange<any>) {
    this.problemsWithBoat = $event.value;
    this.currentState.problemsWithBoat = this.problemsWithBoat === 'Yes';
    this.stateService.updateState(this.currentState);
  }


}

    