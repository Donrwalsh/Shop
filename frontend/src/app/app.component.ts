import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataService } from './data.service';
import * as accountActions from './state/account/account.actions';
import * as dataActions from './state/data/data.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(private dataService: DataService, private store: Store) {}

  ngOnInit() {
    this.store.dispatch(dataActions.getFurniture());
    this.store.dispatch(dataActions.getLevels());
    this.store.dispatch(dataActions.getSlots());

    this.store.dispatch(accountActions.getBigbrass());
  }
}
