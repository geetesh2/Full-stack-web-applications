import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <p class="quote">💡 {{ quote }}</p>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} | Built with ❤️ by Geetesh</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background-color: #1a1a1a; /* Matches header background */
        color: #adb5bd; /* Matches header icon color for consistency */
        text-align: center;
        padding: 1.5rem 1rem;
        font-size: 0.9rem;
        border-top: 1px solid #333; /* Matches header border */
      }

      .quote {
        font-style: italic;
        color: #a891d9; /* A softer purple to complement the theme */
        margin: 0 0 1rem 0;
        font-weight: 500;
      }

      .footer-bottom p {
        margin: 0;
      }
    `,
  ],
})
export class FooterComponent implements OnInit {
  public quote: string = '';
  public readonly currentYear: number = new Date().getFullYear();

  private readonly quotes: string[] = [
    'Every rupee saved is a rupee earned.',
    'Spend wisely, live freely.',
    'Small expenses add up. Track them.',
    'Budgeting today builds your tomorrow.',
    'Don’t count the rupees — make the rupees count.',
    'Discipline in spending is freedom in future.',
    'A little saving today is a big relief tomorrow.',
  ];

  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.quote = this.quotes[randomIndex];
  }
}
