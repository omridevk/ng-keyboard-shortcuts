import { TestBed } from '@angular/core/testing';

import { ShortcutSelectService } from './shortcut-select.service';

describe('ShortcutSelectService', () => {
  let service: ShortcutSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortcutSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
