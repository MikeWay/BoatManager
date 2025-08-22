import { Component, OnInit } from '@angular/core';
import { DefectType } from '../../model/defect';
import { ServerService } from '../server.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipListboxChange, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from "@angular/material/input";
import { StateService } from '../state-service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../app-state';

@Component({
  selector: 'app-report-problem',
  imports: [MatChipsModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.sass'
})
export class ReportProblemComponent implements OnInit {
  public problems: DefectType[] = [];
  public additionalInfo: string = '';
  public currentState: AppState = new AppState();


    constructor(private stateService: StateService, private server: ServerService) {
    // Initialize server or any other dependencies here
  }

  onProblemListChange($event: MatChipListboxChange) {
    this.problems = $event.value;
    //throw new Error('Method not implemented.');
    this.currentState!.defects = this.problems;
    this.currentState!.defectsAdditionalInfo = this.additionalInfo;
    this.currentState!.problemsWithBoat = this.problems.length > 0;
    this.stateService.updateState(this.currentState!);
  }

  public possibleProblems: DefectType[] = [];
  selectedProblems: any;


  async ngOnInit(): Promise<void> {
    this.currentState = await firstValueFrom(this.stateService.currentState);
    this.loadPossibleProblems();
  }

  private loadPossibleProblems(): void {
    this.server.getPossibleDefectsList().then((defects: DefectType[]) => {
      this.possibleProblems = defects;
    });
  }

}

