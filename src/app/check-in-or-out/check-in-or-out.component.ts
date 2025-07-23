import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { StateService } from '../state-service';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../app-state';

@Component({
    selector: 'app-check-in-or-out',
    imports: [MatButtonToggleModule],
    templateUrl: './check-in-or-out.component.html',
    styleUrl: './check-in-or-out.component.sass'
})



export class CheckInOrOutComponent implements OnInit {
    currentState: AppState | undefined;


    constructor(private stateService: StateService) { }



    async onToggleChange(event: MatButtonToggleChange): Promise<void> {
        // Handle toggle change logic here
        if (!this.currentState) {
            this.currentState = await firstValueFrom(this.stateService.currentState);
        }
        
        //let currentState = await this.stateService.currentState.firstValueFrom();
        
        if (event.value === 'check-in') {
            console.log('Check In selected');
            // You can add logic to switch between check-in and check-out modes
            this.currentState.checkOutInProgress = false;
        } else {
            console.log('Check Out selected');
            this.currentState.checkOutInProgress = true;
        }
        // You can add logic to switch between check-in and check-out modes
        this.currentState.enableNextButton = true; // Enable Next button
        this.stateService.updateState(this.currentState);
    }

    async ngOnInit(): Promise<void> {
        this.currentState = await firstValueFrom(this.stateService.currentState);
        console.log('Current state:', this.currentState);
        this.currentState.enableNextButton = false; // Disable Next button initially
        this.currentState.enablePreviousButton = false; // Disable Previous button initially
    }
}
