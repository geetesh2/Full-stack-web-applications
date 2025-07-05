import { Component } from '@angular/core';
import { SummaryComponent } from "../summary/summary";
import { ChartComponent } from "../chart/chart";

@Component({
  selector: 'app-home',
  imports: [SummaryComponent, ChartComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
