import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as blueprintSelectors from '../state/blueprint/blueprint.selectors';
import * as blueprintActions from '../state/blueprint/blueprint.actions';
import { Blueprint } from '../models/blueprint.model';

@Component({
  selector: 'app-blueprint-detail',
  templateUrl: './blueprint-detail.component.html',
  styleUrls: ['./blueprint-detail.component.scss'],
})
export class BlueprintDetailComponent implements OnInit {
  id: string | null = '';
  detail: Blueprint | null = null;
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}
  current$ = this.store.pipe(select(blueprintSelectors.selectCurrent));

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.current$.subscribe((data) => {
      this.detail = data;
    });
    this.store.dispatch(
      blueprintActions.getFullBlueprint({ payload: this.id as string })
    );
  }
}
