import { Component, OnInit } from '@angular/core';
import { MatChipListboxChange, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { dao } from '../../model/dao';
import { BoatManager } from '../../model/BoatManager'; // Adjusted the path to the correct location
import { Boat } from '../../model/Boat'; // Adjusted the path to the correct location
import { StateService } from '../state-service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { AppState } from '../app-state'; // Adjusted the path to the correct location
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-boat-list',
  imports: [MatChipsModule,MatCardModule],
  templateUrl: './boat-list.component.html',
  styleUrl: './boat-list.component.sass'
})
export class BoatListComponent implements OnInit {
  currentState: AppState | undefined;
  constructor(private stateService: StateService) { }

  private selectedBoat: Boat | undefined;

  onBoatSelectionChange($event: MatChipSelectionChange) {
    this.selectedBoat = $event.selected ? $event.source.value : undefined;
    if (this.currentState) {
      this.currentState.setCurrentBoat(this.selectedBoat);
      this.currentState.enableNextButton = !!this.selectedBoat; // Enable Next button if a boat is selected
      this.currentState.enablePreviousButton = true; // Enable Previous button
      console.log('Selected boat:', this.selectedBoat);
      this.stateService.updateState(this.currentState);
    }
  }

  boats: Boat[] = [];

  async ngOnInit() {
    this.selectedBoat = undefined;
    const boats = await dao.boatManager.getAvailableBoats();
    this.boats = boats;
    this.currentState = await firstValueFrom(this.stateService.currentState);
    this.currentState.enableNextButton = false;
  }

}
