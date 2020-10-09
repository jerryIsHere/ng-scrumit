import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeveloperFormComponent } from './task-developer-form.component';

describe('TaskDeveloperFormComponent', () => {
  let component: TaskDeveloperFormComponent;
  let fixture: ComponentFixture<TaskDeveloperFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDeveloperFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDeveloperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
