import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  levels: any;
  constructor(private dataService: DataService) {
    this.levels = [];
  }
  range: string = '';

  ngOnInit() {
    this.dataService.getLevels().subscribe((data) => {
      console.log(data);
      this.levels = data as any;
      console.log(
        Math.max(this.levels.levelData.map((levelData: any) => levelData.level))
      );
      this.range = `${Math.min(
        ...this.levels.levelData.map((levelData: any) => levelData.level)
      )}-${Math.max(
        ...this.levels.levelData.map((levelData: any) => levelData.level)
      )}`;
    });
  }
}
