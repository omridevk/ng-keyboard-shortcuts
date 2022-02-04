import { TestBed } from '@angular/core/testing';

import { ShortcutHelpService } from './shortcut-help.service';

describe('ShortcutHelpService', () => {
  let service: ShortcutHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortcutHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
