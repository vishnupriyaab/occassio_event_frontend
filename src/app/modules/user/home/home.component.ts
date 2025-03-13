import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../../shared/components/user/nav-bar/nav-bar.component';
import { FooterComponent } from '../../../shared/components/user/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
