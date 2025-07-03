import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
      quote: string = '';

    private quotes: string[] = [
    'Every rupee saved is a rupee earned.',
    'Spend wisely, live freely.',
    'Small expenses add up. Track them.',
    'Budgeting today builds your tomorrow.',
    'Don’t count the rupees — make the rupees count.',
    'Discipline in spending is freedom in future.',
    'A little saving today is a big relief tomorrow.'
  ];

   ngOnInit() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.quote = this.quotes[randomIndex];
  }

}
