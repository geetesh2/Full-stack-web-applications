import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AiResponse {
  message: string;
  data: string;
}

@Component({
  selector: 'app-ai-advice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card advice-card h-100">
      <div class="card-body">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h5 class="mt-3 text-white-50">Analyzing your expenses...</h5>
        </div>

        <!-- Data State -->
        <div *ngIf="!isLoading && adviceHtml" class="advice-container">
          <div [innerHTML]="adviceHtml"></div>
        </div>

        <!-- Error/Empty State -->
        <div *ngIf="!isLoading && !adviceHtml" class="loading-container">
          <i class="fas fa-exclamation-circle fa-2x text-warning"></i>
          <h5 class="mt-3 text-white-50">Could not generate advice.</h5>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .advice-card {
        background-color: #1a1a1a;
        border: 1px solid #333;
        border-radius: 1rem;
        color: #e0e0e0;
        display: flex;
        flex-direction: column;
      }

      .card-body {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        text-align: center;
      }

      .spinner-border {
        width: 3rem;
        height: 3rem;
      }

      .advice-container {
        /* Styles for the rendered HTML from the AI response */
      }

      /* Use ::ng-deep to style the dynamically generated HTML */
      :host ::ng-deep .advice-container h3 {
        color: #6a11cb;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #333;
      }

      :host ::ng-deep .advice-container h4 {
        color: #ffffff;
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }

      :host ::ng-deep .advice-container p,
      :host ::ng-deep .advice-container li {
        color: #adb5bd;
        line-height: 1.6;
      }

      :host ::ng-deep .advice-container ul {
        padding-left: 1.5rem;
      }

      :host ::ng-deep .advice-container strong {
        color: #e0e0e0;
      }
    `,
  ],
})
export class AiAdviceComponent implements OnInit {
  @Input() aiResponse: AiResponse | null = null;

  isLoading = true;
  adviceHtml: string | null = null;

  ngOnInit(): void {
    // In a real app, you would trigger the AI service call here.
    // For this demo, we'll simulate a delay.
    this.simulateAiResponse();
  }

  simulateAiResponse(): void {
    this.isLoading = true;
    setTimeout(() => {
      // This is the mock response you provided.
      const mockResponse: AiResponse = {
        message: 'Insights generated successfully',
        data: '<h3><strong>Analysis & Recommendations</strong></h3><h4><strong>1. Spending Pattern Analysis</strong></h4><ul><li><strong>Initial Observation:</strong> Your analysis begins with a ₹200 expense on "Food". The description "Party with friend" correctly classifies this as a discretionary or \'want\' expense, not a \'need\' like groceries.</li><li><strong>Actionable Advice: Get Specific with Categories.</strong> To gain powerful insights, I recommend splitting the "Food" category into sub-categories. This will help you understand where your money is truly going.<ul><li><strong>Food: Groceries</strong> (Needs)</li><li><strong>Food: Dining Out / Restaurants</strong> (Wants)</li></ul></li><li><strong>Recommendation:</strong> Continue to track every single expense, no matter how small.</li></ul><h4><strong>2. Budgeting Suggestions</strong></h4><ul><li><strong>Budget vs. Actuals (Food):</strong><ul><li>Monthly Budget: <strong>₹6,000</strong></li><li>Spent so far: <strong>₹200</strong></li><li>Remaining Balance: <strong>₹5,800</strong></li></ul></li><li><strong>Actionable Advice: Implement the 50/30/20 Rule.</strong> This is a powerful and simple framework for budgeting.</li></ul><hr><h3><strong>Your Key Takeaways & Next Steps</strong></h3><p>You have taken the most important step: <strong>getting started.</strong> The key now is consistency.</p>',
      };

      // Convert the markdown-like string to actual HTML
      this.adviceHtml = this.formatAdvice(mockResponse.data);
      this.isLoading = false;
    }, 3000); // Simulate a 3-second API call
  }

  private formatAdvice(data: string): string {
    // This is a simple formatter. For production, use a library like `ngx-markdown`
    // to safely convert markdown to HTML and prevent XSS attacks.
    // The mock data is already close to HTML, so we'll just do basic replacements.
    return data.replace(/\n/g, '<br>');
  }
}
