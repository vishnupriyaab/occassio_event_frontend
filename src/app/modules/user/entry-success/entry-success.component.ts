import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry-success',
  imports: [],
  templateUrl: './entry-success.component.html',
  styleUrl: './entry-success.component.css',
})
export class EntrySuccessComponent implements OnInit{
  email: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      console.log(this.email,"qwertyui")
    });
  }
}
