import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataService } from '../data.service';

@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss'],
})
export class BlueprintComponent {

  constructor(private dataService: DataService, private store: Store) {}

  ngOnInit() {
    this.store.dispatch(dataActions.getFurniture());
    this.store.dispatch(dataActions.getLevels());
    this.store.dispatch(dataActions.getSlots());

    this.store.dispatch(accountActions.getBigbrass());
  }
}

}
