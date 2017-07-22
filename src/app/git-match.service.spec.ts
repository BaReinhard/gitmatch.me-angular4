import { TestBed, inject } from '@angular/core/testing';

import { GitMatchService } from './git-match.service';

describe('GitMatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitMatchService]
    });
  });

  it('should be created', inject([GitMatchService], (service: GitMatchService) => {
    expect(service).toBeTruthy();
  }));
});
