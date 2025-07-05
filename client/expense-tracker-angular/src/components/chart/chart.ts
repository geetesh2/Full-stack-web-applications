import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { ExpenseDto } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expenseResponse.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.html',
  styleUrls: ['./chart.css']
})
export class ChartComponent implements AfterViewInit, OnChanges, OnInit{

  expenses: Expense[] = [];
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
    private expenseService = inject(ExpenseService);

  ngOnInit(): void {
    // console.log("hi");
    this.expenseService.getMyExpenses();

    this.expenseService.expenses$.subscribe((expenses) => {
      // console.log(expenses);
      this.expenses = [...expenses];
      this.updateChart();
    })
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
      grouped[exp.expenseType!] = (grouped[exp.expenseType!] || 0) + exp.amount;
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
