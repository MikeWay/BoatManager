import { Component, OnInit } from '@angular/core';
import { StateService } from '../state-service';
import { firstValueFrom } from 'rxjs';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-check-out-complete',
  imports: [MatCardModule],
  templateUrl: './check-out-complete.component.html',
  styleUrl: './check-out-complete.component.sass'
})
export class CheckOutCompleteComponent implements OnInit {
  boatName: any;
  userName: any;
  reason: any;
  currentState: any;

  constructor(private stateService: StateService) {}
  
  async ngOnInit() {

    this.currentState = await firstValueFrom(this.stateService.currentState);
    this.currentState.enableNextButton = false;
    this.boatName = this.currentState.currentBoat || 'Unknown Boat';
    this.userName = `${this.currentState.currentPerson?.firstName} ${this.currentState.currentPerson?.lastName}` || 'Unknown User';
    this.reason = this.currentState.reasonForCheckout || 'No reason provided';

  }
}
