import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookmarkService, Bookmark } from '../../services/bookmark.service';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

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
    MatCardContent,
    MatCardActions,
    MatIcon
  ],
})
export class ResultComponent {
  bookmark: Bookmark | null = null;
  BookmarkService: BookmarkService | null = null;
  showThankYou = false;
  tags = [];
  description: string | null = null;
  title: string | null = null;
  articleText: string | null = null;
  mainImage: string | null = null;

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
          this.articleText = data.articleText;
          this.mainImage = data.mainImage;
        },
        error: (err) => {
          console.error('Scrape failed', err);
          this.title = null;
          this.description = "Could not fetch description.";
          this.articleText = "Could not fetch page contents.";
        }
      });
    }
  }
}
