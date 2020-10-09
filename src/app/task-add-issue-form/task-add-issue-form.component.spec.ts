import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddIssueFormComponent } from './task-add-issue-form.component';

describe('TaskAddIssueFormComponent', () => {
  let component: TaskAddIssueFormComponent;
  let fixture: ComponentFixture<TaskAddIssueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAddIssueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAddIssueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
