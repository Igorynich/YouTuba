import { TestBed, async, inject } from '@angular/core/testing';

import { VideoResolver } from './video-resolver';

describe('VideoResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoResolver]
    });
  });

  it('should ...', inject([VideoResolver], (guard: VideoResolver) => {
    expect(guard).toBeTruthy();
  }));
});
