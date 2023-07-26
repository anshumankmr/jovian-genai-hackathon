import { TestBed } from '@angular/core/testing';

import { ApiurlsService } from './api-urls.service';

describe('ApiUrlsService', () => {
  let service: ApiurlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiurlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
