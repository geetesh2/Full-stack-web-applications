import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Expense } from '../../models/expenseResponse.model';
import { ExpenseService } from '../../services/expense-service';

// Register Chart.js components once globally
Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <ng-container *ngIf="hasExpenses; else noData">
        <canvas #expenseChartCanvas></canvas>
      </ng-container>
      <ng-template #noData>
        <div class="empty-chart-state">
          <i class="fas fa-chart-pie fa-3x mb-3"></i>
          <h5 class="text-white fw-bold">No Data to Display</h5>
          <p class="text-white-50">
            Add some expenses to see your spending breakdown.
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #1a1a1a;
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #333;
      }

      canvas {
        max-width: 100%;
        max-height: 100%;
      }

      .empty-chart-state {
        text-align: center;
        color: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('expenseChartCanvas') private chartRef!: ElementRef;
  private chart: Chart | undefined;
  private expenses: Expense[] = [];
  public hasExpenses = false;

  private expenseService = inject(ExpenseService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.expenseService.expenses$
      .subscribe((expenses) => {
        this.expenses = expenses;
        this.hasExpenses = this.expenses.length > 0;
        // Defer chart update until view is initialized
        if (this.chartRef) {
          this.createOrUpdateChart();
        }
      });
  }

  ngAfterViewInit(): void {
    // Initial chart creation after view is ready
    if (this.hasExpenses) {
      this.createOrUpdateChart();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy();
  }

  private groupExpensesByType() {
    const grouped: { [key: string]: number } = this.expenses.reduce(
      (acc, exp) => {
        acc[exp.expenseType!] = (acc[exp.expenseType!] || 0) + exp.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped),
    };
  }

  private createOrUpdateChart(): void {
    if (!this.chartRef) return;

    // Destroy existing chart instance before creating a new one
    if (this.chart) {
      this.chart.destroy();
    }

    const groupedData = this.groupExpensesByType();
    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: groupedData.labels,
        datasets: [
          {
            label: 'Amount',
            data: groupedData.data,
            backgroundColor: [
              '#6a11cb',
              '#2575fc',
              '#36b9cc',
              '#f6c23e',
              '#1cc88a',
              '#e74a3b',
              '#fd7e14',
              '#6f42c1',
            ],
            borderColor: '#1a1a1a',
            borderWidth: 4,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#adb5bd',
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: 'Expenses by Category',
            color: '#ffffff',
            font: {
              family: "'Inter', sans-serif",
              size: 18,
              weight: 600,
            },
            padding: {
              bottom: 20,
            },
          },
        },
      },
    });
  }
}
