import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,  Sidebar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App{
  showSideNav = false;
  toggleSideNav(){
    this.showSideNav = !this.showSideNav;
  }
}