import { TestBed } from '@angular/core/testing';

import { Prompt } from './prompt';

describe('Prompt', () => {
  let service: Prompt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prompt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
