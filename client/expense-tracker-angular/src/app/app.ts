import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { ChartComponent } from '../components/chart/chart';
import { ExpenseForm } from '../components/expense-form/expense-form';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ChartComponent, ExpenseForm, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  showSideNav = false;

  toggleSideNav(){
    console.log("hi");
    this.showSideNav = !this.showSideNav;
  }
}