import { Component } from '@angular/core';
import { NavBarComponent } from "../../../shared/components/user/nav-bar/nav-bar.component";
import { HeadContentComponent } from "../../../shared/components/user/head-content/head-content.component";
import { FooterComponent } from "../../../shared/components/user/footer/footer.component";

@Component({
  selector: 'app-service',
  imports: [NavBarComponent, HeadContentComponent, FooterComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {

}
