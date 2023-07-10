import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Account } from '../models/account.model';
import { Store, select } from '@ngrx/store';
import * as accountSelectors from '../state/account/account.selectors';
import * as dataSelectors from '../state/data/data.selectors';
import { AppState } from '../state/app.state';
import {
  combineLatest,
  take,
  map,
  tap,
  firstValueFrom,
  Subscription,
  merge,
} from 'rxjs';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {}

  accountForm = this.formBuilder.group({
    level: '',
    xp: '',
    furnitureSlots: '',

    counter: '',
    hoard: '',

    trunkArray: this.formBuilder.array([]),
  });

  // trunkSub: Subscription;
  trunkSub: any;

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
    // { type: 'Counter', level: '2' },
    // { type: 'Trunk', level: '20' },
    // { type: 'Trunk', level: '20' },
    // { type: 'Trunk', level: '20' },
    // { type: 'Trunk', level: '20' },
    // { type: 'Table', level: '15' },
    // { type: "Dragon's Hoard", level: '20' },
  ] as any;
  columns = [
    { name: 'Type' },
    { name: 'Level' },
    { name: 'Size' },
    { name: 'Storage' },
    { name: 'Energy' },
    { name: 'Upgrade Cost' },
    { name: 'Upgrade Time' },
  ];

  async ngOnInit() {
    this.accountForm.controls.level.valueChanges.subscribe(async (x) => {
      if (this.accountForm.controls.level.valid) {
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

    this.store
      .pipe(select(accountSelectors.selectMyAccount))
      .subscribe(async (account) => {
        if (account) {
          this.accountForm.controls.level.setValue(account.level.toString());
          this.accountForm.controls.xp.setValue(account.xp.toString());
          this.accountForm.controls.furnitureSlots.setValue(
            account.furnitureSlots.toString()
          );

          // this.rows = [];

          this.accountForm.controls.counter.valueChanges.subscribe(
            async (value) => {
              await this.updateFurnitureRowValue('Counter', +value!);
            }
          );
          this.accountForm.controls.counter.setValue(
            account.furniture.counter.toString()
          );

          this.accountForm.controls.hoard.valueChanges.subscribe(
            async (value) => {
              await this.updateFurnitureRowValue("Dragon's Hoard Bin", +value!);
            }
          );
          this.accountForm.controls.hoard.setValue(
            account.furniture.hoard.toString()
          );

          this.trunkSub = await this.trunkListenerSubscribe();

          account.furniture.trunks.forEach(async (trunkLevel, index) => {
            await this.pushTrunk(index, trunkLevel!);
          });
        }
      });
  }

  async pushTrunk(index: number, level: number) {
    const trunks = this.accountForm.get('trunkArray') as FormArray;

    console.log('pushTrunk', index, level);

    let fg = this.formBuilder.group({
      index: index,
      level: level,
    });
    fg.controls.level.valueChanges.subscribe(async (val) => {
      console.log('potato');
      await this.updateFurnitureRowValue('Trunk', +val!, +index!);
    });
    await this.updateFurnitureRowValue('Trunk', +level!, +index!);

    if (trunks.length <= index) {
      trunks.push(fg);
    }
  }

  async trunkListenerSubscribe() {
    merge(
      ...this.accountForm.controls.trunkArray.controls.map(
        (control: AbstractControl, index: number) =>
          control.valueChanges.pipe(
            map((value) => ({ rowIndex: index, value }))
          )
      )
    ).subscribe((changes) => {
      console.log(changes);
    });
    // this.accountForm.controls.trunkArray.valueChanges.subscribe(
    //   async (value) => {
    //     console.log('trunkListenerSubscribe', value);
    //     for await (const val of value) {
    //       await this.updateFurnitureRowValue(
    //         'Trunk',
    //         +(val as any).level!,
    //         +(val as any).index!
    //       );
    //     }
    //     // this.updateFurnitureRowValue('Trunk', +value!);
    //   }
    // );
  }

  async addTrunk() {
    if (this.accountForm.controls.trunkArray.value.length < 5) {
      let trunkLevels = [
        ...this.accountForm.controls.trunkArray.value.map(
          (thing: any) => thing.level
        ),
        1,
      ];

      console.log(trunkLevels);

      this.accountForm.controls.trunkArray = this.formBuilder.array([]);

      trunkLevels.forEach(async (trunkLevel, index) => {
        console.log(index);
        (this.accountForm.controls.trunkArray as FormArray).removeAt(index);
        this.rows = [...this.rows.filter((row: any) => row.type !== 'Trunk')];
        await this.pushTrunk(index, trunkLevel!);
      });

      // console.log(
      //   this.accountForm.controls.trunkArray.value.map(
      //     (thing: any) => thing.level
      //   )
      // );
      // await this.pushTrunk(
      //   this.accountForm.controls.trunkArray.value.length,
      //   1
      // );
      // this.rows = [...this.rows];
    }

    // console.log(this.accountForm.value);
    // console.log('add trunk');
    // console.log(this.rows);
    // this.cdr.detectChanges();
  }

  expValueAsNumber() {
    return this.accountForm.controls.xp.value
      ? parseInt(this.accountForm.controls.xp.value.replace(/,/g, ''), 10)
      : 0;
  }

  readableXpToNextLevel() {
    return this.xpTNL == 0 ? '???' : new Intl.NumberFormat().format(this.xpTNL);
  }

  async updateFurnitureRowValue(
    type: string,
    level: number,
    designation?: number
  ) {
    let newRow = await this.buildRow(type, level, designation);

    let matchFound = this.rows.find(
      (row: any) => row.type === type && row.designation === designation
    );

    if (matchFound) {
      this.rows = [
        ...this.rows.map((row: any) =>
          row.type === type && row.designation === designation ? newRow : row
        ),
      ];
    } else {
      this.rows = [newRow, ...this.rows];
    }

    // console.log(`updateFurnitureRowValue(${type}, ${level}, ${designation})`);
    // console.log(this.rows);
  }

  async buildRow(type: string, level: number, designation?: number) {
    let furnitureSource = await firstValueFrom(
      this.store.pipe(select(dataSelectors.selectFurnitureEntry(type, level)))
    );
    let row: any = {
      type: type,
      level: level.toString(),
      size: furnitureSource?.stats.size,
      hoardStorage: furnitureSource?.stats.hoardStorage,
      storage: furnitureSource?.stats.storage,
      energy: furnitureSource?.stats.energy,
      upgradeGold: furnitureSource?.upgrade?.goldCost,
      upgradeDragonMarks: furnitureSource?.upgrade?.dragonMarks,
      upgradeTime: this.secondsToReadableTime(
        furnitureSource?.upgrade?.upgradeTimeInSeconds
      ),
      designation: designation,
    };
    return row;
  }

  async save() {
    console.log(this.accountForm.value);
    console.log(this.rows);
    let dbStructure = {
      ...this.accountForm.value,
      trunks: this.accountForm.value.trunkArray?.map((trunkFG: any) => {
        return trunkFG.level;
      }),
    };
    delete dbStructure.trunkArray;

    this.rows = [...this.rows];

    // this.store.dispatch(accountActions.saveMyAccount)
  }

  formatNumber(num: number) {
    return new Intl.NumberFormat().format(num);
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

  typeMap(type: string) {
    if (type === "Dragon's Hoard Bin") {
      return 'hoard';
    } else {
      return type.toLowerCase();
    }
  }

  getFurnitureImage(type: string, level: string) {
    if (parseInt(level) < 6) {
      return `assets/furniture/${this.typeMap(type)}1.png`;
    } else if (parseInt(level) < 11) {
      return `assets/furniture/${this.typeMap(type)}2.png`;
    } else {
      return `assets/furniture/${this.typeMap(type)}3.png`;
    }
  }

  secondsToReadableTime(totalSeconds: number | undefined): string {
    let output = '';
    if (totalSeconds != undefined) {
      let days = Math.floor(totalSeconds / 86400);
      if (days > 0) {
        output += days + ' day' + (days > 1 ? 's' : '');
      }

      let hours = Math.floor((totalSeconds - days * 86400) / 3600);
      if (hours > 0) {
        output +=
          (days > 0 ? ', ' : '') + hours + ' hour' + (hours > 1 ? 's' : '');
      }

      let minutes = Math.floor(
        (totalSeconds - days * 86400 - hours * 3600) / 60
      );
      if (minutes > 0) {
        output +=
          hours > 0 || days > 0
            ? ', '
            : '' + minutes + ' minute' + (minutes > 1 ? 's' : '');
      }

      let seconds = totalSeconds - days * 86400 - hours * 3600 - minutes * 60;
      if (seconds > 0) {
        output +=
          minutes > 0 || hours > 0 || days > 0
            ? ', '
            : '' + seconds + ' second' + (seconds > 1 ? 's' : '');
      }
    }
    return output;
  }
}
