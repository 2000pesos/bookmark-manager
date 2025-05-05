# 📚 Angular Bookmark Manager

This is a single-page Angular app that makes it simple to collect, view, and manage bookmarks with a lightweight design. Each saved link is enriched with metadata—like title, description, and article preview—using a serverless scraping function.

---

## ✨ Features

- Add and delete bookmarks through a clean, accessible UI
- Automatic metadata scraping via a Netlify function
- Form validation and inline error messaging
- Paginated bookmark list with smart navigation
- Material 3 styling with standalone Angular components

---

## 🧠 Technical Overview

This project uses the Angular CLI and is built with standalone components and TypeScript. It avoids unnecessary dependencies and frameworks, sticking to Angular’s native tooling and browser APIs where possible.

- **Storage:** Bookmarks are saved in `localStorage` for simplicity
- **Routing:** Angular Router is used for `/overview` and `/result/:id`
- **Architecture:** Component-first, with services encapsulating logic
- **Backend:** A single Netlify function (`scrape-article`) fetches and parses metadata on demand

---

## 🗂 File Structure

```
src/
  app/
    pages/
      overview/     → list and add bookmarks
      result/       → show metadata for one bookmark
    services/
      bookmark.service.ts
netlify/
  functions/
    scrape-article.js
```

---

## 📤 Data Flow

```
User submits URL → BookmarkService.addBookmark()
→ Redirects to Result page → fetchMetadata(url) via Netlify
→ ResultComponent shows scraped preview
```

---

## 🗃 Example Bookmark Object

```json
{
  "id": "c8b59...",
  "url": "https://example.com",
  "createdAt": 1710000000000
}
```

---

## 🔧 Technical Choices

- **Standalone Angular Components**  
  Used to reduce boilerplate and improve clarity. Routes and logic are colocated, which simplifies small apps like this.

- **BookmarkService**  
  Centralizes all logic related to bookmark creation, pagination, and storage. `localStorage` is used for persistence to avoid backend complexity.

- **Netlify Function (scrape-article.js)**  
  A simple serverless scraper that pulls in title, description, and article text. It uses Cheerio for lightweight DOM parsing and Axios for HTTP requests.

- **Directory Layout**  
  Pages and services are grouped by purpose. Each page is self-contained with its template, styles, and tests nearby.

---

## 🧪 Testing

- `BookmarkService` and `OverviewComponent` have unit tests in Jasmine.
- Tests cover:
  - Adding and deleting bookmarks
  - Pagination and storage behaviour
  - Basic UI structure and form validation

---

## ⚠️ Technical Limitations

- Data is only stored locally—no syncing or cloud persistence
- Scraping depends on target site structure and may fail silently
- Metadata is re-fetched on each detail view (not cached)
- No confirmation prompt before deletions
- No editing of existing bookmarks
- No mobile optimization or a11y review
- No rate limiting on metadata fetches

---

## 🌱 Stretch Goals

- Mark favourites and filter/sort by them
- Manual and automatic tagging (via NLP)
- Confirm before deleting bookmarks
- Export/import bookmark list (e.g. JSON format)
- Save scraped metadata at creation time
- Add edit functionality to update URLs or tags
- Grid view for visual previews
- Settings panel for sort options, page size, dark mode
- Accessibility improvements (ARIA roles, focus control)
- Drag-and-drop import for `.json` or `.html`
- Add E2E tests (e.g. Playwright or Cypress)

---
- ✅ Add timeout handling for metadata scraping (e.g. 5 seconds max with fallback message)

## 💻 Local Development

```bash
npm install
ng serve
```

Netlify scraping functions can be run locally using:

```bash
npm install -g netlify-cli
netlify dev
```

---

## 🚀 Deployment

This project is Netlify-ready.

- **Build Command:** `ng build`
- **Publish directory:** `dist/[project-name]`
- **Functions folder:** `netlify/functions`

> Make sure to enable HTTPS and set CORS headers for external scraping.

---

## 📄 License

MIT


---

## 🧪 Recommended Test URLs

These pages are confirmed to work well with the scraper and showcase different content types:

| Type               | URL |
|--------------------|-----|
| **Recipe**         | https://www.allrecipes.com/recipe/263217/baked-salmon-in-foil/ |
| **Entertainment**  | https://www.thewrap.com/star-wars-andor-revenue-disney-plus/ |
| **Government**     | https://www.toronto.ca/explore-enjoy/festivals-events/cherry-blossoms/ |
| **Personal Blog**  | https://www.petrinadarrah.com/posts/things-to-do-auckland |
| **Academic**       | https://www.sciencedirect.com/science/article/pii/S2666603022000136 |

These examples are useful for demonstrating article previews, metadata quality, and scraper resilience across formats.
