import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { StateService } from '../state-service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-check-in-or-out',
    imports: [MatButtonToggleModule],
    templateUrl: './check-in-or-out.component.html',
    styleUrl: './check-in-or-out.component.sass'
})



export class CheckInOrOutComponent {


    constructor(private stateService: StateService) { }

    async onToggleChange(event: MatButtonToggleChange): Promise<void> {
        // Handle toggle change logic here
        let currentState = await firstValueFrom(this.stateService.currentState);
        //let currentState = await this.stateService.currentState.firstValueFrom();
        console.log('Current state:', currentState);
        if (event.value === 'check-in') {
            console.log('Check In selected');
            // You can add logic to switch between check-in and check-out modes
            currentState.checkOutInProgress = false;
        } else {
            console.log('Check Out selected');
            currentState.checkOutInProgress = true;
        }
        // You can add logic to switch between check-in and check-out modes
        this.stateService.updateState(currentState);
    }
}
