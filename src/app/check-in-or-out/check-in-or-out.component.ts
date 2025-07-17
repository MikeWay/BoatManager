import { Component } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-check-in-or-out',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './check-in-or-out.component.html',
  styleUrl: './check-in-or-out.component.sass'
})
export class CheckInOrOutComponent {

}
