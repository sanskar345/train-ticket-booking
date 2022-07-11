import { TestBed } from '@angular/core/testing';

import { BookedGuard } from './booked.guard';

describe('BookedGuard', () => {
  let guard: BookedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BookedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
