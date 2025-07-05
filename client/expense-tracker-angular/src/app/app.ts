import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { ChartComponent } from '../components/chart/chart';
import { ExpenseForm } from '../components/expense-form/expense-form';
import { Sidebar } from '../components/sidebar/sidebar';
import { SummaryComponent } from '../components/summary/summary';
import { Footer } from '../components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ChartComponent, ExpenseForm, Sidebar, SummaryComponent, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App{
  showSideNav = false;
  toggleSideNav(){
    this.showSideNav = !this.showSideNav;
  }
}