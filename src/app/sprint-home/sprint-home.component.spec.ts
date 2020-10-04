import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintHomeComponent } from './sprint-home.component';

describe('SprintHomeComponent', () => {
  let component: SprintHomeComponent;
  let fixture: ComponentFixture<SprintHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
