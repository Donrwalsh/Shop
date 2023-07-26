import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as dataSelectors from '../state/data/data.selectors';
import { AppState } from '../state/app.state';
import { BasicBlueprint } from '../models/blueprint.model';

@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss'],
})
export class BlueprintComponent {
  constructor(private store: Store<AppState>) {}

  data = [] as BasicBlueprint[];
  blueprints$ = this.store.pipe(select(dataSelectors.selectBlueprintRef));

  ngOnInit() {
    this.blueprints$.subscribe((blueprints) => {
      this.data = blueprints;
    });
  }

  tableSort(header: string) {
    if (header === 'blueprintId') {
      this.data.sort((a, b) => (a.id > b.id ? 1 : -1));
    }
  }
}
