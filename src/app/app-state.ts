import { Boat } from "../model/Boat";
import { DefectType } from "../model/defect";

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
    public currentBoat: Boat | null = null;


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
    public defects: DefectType[] = [];
    public defectsAdditionalInfo: string = '';

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