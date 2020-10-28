import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBacklogFormComponent } from './product-backlog-form.component';

describe('ProductBacklogFormComponent', () => {
  let component: ProductBacklogFormComponent;
  let fixture: ComponentFixture<ProductBacklogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBacklogFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBacklogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
