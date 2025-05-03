import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  showThankYou = false;

  constructor(private route: ActivatedRoute, private router: Router, private bookmarkService: BookmarkService) {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id in commponenet', id)
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    console.log('navstate', navState);
    this.bookmark = this.bookmarkService.getListOfBookmarks().find(b => b.id === id) ?? null;
    console.log('this.bookmark', this.bookmark);
    this.showThankYou = !!navState?.['submitted'];
  }
}
