import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StateService } from '../state-service';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../app-state';
import { ServerService } from '../server.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ShowUserNameComponent } from '../show-user-name/show-user-name.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-who-are-you',
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    ShowUserNameComponent

  ],
  templateUrl: './who-are-you.component.html',
  styleUrl: './who-are-you.component.sass'
})
export class WhoAreYouComponent implements OnInit {
  public currentState: AppState | undefined;
  public familyInitial: string = '';
  public month: string = '';
  public year: Number = 0; // Optional field used only if multiple people are found
  public day: Number = 0;
  public displayUserName=""
  public enableYearField: boolean = false;
  public years: Number[] = [];

 
  private _snackBar = inject(MatSnackBar);

  constructor(private stateService: StateService, private server: ServerService) { }

  familyInitialSet(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.familyInitial = input.value;

  }

  async contentChanged(): Promise<void> {
    if (this.currentState) {
      const formValid = !!this.familyInitial && !!this.month && !!this.day;
      if (formValid) {
        // Call the server to check if the 3 fields match a person
        const matchingPeople = await this.server.checkPerson(this.familyInitial, this.month, this.day, this.year);
        if (!matchingPeople || matchingPeople.length === 0) {
          console.warn('No person found with the provided details');
          this.currentState.enableNextButton = false;
          this.stateService.updateState(this.currentState);
          return;
        }
        // If more than one person is found: enable year field
        if (matchingPeople.length > 1) {
          console.warn('Multiple people found with the provided details');
          this.currentState.enableNextButton = false;
          this.stateService.updateState(this.currentState);
          this.enableYearField = true;
          return;
        }
        // If a single person is found, update the state
        this.currentState.currentPerson = matchingPeople[0];
        this.displayUserName = `${matchingPeople[0].firstName} ${matchingPeople[0].lastName}`
        this.currentState.enableNextButton = true;
        this.stateService.updateState(this.currentState);
      }
    }
  }

  async ngOnInit() {

    this.currentState = await firstValueFrom(this.stateService.currentState);
    this.currentState.enableNextButton = false;

    // fill the years array with the last 100 years
    const currentYear = new Date().getFullYear();
    for (let i = 18; i < 100; i++) {
      this.years.push(currentYear - i);
    }
  }
}
