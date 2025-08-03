import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark fixed-top main-nav">
      <div class="container-fluid">
        <button
          *ngIf="loggedIn"
          (click)="toggleSideNav()"
          class="btn btn-icon me-2"
          aria-label="Toggle navigation menu"
        >
          <i class="fas fa-bars"></i>
        </button>

        <a class="navbar-brand" href="#">
          <i class="fas fa-wallet me-2"></i>
          Expense Tracker
        </a>

        <div class="ms-auto"></div>

        <button
          *ngIf="loggedIn"
          (click)="logout()"
          class="btn btn-icon"
          aria-label="Logout"
        >
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      .main-nav {
        background-color: #1a1a1a;
        border-bottom: 1px solid #333;
        padding: 0.75rem 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .navbar-brand {
        font-weight: 600;
        font-size: 1.25rem;
        color: #e0e0e0;
      }

      .navbar-brand:hover {
        color: #ffffff;
      }

      .btn-icon {
        color: #adb5bd;
        background-color: transparent;
        border: none;
        font-size: 1.2rem;
        transition: color 0.2s ease-in-out;
      }

      .btn-icon:hover,
      .btn-icon:focus {
        color: #ffffff;
        box-shadow: none;
      }

      .fas {
        line-height: 1;
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() loggedIn: boolean = true;

  @Output() menuToggled = new EventEmitter<void>();

  @Output() loggedOut = new EventEmitter<void>();

  toggleSideNav(): void {
    this.menuToggled.emit();
  }

  logout(): void {
    this.loggedOut.emit();
  }
}
