import { Component, EventEmitter, inject, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router)
  @Output() newItemEvent = new EventEmitter<void>();
  loggedIn = true;
  toggleSideNav(){
    this.newItemEvent.emit();
  }

  logout(){
    this.authService.logout();
    this.loggedIn = false;
    this.router.navigate(['/auth']);
  }
}
