import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmplMenuComponent } from '../empl-menu/empl-menu.component';
import { EmplNavComponent } from '../empl-nav/empl-nav.component';

@Component({
  selector: 'app-empl-main',
  imports: [RouterOutlet, EmplMenuComponent, EmplNavComponent],
  templateUrl: './empl-main.component.html',
  styleUrl: './empl-main.component.css',
})
export class EmplMainComponent {}
