import { TestBed } from '@angular/core/testing';

import { BookmarkService, Bookmark } from './bookmark.service';

describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkService);
  });

  it('should add a bookmark and return it with an id', () => {
    const url = 'https://test.com';
    const bookmark = service.addBookmark(url);

    expect(bookmark.url).toBe(url);
    expect(bookmark.id).toBeTruthy();

    const all = service.getListOfBookmarks();
    expect(all.length).toBe(1);
    expect(all[0].url).toBe(url);
  });

  it('should paginate results correctly', () => {
    for (let i = 0; i < 25; i++) {
      service.addBookmark(`https://example.com/${i}`);
    }

    const page1 = service.getListOfBookmarks(1, 10);
    const page3 = service.getListOfBookmarks(3, 10);

    expect(page1.length).toBe(10);
    expect(page3.length).toBe(5); // 25 total, page 3 = 5 remaining
  });

  it('should calculate total pages correctly', () => {
    for (let i = 0; i < 33; i++) {
      service.addBookmark(`https://page.com/${i}`);
    }

    expect(service.getTotalPages(10)).toBe(4); // 33 / 10 = 3.3 → round up
    expect(service.getTotalPages(20)).toBe(2);
  });

  it('should delete a bookmark by id', () => {
    const b1 = service.addBookmark('https://one.com');
    const b2 = service.addBookmark('https://two.com');

    service.deleteBookmark(b1.id);

    const all = service.getListOfBookmarks();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(b2.id);
  });
});
