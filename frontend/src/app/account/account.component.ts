import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, Validators } from '@angular/forms';
import { Account } from './account.model';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(private dataService: DataService) {}

  levelControl = new FormControl('');
  expControl = new FormControl('');
  furnitureControl = new FormControl('');

  levelData: any;
  slotsData: any;

  minLevel: number = 0;
  maxLevel: number = 0;
  xpToNextLevel: number = 0;

  ngOnInit() {
    this.dataService.getAccount().subscribe((data) => {
      this.levelControl.setValue((data as Account).level.toString());
      this.expControl.setValue((data as Account).exp.toString());
      this.furnitureControl.setValue(
        (data as Account).furnitureSlots.toString()
      );
    });

    this.dataService.getShopExpansionSlots().subscribe((data) => {
      this.slotsData = data;
      this.furnitureControl.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.min(0),
        Validators.max(
          Math.max(
            ...this.slotsData.map((slotData: any) => slotData.stats.capacity)
          )
        ),
      ]);
      this.furnitureControl.updateValueAndValidity();
    });

    this.dataService.getLevels().subscribe((data) => {
      this.levelData = (data as any).levelData;
      this.minLevel = Math.min(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
      this.maxLevel = Math.max(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
      this.levelControl.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.min(this.minLevel),
        Validators.max(this.maxLevel),
        Validators.required,
      ]);
      this.levelControl.updateValueAndValidity();
    });

    this.levelControl.valueChanges.subscribe((x) => {
      if (this.levelControl.valid) {
        this.xpToNextLevel = this.levelData?.filter(
          (data: any) => data.level == x
        )[0].upgrade.xpNeeded;

        this.expControl.setValidators([
          Validators.pattern('^[-,0-9]+$'),
          Validators.min(0),
          Validators.max(this.xpToNextLevel),
          Validators.required,
        ]);
        this.expControl.updateValueAndValidity();
      }
    });
  }

  expValueAsNumber() {
    return this.expControl.value
      ? parseInt(this.expControl.value.replace(/,/g, ''), 10)
      : 0;
  }

  readableXpToNextLevel() {
    return this.xpToNextLevel == 0
      ? '???'
      : new Intl.NumberFormat().format(this.xpToNextLevel);
  }
}
