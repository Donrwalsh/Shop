import { Component } from '@angular/core';
import { DataService } from './data.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  rateControl: FormControl;

  rateInput: any;

  levels: any;
  constructor(private dataService: DataService) {
    this.levels = [];
    this.rateControl = new FormControl('', [
      Validators.max(100),
      Validators.min(0),
    ]);
  }
  range: string = '';

  account = {
    level: null,
  };

  ngOnInit() {}

  getInterestingFactOne(level: number | null) {
    let output = '';
    if (level) {
      output =
        new Intl.NumberFormat().format(
          this.levels.levelData
            .filter((levelData: any) => levelData.level >= level)
            .map((levelData: any) => levelData?.upgrade?.xpNeeded || 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            )
        ) + ' xp to max level';
    }
    return output;
  }

  getInterestingFactTwo(level: number | null) {
    let output = '';
    if (level) {
      output =
        (1 -
          this.levels.levelData
            .filter((levelData: any) => levelData.level >= level)
            .map((levelData: any) => levelData?.upgrade?.xpNeeded || 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            ) /
            this.levels.levelData
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
