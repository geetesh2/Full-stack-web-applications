import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-container d-flex flex-column p-3">
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">
            <i class="fas fa-home me-2"></i>
            <span>Home</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            routerLink="/add-expense"
            routerLinkActive="active"
            class="nav-link"
          >
            <i class="fas fa-plus-circle me-2"></i>
            <span>Add Expense</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            routerLink="/view-expenses"
            routerLinkActive="active"
            class="nav-link"
          >
            <i class="fas fa-folder-open me-2"></i>
            <span>View Expenses</span>
          </a>
        </li>
      </ul>
      <hr />
      <div class="dropdown">
        <a
          href="#"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://placehold.co/32x32/6a11cb/ffffff?text=G"
            alt=""
            width="32"
            height="32"
            class="rounded-circle me-2"
          />
          <strong>Geetesh</strong>
        </a>
        <ul
          class="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser1"
        >
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .sidebar-container {
        height: 100%;
        background-color: #1a1a1a;
      }

      .nav-link {
        color: #adb5bd;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      }

      .nav-link:hover {
        color: #ffffff;
        background-color: #2c2c2c;
      }

      .nav-link.active {
        color: #ffffff;
        background-color: #6a11cb;
      }

      .nav-link .fas {
        width: 20px; /* Ensures icons are aligned */
        text-align: center;
      }

      hr {
        border-color: #333;
      }

      .dropdown-toggle::after {
        display: inline-block;
        margin-left: auto;
      }
    `,
  ],
})
export class Sidebar {}
