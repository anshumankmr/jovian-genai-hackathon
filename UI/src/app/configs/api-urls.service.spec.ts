import { TestBed } from '@angular/core/testing';

import { ApiUrlsService } from './api-urls.service';

describe('ApiUrlsService', () => {
  let service: ApiUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
