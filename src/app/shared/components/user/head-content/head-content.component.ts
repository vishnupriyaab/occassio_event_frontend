import { Component, Input } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-head-content',
  imports: [FooterComponent],
  templateUrl: './head-content.component.html',
  styleUrl: './head-content.component.css'
})
export class HeadContentComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
