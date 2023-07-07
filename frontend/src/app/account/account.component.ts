import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Account } from './account.model';
import { Store, select } from '@ngrx/store';
import * as dataSelectors from '../state/data/data.selectors';
import { AppState } from '../state/app.state';
import { combineLatest, take, map, tap, firstValueFrom } from 'rxjs';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  accountForm = this.formBuilder.group({
    level: '',
    xp: '',
    furnitureSlots: '',
  });

  levelData: any;

  minLevel: number = 0;
  maxLevel: number = 0;
  xpTNL: number = 0;
  minFurnitureSlots: number = 0;
  maxFurnitureSlots: number = 0;

  // Id here too, but not shown on table
  // TODO: Get access into furniture data and show other details about the furniture on this table.
  // TODO: Expand table with the ability to add new data.
  rows = [
    { type: 'Counter', level: '2' },
    { type: 'Trunk', level: '20' },
    { type: 'Trunk', level: '20' },
    { type: 'Trunk', level: '20' },
    { type: 'Trunk', level: '20' },
    { type: 'Table', level: '15' },
    { type: "Dragon's Hoard", level: '20' },
  ];
  columns = [{ name: 'Type' }, { name: 'Level' }];

  async ngOnInit() {
    this.accountForm.controls.level.valueChanges.subscribe(async (x) => {
      if (this.accountForm.controls.level.valid && x != '') {
        console.log(this.accountForm.value);
        console.log(x);
        this.xpTNL = await firstValueFrom(
          this.store.pipe(select(dataSelectors.selectXpTNL(parseInt(x!))))
        );

        this.accountForm.controls.xp.setValidators([
          Validators.pattern('^[-,0-9]+$'),
          Validators.min(0),
          Validators.max(this.xpTNL),
          Validators.required,
        ]);
        this.accountForm.controls.xp.updateValueAndValidity();
      }
    });

    combineLatest([
      this.store.pipe(select(dataSelectors.selectMinFurnitureSlots)),
      this.store.pipe(select(dataSelectors.selectMaxFurnitureSlots)),
    ]).subscribe(([min, max]) => {
      // if (Math.abs(min) !== Infinity && Math.abs(max) !== Infinity) {
      this.minFurnitureSlots = min;
      this.maxFurnitureSlots = max;

      this.accountForm.controls.furnitureSlots.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.min(this.minFurnitureSlots),
        Validators.max(this.maxFurnitureSlots),
      ]);
      this.accountForm.controls.furnitureSlots.updateValueAndValidity();
      // }
    });

    combineLatest([
      this.store.pipe(select(dataSelectors.selectMinLevel)),
      this.store.pipe(select(dataSelectors.selectMaxLevel)),
    ]).subscribe(([min, max]) => {
      this.minLevel = min;
      this.maxLevel = max;

      this.accountForm.controls.level.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.min(this.minLevel),
        Validators.max(this.maxLevel),
        Validators.required,
      ]);
      this.accountForm.controls.level.updateValueAndValidity();
    });

    this.dataService.getAccount().subscribe((data) => {
      this.accountForm.controls.level.setValue(
        (data as Account).level.toString()
      );
      this.accountForm.controls.xp.setValue((data as Account).xp.toString());
      this.accountForm.controls.furnitureSlots.setValue(
        (data as Account).furnitureSlots.toString()
      );
    });
  }

  expValueAsNumber() {
    return this.accountForm.controls.xp.value
      ? parseInt(this.accountForm.controls.xp.value.replace(/,/g, ''), 10)
      : 0;
  }

  readableXpToNextLevel() {
    return this.xpTNL == 0 ? '???' : new Intl.NumberFormat().format(this.xpTNL);
  }

  save() {
    console.log('save');
    console.log(this.accountForm.value);
  }

  getInterestingFactOne() {
    let nullSafeLevel = parseInt(this.accountForm.value.level || '0');
    let nullSafeXp = parseInt(this.accountForm.value.xp || '0');
    let output = '';
    if (nullSafeLevel && this.levelData) {
      output =
        new Intl.NumberFormat().format(
          this.levelData
            .filter((levelData: any) => levelData.level >= nullSafeLevel)
            .map((levelData: any) => levelData?.upgrade?.xpNeeded || 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              nullSafeXp * -1
            )
        ) + ' xp to max level';
    }
    return output;
  }

  getInterestingFactTwo() {
    let nullSafeLevel = parseInt(this.accountForm.value.level || '0');
    let output = '';
    if (nullSafeLevel && this.levelData) {
      output =
        (1 -
          this.levelData
            .filter((levelData: any) => levelData.level >= nullSafeLevel)
            .map((levelData: any) => levelData?.upgrade?.xpNeeded || 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            ) /
            this.levelData
              .map((levelData: any) => levelData?.upgrade?.xpNeeded || 0)
              .reduce(
                (accumulator: number, currentValue: number) =>
                  accumulator + currentValue,
                0
              )) *
          100 +
        '% of the way to max';
    }
    return output;
  }

  getFurnitureImage(type: string, level: string) {
    switch (type) {
      case 'Counter':
        if (parseInt(level) < 6) {
          return 'assets/furniture/counters/counter1.png';
        } else if (parseInt(level) < 11) {
          return 'assets/furniture/counters/counter2.png';
        } else {
          return 'assets/furniture/counters/counter3.png';
        }
      default:
        return 'potato';
    }
  }
}
