import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookmarkService, Bookmark } from '../../services/bookmark.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  bookmark: Bookmark | null = null;

  constructor(private route: ActivatedRoute, private bookmarkService: BookmarkService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookmark = this.bookmarkService.getListOfBookmarks().find(b => b.id === id) ?? null;
  }
}
