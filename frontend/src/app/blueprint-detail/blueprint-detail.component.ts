import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-blueprint-detail',
  templateUrl: './blueprint-detail.component.html',
  styleUrls: ['./blueprint-detail.component.scss'],
})
export class BlueprintDetailComponent implements OnInit {
  id: string | null = '';
  constructor(private route: ActivatedRoute) {}
  uri = 'localhost:4200/blueprint/${this.id}';
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
