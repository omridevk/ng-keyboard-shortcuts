import { TestBed } from '@angular/core/testing';

import { ShortcutService } from './shortcut.service';

describe('ShortcutService', () => {
  let service: ShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
