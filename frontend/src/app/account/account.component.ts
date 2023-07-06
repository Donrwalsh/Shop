import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Account } from './account.model';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  accountForm = this.formBuilder.group({
    level: '',
    xp: '',
    furnitureSlots: '',
  });

  levelData: any;
  slotsData: any;

  minLevel: number = 0;
  maxLevel: number = 0;
  xpToNextLevel: number = 0;
  minFurnitureSlots: number = 0;
  maxFurnitureSlots: number = 0;

  ngOnInit() {
    this.dataService.getAccount().subscribe((data) => {
      this.accountForm.controls.level.setValue(
        (data as Account).level.toString()
      );
      this.accountForm.controls.xp.setValue((data as Account).xp.toString());
      this.accountForm.controls.furnitureSlots.setValue(
        (data as Account).furnitureSlots.toString()
      );
    });

    this.dataService.getShopExpansionSlots().subscribe((data) => {
      this.slotsData = data;
      this.maxFurnitureSlots = Math.max(
        ...this.slotsData.map((slotData: any) => slotData.stats.capacity)
      );
      this.minFurnitureSlots = Math.min(
        ...this.slotsData.map((slotData: any) => slotData.stats.capacity)
      );
      this.accountForm.controls.furnitureSlots.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.min(this.minFurnitureSlots),
        Validators.max(this.maxFurnitureSlots),
      ]);
      this.accountForm.controls.furnitureSlots.updateValueAndValidity();
    });

    this.dataService.getLevels().subscribe((data) => {
      this.levelData = (data as any).levelData;
      this.minLevel = Math.min(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
      this.maxLevel = Math.max(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
      this.accountForm.controls.level.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.min(this.minLevel),
        Validators.max(this.maxLevel),
        Validators.required,
      ]);
      this.accountForm.controls.level.updateValueAndValidity();
    });

    this.accountForm.controls.level.valueChanges.subscribe((x) => {
      if (this.accountForm.controls.level.valid) {
        this.xpToNextLevel = this.levelData?.filter(
          (data: any) => data.level == x
        )[0].upgrade.xpNeeded;

        this.accountForm.controls.xp.setValidators([
          Validators.pattern('^[-,0-9]+$'),
          Validators.min(0),
          Validators.max(this.xpToNextLevel),
          Validators.required,
        ]);
        this.accountForm.controls.xp.updateValueAndValidity();
      }
    });
  }

  expValueAsNumber() {
    return this.accountForm.controls.xp.value
      ? parseInt(this.accountForm.controls.xp.value.replace(/,/g, ''), 10)
      : 0;
  }

  readableXpToNextLevel() {
    return this.xpToNextLevel == 0
      ? '???'
      : new Intl.NumberFormat().format(this.xpToNextLevel);
  }

  save() {
    console.log('save');
    console.log(this.accountForm.value);
  }

  getInterestingFactOne() {
    let nullSafeLevel = parseInt(this.accountForm.value.level || '0');
    let nullSafeXp = parseInt(this.accountForm.value.xp || '0');
    let output = '';
    if (nullSafeLevel) {
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
    if (nullSafeLevel) {
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
}
