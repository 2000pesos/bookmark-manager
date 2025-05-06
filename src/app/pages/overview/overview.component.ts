import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BookmarkService, Bookmark } from '../../services/bookmark.service';

// Angular Material component imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatList,
    MatListItem,
    MatIcon,
    MatTooltip
  ]
})
export class OverviewComponent implements OnInit {
  // Max number of bookmarks to show per page
  readonly PER_PAGE = 20;

  // Reactive form for bookmark input
  public bookmarkForm!: FormGroup;

  // Current bookmarks and pagination state
  public bookmarks: Bookmark[] = [];
  public currentPage = 1;
  public totalPages = 1;

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookmarkService: BookmarkService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  // Initialize form and load page data
  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.currentPage = parseInt(params.get('page') || '1', 10);
      this.loadBookmarks();
    });

    this.bookmarkForm = this.fb.group({
      url: ['', [Validators.required, this.urlValidator]]
    });

    this.loadBookmarks();
  }

  // Handles form submission
  public onSubmit(): void {
    if (!this.bookmarkForm.valid) return;

    const url = this.bookmarkForm.value.url;
    const saved = this.bookmarkService.addBookmark(url);

    this.bookmarkForm.reset();
    this.loadBookmarks();

    // Redirect to result page with newly added bookmark
    this.router.navigate(['/result', saved.id], {
      state: { submitted: saved }
    });
  }

  // Navigate to selected pagination page
  public changePage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  // Remove a bookmark and refresh list
  public deleteBookmark(id: string): void {
    this.bookmarkService.deleteBookmark(id);
    this.loadBookmarks();
  }

  // Navigate to details view for a specific bookmark
  public viewBookmarkDetails(id: string): void {
    this.router.navigate(['/result', id]);
  }

  // Fetch current page's bookmarks and total page count
  private loadBookmarks(): void {
    this.bookmarks = this.bookmarkService.getListOfBookmarks(
      this.currentPage,
      this.PER_PAGE
    );
    this.totalPages = this.bookmarkService.getTotalPages(this.PER_PAGE);

    if (this.currentPage > this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.totalPages },
        queryParamsHandling: 'merge'
      });
    }
  }

  // Custom validator to check for valid URLs
  private urlValidator(control: AbstractControl): ValidationErrors | null {
    const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    
    const value = control.value?.trim();

    if (!value || !urlRegex.test(value)) {
      return { invalidUrl: true };
    }

    return null;
  }
}
