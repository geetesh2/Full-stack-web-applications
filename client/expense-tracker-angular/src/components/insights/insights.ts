import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense-service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-advice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-advice-card">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="state-container loading-state">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <h5 class="state-title">Analyzing your expenses...</h5>
        <p class="state-subtitle">Our AI is crunching the numbers to find insights for you.</p>
      </div>

      <!-- Data State -->
      <div *ngIf="!isLoading && adviceHtml" class="state-container data-state">
        <div class="advice-header">
          <!-- Robot Icon -->
          <svg class="advice-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          <h4 class="advice-title">Your AI Financial Advisor</h4>
        </div>
        <div class="advice-content" [innerHTML]="adviceHtml"></div>
      </div>

      <!-- Error/Empty State -->
      <div *ngIf="!isLoading && !adviceHtml" class="state-container error-state">
        <!-- Warning Icon -->
        <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <h5 class="state-title">Could Not Generate Advice</h5>
        <p class="state-subtitle">We couldn't analyze your spending. This may be due to a lack of expense data or a temporary issue.</p>
      </div>
    </div>
  `,
  styles: [`
    /* Using a modern font is recommended. Import 'Inter' or similar in your main styles.css */
    /* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'); */

    /* General Card Styling */
    .ai-advice-card {
      background: #1a1a2e; /* Dark navy blue background */
      border-radius: 16px;
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif; /* Modern, clean font */
      overflow: hidden;
      border: 1px solid #2a2a4e; /* Subtle border */
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .state-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      height: 100%;
      transition: opacity 0.3s ease-in-out;
    }

    .state-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .state-subtitle {
      font-size: 0.85rem;
      color: #a0a0c0; /* Lighter purple-ish gray for subtitles */
      max-width: 300px;
      line-height: 1.5;
    }

    /* Loading State Spinner */
    .loading-state .spinner {
      width: 50px;
      height: 50px;
      position: relative;
    }

    .double-bounce1, .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #4d4dff; /* A vibrant blue */
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
      animation-delay: -1.0s;
    }

    @keyframes sk-bounce {
      0%, 100% {
        transform: scale(0.0);
      } 50% {
        transform: scale(1.0);
      }
    }

    /* Error State */
    .error-state .error-icon {
      color: #ffc107; /* A nice warning yellow */
    }

    /* Data State */
    .data-state {
      justify-content: flex-start;
      text-align: left;
    }

    .advice-header {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #2a2a4e;
    }

    .advice-icon {
      color: #4d4dff;
      margin-right: 12px;
      width: 28px;
      height: 28px;
    }

    .advice-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .advice-content {
      width: 100%;
      flex-grow: 1; /* Allows the content to fill available space */
      overflow-y: auto;
      padding-right: 10px; /* space for scrollbar */
    }

    /* --- Styling for dynamically injected HTML --- */
    /* This ensures the content from the backend looks great */
    .advice-content h1, .advice-content h2, .advice-content h3, .advice-content h4 {
      color: #f0f0f0;
      margin-top: 1.2em;
      margin-bottom: 0.6em;
      font-weight: 600;
    }

    .advice-content ul {
      list-style: none;
      padding-left: 0;
    }

    .advice-content li {
      position: relative;
      padding-left: 25px;
      margin-bottom: 12px;
      color: #c0c0e0;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .advice-content li::before {
      content: '•';
      position: absolute;
      left: 0;
      top: 0;
      color: #4d4dff; /* Match the accent color */
      font-size: 1.5em;
      line-height: 1;
    }

    .advice-content p {
      color: #c0c0e0;
      line-height: 1.6;
    }

    .advice-content strong {
      color: #ffffff;
      font-weight: 600;
    }
    
    /* --- Custom Scrollbar --- */
    .advice-content::-webkit-scrollbar {
      width: 6px;
    }

    .advice-content::-webkit-scrollbar-track {
      background: #1a1a2e;
    }

    .advice-content::-webkit-scrollbar-thumb {
      background-color: #4d4dff;
      border-radius: 10px;
    }

    /* --- Responsive Adjustments --- */
    @media (max-width: 768px) {
      .ai-advice-card {
        padding: 16px;
      }
      .state-title, .advice-title {
        font-size: 1rem;
      }
      .state-subtitle, .advice-content li, .advice-content p {
        font-size: 0.85rem;
      }
    }
  `],
})
export class AiAdviceComponent implements OnInit {
  isLoading = true;
  adviceHtml: SafeHtml | null = null;

  constructor(
    private expenseService: ExpenseService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Simulating a fetch for demonstration
    this.fetchData(); 
  }

  // Encapsulated fetching logic
  private fetchData(): void {
    this.expenseService.getMyExpenses();
    this.expenseService.expenses$.subscribe({
      next: (expenses) => {
        if (expenses && expenses.length > 0) {
          this.fetchInsightsFromBackend();
        } else {
          this.isLoading = false;
          this.adviceHtml = null;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.adviceHtml = null;
      },
    });
  }

  fetchInsightsFromBackend(): void {
    const baseUrl = 'http://localhost:5225/api/insight'; 
    // TODO: Use environment.ts for production URL

    this.http.get<any>(baseUrl).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Process the raw text from the backend into basic HTML for better styling
          const processedHtml = this.processTextToHtml(response.data);
          this.adviceHtml = this.sanitizer.bypassSecurityTrustHtml(processedHtml);
        } else {
          this.adviceHtml = null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.adviceHtml = null;
        this.isLoading = false;
      },
    });
  }

  /**
   * A simple processor to convert markdown-like text to basic HTML.
   * This makes the component more robust if the backend doesn't return full HTML.
   * @param text The raw text from the API.
   * @returns A string with basic HTML tags.
   */
  private processTextToHtml(text: string): string {
    // Convert bold and list items to HTML
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold: **text**
      .replace(/\n/g, '<br>'); // Newlines

    // Handle lists starting with * or -
    if (text.includes('* ') || text.includes('- ')) {
        html = '<ul>' + text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('* ') || line.startsWith('- '))
            .map(item => `<li>${item.substring(2)}</li>`)
            .join('') + '</ul>';
    }
    return html;
  }
}
