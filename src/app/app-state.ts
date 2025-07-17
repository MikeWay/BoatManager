export class AppState {
    public boats: any[] = [];
    public logs: any[] = [];
    public persons: any[] = [];
    public currentBoat: any = null;
    public currentLog: any = null;
    public currentPerson: any = null;
    public isLoading: boolean = false;
    public error: string | null = null;
    public message: string = 'Welcome to Boat Manager';

    public checkOutInProgress: boolean | undefined;

}
