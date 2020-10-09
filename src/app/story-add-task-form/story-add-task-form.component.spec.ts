import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryAddTaskFormComponent } from './story-add-task-form.component';

describe('StoryAddTaskFormComponent', () => {
  let component: StoryAddTaskFormComponent;
  let fixture: ComponentFixture<StoryAddTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryAddTaskFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryAddTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
