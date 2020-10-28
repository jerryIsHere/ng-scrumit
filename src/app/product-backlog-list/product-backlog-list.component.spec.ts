import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBacklogListComponent } from './product-backlog-list.component';

describe('ProductBacklogListComponent', () => {
  let component: ProductBacklogListComponent;
  let fixture: ComponentFixture<ProductBacklogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBacklogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBacklogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
