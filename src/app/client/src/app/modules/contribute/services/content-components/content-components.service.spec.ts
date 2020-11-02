import { TestBed } from '@angular/core/testing';

import { ContentComponentsService } from './content-components.service';

describe('ContentComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentComponentsService = TestBed.get(ContentComponentsService);
    expect(service).toBeTruthy();
  });
});
