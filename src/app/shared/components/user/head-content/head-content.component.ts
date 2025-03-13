import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-head-content',
  imports: [],
  templateUrl: './head-content.component.html',
  styleUrl: './head-content.component.css'
})
export class HeadContentComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
