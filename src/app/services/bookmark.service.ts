// bookmark.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Bookmark {
  id: string;
  url: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private http: HttpClient) {}
  private static readonly STORAGE_KEY = 'bookmarks';

  public fetchMetadata(url: string) {
    const encoded = encodeURIComponent(url);
    return this.http.get<{ title: string; description: string }>(
      `http://localhost:3400/api/scrape?url=${encoded}`
    );
  }
  
  public getListOfBookmarks(page?: number, perPage: number = 20): Bookmark[] {
    const bookmarks = this.getBookmarks();

    if (typeof page === 'number' && page > 0) {
      const start = (page - 1) * perPage;
      return bookmarks.slice(start, start + perPage);
    }

    return bookmarks;
  }

  public addBookmark(url: string): Bookmark {
    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      url,
      createdAt: Date.now(),
    };
    const bookmarks = this.getBookmarks();
    bookmarks.push(newBookmark);
    this.saveBookmarks(bookmarks);
    return newBookmark;
  }

  public deleteBookmark(id: string): void {
    const filtered = this.getBookmarks().filter(b => b.id !== id);
    this.saveBookmarks(filtered);
  }

  public updateBookmark(id: string, newUrl: string): void {
    const bookmarks = this.getBookmarks().map(b =>
      b.id === id ? { ...b, url: newUrl } : b
    );
    this.saveBookmarks(bookmarks);
  }

  public getTotalPages(perPage: number = 20): number {
    return Math.ceil(this.getBookmarks().length / perPage);
  }

  private getBookmarks(): Bookmark[] {
    const raw = localStorage.getItem(BookmarkService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  
  private saveBookmarks(bookmarks: Bookmark[]): void {
    localStorage.setItem(BookmarkService.STORAGE_KEY, JSON.stringify(bookmarks));
  }
}
