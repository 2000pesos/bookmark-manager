import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { Router } from '@angular/router';

import { BookmarkService, Bookmark } from '../../services/bookmark.service';

@Component({
  standalone: true,
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})

export class OverviewComponent implements OnInit {
  bookmarkForm!: FormGroup;
  bookmarks: Bookmark[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  readonly PER_PAGE = 20;

  constructor(
    private fb: FormBuilder,
    private bookmarkService: BookmarkService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.bookmarkForm = this.fb.group({
      url: ['', [Validators.required, this.urlValidator]]
    });

    this.loadBookmarks();
  }

  public onSubmit(): void {
    if (this.bookmarkForm.valid) {
      const url = this.bookmarkForm.value.url;
      const saved = this.bookmarkService.addBookmark(url);
      this.bookmarkForm.reset();
      this.loadBookmarks();
      this.router.navigate(['/result'], {
        state: { submitted: saved }
      });
    }
  }

  public changePage(page: number): void {
    this.currentPage = page;
    this.loadBookmarks();
  }

  public deleteBookmark(id: string): void {
    this.bookmarkService.deleteBookmark(id);
    this.loadBookmarks();
  }

  private loadBookmarks(): void {
    this.bookmarks = this.bookmarkService.getListOfBookmarks(this.currentPage, this.PER_PAGE);
    this.totalPages = this.bookmarkService.getTotalPages(this.PER_PAGE);
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }
}
