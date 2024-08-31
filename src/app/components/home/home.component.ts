import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NavmenuComponent } from '../navmenu/navmenu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavmenuComponent,
],
templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
