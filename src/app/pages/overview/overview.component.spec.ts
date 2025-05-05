import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OverviewComponent } from './overview.component';
import { BookmarkService } from '../../services/bookmark.service';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let bookmarkServiceSpy: jasmine.SpyObj<BookmarkService>;

  beforeEach(async () => {
    // Create spy object for BookmarkService with stubbed methods
    bookmarkServiceSpy = jasmine.createSpyObj('BookmarkService', [
      'addBookmark',
      'deleteBookmark',
      'getListOfBookmarks',
      'getTotalPages'
    ]);

    bookmarkServiceSpy.getListOfBookmarks.and.returnValue([]);
    bookmarkServiceSpy.getTotalPages.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [
        OverviewComponent,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: BookmarkService, useValue: bookmarkServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the form with URL input and submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input#url');
    const button = compiled.querySelector('button[type="submit"]');

    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('should add a valid bookmark and reset the form', () => {
    const testBookmark = {
      id: '123',
      url: 'https://example.com',
      createdAt: Date.now()
    };

    bookmarkServiceSpy.addBookmark.and.returnValue(testBookmark);
    bookmarkServiceSpy.getListOfBookmarks.and.returnValue([testBookmark]);
    bookmarkServiceSpy.getTotalPages.and.returnValue(1);

    component.bookmarkForm.setValue({ url: testBookmark.url });
    expect(component.bookmarkForm.valid).toBeTrue();

    component.onSubmit();

    expect(bookmarkServiceSpy.addBookmark).toHaveBeenCalledWith(testBookmark.url);
    expect(component.bookmarkForm.value.url).toBeNull();
    expect(component.bookmarks.length).toBe(1);
  });

  it('should delete a bookmark and refresh the list', () => {
    const testBookmark = {
      id: 'abc123',
      url: 'https://example.com',
      createdAt: Date.now()
    };

    bookmarkServiceSpy.getListOfBookmarks.and.returnValue([testBookmark]);
    bookmarkServiceSpy.getTotalPages.and.returnValue(1);
    bookmarkServiceSpy.deleteBookmark.and.callFake(() => {
      bookmarkServiceSpy.getListOfBookmarks.and.returnValue([]);
    });

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.bookmarks.length).toBe(1);

    component.deleteBookmark(testBookmark.id);
    fixture.detectChanges();

    expect(bookmarkServiceSpy.deleteBookmark).toHaveBeenCalledWith(testBookmark.id);
    expect(component.bookmarks.length).toBe(0);
  });
});
