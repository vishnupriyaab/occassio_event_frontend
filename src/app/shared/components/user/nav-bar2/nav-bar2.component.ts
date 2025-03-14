import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-nav-bar2',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar2.component.html',
  styleUrl: './nav-bar2.component.css',
})
export class NavBar2Component {
  @Input() title = '';
  @Input() content = '';
  isMobileMenuOpen = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
