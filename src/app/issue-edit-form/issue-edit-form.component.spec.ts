import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueEditFormComponent } from './issue-edit-form.component';

describe('IssueEditFormComponent', () => {
  let component: IssueEditFormComponent;
  let fixture: ComponentFixture<IssueEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueEditFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
