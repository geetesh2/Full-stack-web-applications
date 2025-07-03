import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.html',
  styleUrls: ['./chart.css']
})
export class ChartComponent implements AfterViewInit {

  @ViewChild('myChart') myChartRef!: ElementRef;
  chart: any;

  constructor() {
    Chart.register(
      DoughnutController,
      ArcElement,
      Tooltip,
      Legend,
      Title
    );
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    const ctx = this.myChartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sales', 'Profit', 'Loss'],
        datasets: [
          {
            label: 'Business Overview',
            data: [500, 300, 200],
            backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b'], // Blue, Green, Red
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'white' // Legend text color
            }
          },
          title: {
            display: true,
            text: 'Sales vs Profit vs Loss',
            color: 'white' // Title text color
          }
        },
        layout: {
          padding: 20
        }
      }
    });
  }
}
