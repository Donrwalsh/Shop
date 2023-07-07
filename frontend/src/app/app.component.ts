import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataService } from './data.service';
import * as shopExpansionActions from './state/data/data.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(private dataService: DataService, private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(shopExpansionActions.getSlots());
  }
}
