import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Bookmark {
  id: string;
  url: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private static readonly STORAGE_KEY = 'bookmarks';

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches metadata (title, description, etc.) from a remote scraper function.
   */
  public fetchMetadata(url: string) {
    const encoded = encodeURIComponent(url);
    return this.http.get<{
      title: string;
      description: string;
      articleText: string;
      mainImage: string;
    }>(`/.netlify/functions/scrape-article?url=${encoded}`);
  }

  /**
   * Retrieves bookmarks, paginated if page number is provided.
   */
  public getListOfBookmarks(page?: number, perPage = 20): Bookmark[] {
    const bookmarks = this.getBookmarks();

    if (typeof page === 'number' && page > 0) {
      const start = (page - 1) * perPage;
      return bookmarks.slice(start, start + perPage);
    }

    return bookmarks;
  }

  /**
   * Adds a new bookmark and returns the saved object.
   */
  public addBookmark(url: string): Bookmark {
    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      url,
      createdAt: Date.now()
    };

    const bookmarks = this.getBookmarks();
    bookmarks.push(newBookmark);
    this.saveBookmarks(bookmarks);

    return newBookmark;
  }

  /**
   * Deletes a bookmark by ID.
   */
  public deleteBookmark(id: string): void {
    const updated = this.getBookmarks().filter((b) => b.id !== id);
    this.saveBookmarks(updated);
  }

  /**
   * Updates a bookmark URL by ID.
   */
  public updateBookmark(id: string, newUrl: string): void {
    const updated = this.getBookmarks().map((b) =>
      b.id === id ? { ...b, url: newUrl } : b
    );
    this.saveBookmarks(updated);
  }

  /**
   * Calculates the number of total pages based on bookmarks stored.
   */
  public getTotalPages(perPage = 20): number {
    return Math.ceil(this.getBookmarks().length / perPage);
  }

  /**
   * Reads bookmarks from localStorage.
   */
  private getBookmarks(): Bookmark[] {
    const raw = localStorage.getItem(BookmarkService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Persists bookmarks to localStorage.
   */
  private saveBookmarks(bookmarks: Bookmark[]): void {
    localStorage.setItem(
      BookmarkService.STORAGE_KEY,
      JSON.stringify(bookmarks)
    );
  }
}
