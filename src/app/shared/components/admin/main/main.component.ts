import { Component } from '@angular/core';
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [AdminMenuComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
