import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatGridCardComponent } from './stat-grid-card.component';

describe('StatGridCardComponent', () => {
  let component: StatGridCardComponent;
  let fixture: ComponentFixture<StatGridCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatGridCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatGridCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
