export class AppState {

    constructor() {
        this.boats = [];
        this.logs = [];
        this.persons = [];
        this.reasonForCheckout = null;
        this.currentBoat = null;
        this.currentLog = null;
        this.currentPerson = null;      
        this.isLoading = false;
        this.error = null;
        this.message = 'Welcome to Boat Manager';
        this.checkOutInProgress = undefined;
        this.enableNextButton = false;
        this.enablePreviousButton = false;
    }
    public boats: any[] = [];
    public logs: any[] = [];
    public persons: any[] = [];
    public reasonForCheckout: string | null = null;
    private currentBoat: any = null;

    public getCurrentBoat(): any {
        return this.currentBoat;
    }

    public setCurrentBoat(boat: any): void {
        this.currentBoat = boat;
    }
    public currentLog: any = null;
    public currentPerson: any = null;
    public isLoading: boolean = false;
    public error: string | null = null;
    public message: string = 'Welcome to Boat Manager';

    public checkOutInProgress: boolean | undefined;
    public enableNextButton: boolean = false;
    public enablePreviousButton: boolean = false;

}
