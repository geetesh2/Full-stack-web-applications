import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Output() newItemEvent = new EventEmitter<void>();
  loggedIn = false;
  toggleSideNav(){
    console.log("in header");
    this.newItemEvent.emit();
  }
}
