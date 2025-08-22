// Class reresenting a defect. Includes boat name, description, and date reported.
export class Defect {
    boatName: string;
    description: string;
    dateReported: Date;
    reportBy: string;
    // Constructor to initialize the defect with boat name, description, date reported, and reporter's name
    constructor(boatName: string, description: string, dateReported: Date, reportBy: string) {
        this.boatName = boatName;
        this.description = description;
        this.dateReported = dateReported;
        this.reportBy = reportBy;
    }

}

export class DefectType {
    id: number;
    name: string;
    description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
