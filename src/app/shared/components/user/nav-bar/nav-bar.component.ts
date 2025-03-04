import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeadContentComponent } from "../head-content/head-content.component";

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, HeadContentComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @Input() title: string | null = null;
  @Input() content: string | null = null;
  isMobileMenuOpen = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
