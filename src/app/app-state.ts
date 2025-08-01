import { Boat } from "../model/Boat";

export class AppState {

    constructor() {

        this.reasonForCheckout = null;
        this.currentBoat = null;
        this.currentLog = null;
        this.currentPerson = null;      
        this.isLoading = false;
        this.error = null;
         this.checkOutInProgress = undefined;
        this.enableNextButton = false;
        this.enablePreviousButton = false;
        this.problemsWithBoat = false;
    }
    public reasonForCheckout: string | null = null;
    private currentBoat: Boat | null = null;

    public getCurrentBoat(): Boat | null {
        return this.currentBoat;
    }

    public setCurrentBoat(boat: Boat | null): void {
        this.currentBoat = boat;
    }
    public currentLog: any = null;
    public currentPerson: any = null;
    public isLoading: boolean = false;
    public error: string | null = null;
    public message: string = 'Welcome to Boat Manager';

    public checkOutInProgress: boolean | undefined;
    public checkInInProgress: boolean | undefined;
    public enableNextButton: boolean = false;
    public enablePreviousButton: boolean = false;
    public problemsWithBoat: boolean | undefined;

}

export interface AppStateInterface {

    reasonForCheckout: string | null;
    currentBoat: Boat | null;
    currentLog: any;
    currentPerson: any;
    isLoading: boolean;
    error: string | null;
    message: string;
    checkOutInProgress?: boolean;
    checkInInProgress?: boolean;
    enableNextButton?: boolean;
    enablePreviousButton?: boolean;
}