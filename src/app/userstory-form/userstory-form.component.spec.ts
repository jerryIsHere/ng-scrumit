import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstoryFormComponent } from './userstory-form.component';

describe('UserstoryFormComponent', () => {
  let component: UserstoryFormComponent;
  let fixture: ComponentFixture<UserstoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserstoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
