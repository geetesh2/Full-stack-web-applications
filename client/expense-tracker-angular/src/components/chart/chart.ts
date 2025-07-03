import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.html',
  styleUrls: ['./chart.css']
})
export class ChartComponent implements AfterViewInit, OnChanges {

  expenses: Expense[] = [
    {
      expenseType: 'Food',
      amount: 250,
      description: 'Lunch at cafe',
      date: new Date('2025-07-01')
    },
    {
      expenseType: 'Travel',
      amount: 800,
      description: 'Cab fare',
      date: new Date('2025-07-01')
    },
    {
      expenseType: 'Shopping',
      amount: 1200,
      description: 'New shoes',
      date: new Date('2025-06-30')
    },
    {
      expenseType: 'Food',
      amount: 300,
      description: 'Groceries',
      date: new Date('2025-06-29')
    },
    {
      expenseType: 'Others',
      amount: 150,
      description: 'Stationery',
      date: new Date('2025-06-28')
    },
    {
      expenseType: 'Travel',
      amount: 400,
      description: 'Metro card recharge',
      date: new Date('2025-06-27')
    },
    {
      expenseType: 'Shopping',
      amount: 2200,
      description: 'Clothing',
      date: new Date('2025-06-26')
    },
    {
      expenseType: 'Food',
      amount: 100,
      description: 'Snacks',
      date: new Date('2025-06-25')
    }
  ];
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
    if (this.expenses.length > 0) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && this.myChartRef?.nativeElement) {
      this.updateChart();
    }
  }

  groupExpensesByType() {
    const grouped: { [key: string]: number } = {};
    for (const exp of this.expenses) {
      grouped[exp.expenseType] = (grouped[exp.expenseType] || 0) + exp.amount;
    }

    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  createChart() {
    const ctx = this.myChartRef.nativeElement.getContext('2d');
    const grouped = this.groupExpensesByType();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: grouped.labels,
        datasets: [
          {
            label: 'Expense Distribution',
            data: grouped.data,
            backgroundColor: [
              '#4e73df', // Blue
              '#1cc88a', // Green
              '#e74a3b', // Red
              '#f6c23e', // Yellow
              '#36b9cc', // Teal
              '#a833ff'  // Purple
            ],
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
              color: 'white'
            }
          },
          title: {
            display: true,
            text: 'Expenses by Category',
            color: 'white'
          }
        },
        layout: {
          padding: 20
        }
      }
    });
  }
}
