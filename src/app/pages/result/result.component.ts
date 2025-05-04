import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookmarkService, Bookmark } from '../../services/bookmark.service';
import { MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  imports: [
    CommonModule, 
    RouterModule,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions
  ],
})
export class ResultComponent {
  bookmark: Bookmark | null = null;
  BookmarkService: BookmarkService | null = null;
  showThankYou = false;
  tags = [];
  description: string | null = null;
  title: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private bookmarkService: BookmarkService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookmark = this.bookmarkService.getListOfBookmarks().find(b => b.id === id) ?? null;
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    this.showThankYou = !!navState?.['submitted'];

  }
  public ngOnInit(): void {
    if (this.bookmark?.url) {
      this.bookmarkService.fetchMetadata(this.bookmark.url).subscribe({
        next: (data) => {
          this.title = data.title;
          this.description = data.description;
        },
        error: (err) => {
          console.error('Scrape failed', err);
          this.title = "Could not fetch title.";
          this.description = "Could not fetch description";
        }
      });
    }
  }
}
