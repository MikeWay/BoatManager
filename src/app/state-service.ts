import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppState } from './app-state';

/**
 * StateService is responsible for managing the application state.
 * It uses BehaviorSubject to hold the current state and allows components to subscribe to state changes.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  
  private stateSource = new BehaviorSubject<AppState>(new AppState);
  currentState = this.stateSource.asObservable();

  updateState(state: AppState) {
    this.stateSource.next(state);
  }
}
