import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as blueprintSelectors from '../state/blueprint/blueprint.selectors';
import * as blueprintActions from '../state/blueprint/blueprint.actions';

@Component({
  selector: 'app-blueprint-detail',
  templateUrl: './blueprint-detail.component.html',
  styleUrls: ['./blueprint-detail.component.scss'],
})
export class BlueprintDetailComponent implements OnInit {
  id: string | null = '';
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}
  current$ = this.store.pipe(select(blueprintSelectors.selectCurrent));
  uri = 'localhost:4200/blueprint/${this.id}';
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.current$.subscribe((data) => {
      console.log(data);
    });
    this.store.dispatch(
      blueprintActions.getFullBlueprint({ payload: '64824b1942bdd95adb945d44' })
    );
  }
}
