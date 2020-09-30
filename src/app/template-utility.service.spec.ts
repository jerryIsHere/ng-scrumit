import { TestBed } from '@angular/core/testing';

import { TemplateUtilityService } from './template-utility.service';

describe('TemplateUtilityService', () => {
  let service: TemplateUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
