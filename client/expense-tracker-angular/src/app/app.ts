import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { FooterComponent } from '../components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    Sidebar,
    FooterComponent,
  ],
  template: `
    <div class="app-container" [class.sidebar-open]="showSideNav">
      <app-header
        class="app-header"
        [loggedIn]="true"
        (menuToggled)="toggleSideNav()"
      >
      </app-header>

      <app-sidebar class="app-sidebar" *ngIf="showSideNav"> </app-sidebar>

      <main class="content-wrapper">
        <router-outlet></router-outlet>
      </main>

      <app-footer class="app-footer"></app-footer>
    </div>
  `,
  styles: [
    `
      /* Main container for the entire application */
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        background-color: #121212;
      }

      /* Header Styling */
      .app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1010; /* Higher than sidebar */
      }

      /* Sidebar Styling */
      .app-sidebar {
        position: fixed;
        top: 58px; /* Height of the header */
        left: 0;
        width: 240px; /* A more standard sidebar width */
        height: calc(
          100vh - 58px - 58px
        ); /* Full height minus header and footer */
        background-color: #1a1a1a;
        border-right: 1px solid #333;
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
      }

      /* Main content area where router-outlet will display components */
      .content-wrapper {
        flex: 1; /* Takes up all available vertical space */
        overflow-y: auto; /* This is the key: only this area will scroll */
        padding-top: 58px; /* Space for the fixed header */
        padding-bottom: 58px; /* Space for the fixed footer */
        transition: margin-left 0.3s ease-in-out;
        margin-left: 0;
      }

      /* When sidebar is open, push the main content to the right */
      .app-container.sidebar-open .content-wrapper {
        margin-left: 240px;
      }

      /* Footer Styling */
      .app-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1010;
        transition: margin-left 0.3s ease-in-out;
        margin-left: 0;
      }

      /* When sidebar is open, push the footer to the right */
      .app-container.sidebar-open .app-footer {
        margin-left: 240px;
      }

      /* Responsive adjustments for smaller screens */
      @media (max-width: 768px) {
        /* On smaller screens, the sidebar overlays the content instead of pushing it */
        .app-container.sidebar-open .content-wrapper {
          margin-left: 0;
        }
        .app-container.sidebar-open .app-footer {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class App {
  showSideNav = false;

  // This property should be driven by your AuthService
  loggedIn = true;

  toggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }
}
