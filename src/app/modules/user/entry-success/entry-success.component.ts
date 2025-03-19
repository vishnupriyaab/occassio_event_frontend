import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entry-success',
  imports: [],
  templateUrl: './entry-success.component.html',
  styleUrl: './entry-success.component.css',
})
export class EntrySuccessComponent implements OnInit, OnDestroy {
  email: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const queryParamSub = this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      console.log(this.email, 'qwertyui');
    });
    this.subscription.add(queryParamSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('EntrySuccessComponent destroyed and unsubscribed.');
  }
}
