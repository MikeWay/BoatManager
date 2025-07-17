import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { dao } from '../../model/dao';
import { BoatManager } from '../../model/BoatManager'; // Adjusted the path to the correct location
import { Boat } from '../../model/Boat'; // Adjusted the path to the correct location

@Component({
  selector: 'app-boat-list',
  imports: [MatChipsModule],
  templateUrl: './boat-list.component.html',
  styleUrl: './boat-list.component.sass'
})
export class BoatListComponent implements OnInit {

  boats: Boat[] = [];

  async ngOnInit() {

    const boats = await dao.boatManager.getAvailableBoats();
    this.boats = boats;
  }

}
