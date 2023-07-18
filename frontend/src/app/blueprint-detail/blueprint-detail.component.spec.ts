import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintDetailComponent } from './blueprint-detail.component';

describe('BlueprintDetailComponent', () => {
  let component: BlueprintDetailComponent;
  let fixture: ComponentFixture<BlueprintDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlueprintDetailComponent]
    });
    fixture = TestBed.createComponent(BlueprintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
