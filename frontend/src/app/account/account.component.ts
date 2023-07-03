import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl } from '@angular/forms';
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

  levelData: any;
  minLevel: number = 0;
  maxLevel: number = 0;

  ngOnInit() {
    this.dataService.getAccount().subscribe((data) => {
      this.levelControl.setValue((data as Account).level.toString());
      this.expControl.setValue((data as Account).exp.toString());
    });

    this.dataService.getLevels().subscribe((data) => {
      this.levelData = (data as any).levelData;
      this.minLevel = Math.min(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
      this.maxLevel = Math.max(
        ...(data as any).levelData.map((levelData: any) => levelData.level)
      );
    });
  }

  xpToNextLevel() {
    return new Intl.NumberFormat().format(
      this.levelData?.filter(
        (data: any) => data.level == this.levelControl.value
      )[0].upgrade.xpNeeded
    );
  }
}
