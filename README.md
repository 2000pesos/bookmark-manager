# 📚 Angular Bookmark Manager

This is a lightweight, responsive single-page application built with Angular for managing web bookmarks. Bookmarks are enriched with metadata (title, description, preview image) and stored locally.

---

## 🚀 Features

- Add, view, and delete bookmarks
- Scrape article previews using a serverless function
- Form validation and error handling
- Pagination and bookmarking list
- Responsive UI styled with Angular Material 3
- No database or backend setup required

---

## 🧠 Technical Design

### Architecture

#### Frontend

| Layer        | Technology          | Role                                                             |
|--------------|---------------------|------------------------------------------------------------------|
| UI           | Angular (standalone components) | Reactive Forms, Mat components, templating, user interactions   |
| State/Logic  | Angular Services     | BookmarkService manages local persistence and metadata fetching |
| Persistence  | `localStorage`       | Stores bookmarks locally for demo simplicity                    |
| Routing      | Angular Router       | `/overview` for list, `/result/:id` for detail view             |

#### Backend

| Layer           | Technology        | Role                                                               |
|-----------------|-------------------|--------------------------------------------------------------------|
| Serverless API  | Netlify Function  | Endpoint: `/.netlify/functions/scrape-article?url=`                |
| Scraper         | Node.js + Cheerio | Extracts title, image, description, article content from HTML      |
| HTTP Client     | Axios             | Handles cross-site fetch with custom User-Agent                    |

---

## 🧩 Component Structure

### `OverviewComponent`

- Displays paginated list of bookmarks
- Allows URL submission with validation
- Navigates to details on click
- Handles deletion and pagination

### `ResultComponent`

- Displays metadata for selected bookmark
- Fetches and shows article preview
- Shows submission confirmation (if arriving from add flow)

### `BookmarkService`

- Centralized logic for:
  - `addBookmark`, `deleteBookmark`, `getListOfBookmarks`, `getTotalPages`
  - `fetchMetadata(url)` for preview scraping
  - `updateBookmark()` placeholder for future edit feature

---

## 🔁 Data Flow

```
[User Input] → [OverviewComponent FormGroup] → onSubmit() → BookmarkService.addBookmark()
→ [Redirect to ResultComponent] → use bookmark.id to load data
→ BookmarkService.fetchMetadata(url) → async preview injection
```

---

## 🗃 Storage Format (localStorage)

```json
[
  {
    "id": "uuid",
    "url": "https://example.com",
    "createdAt": 1715000000000
  }
]
```

---

## 🧪 Testing

- Unit tests written for both `OverviewComponent` and `BookmarkService`
- Uses Angular’s built-in `TestBed`, Jasmine, and test spies
- Covers:
  - Form validation
  - Bookmark CRUD
  - Pagination logic
  - Service-side data handling and localStorage persistence

---

## ⚠️ Technical Limitations

- Bookmarks are only stored in `localStorage` and are not synced across browsers or devices
- No authentication, user accounts, or cloud persistence
- Metadata scraping is brittle and depends heavily on source website structure
- No caching of scraped metadata — every reload re-fetches from the source site
- No mobile responsiveness audit or accessibility conformance testing
- No confirmation prompt before deleting a bookmark
- No error feedback when submitting an invalid or unreachable URL
- No protection against abuse (e.g. rate limiting, scraping failures, DoS)
- No bookmark editing (only add/delete)
- No debouncing or optimistic updates

---

## 🌱 Stretch Goals / Nice-to-Haves

- ✅ Mark bookmarks as “favorite”; filter and sort by favorites
- ✅ Add sorting options (by date, name, favorites)
- ✅ Filterable category/tag system (manual + auto-generated via NLP)
- ✅ Export bookmarks as JSON; clear all bookmarks
- ✅ Confirmation modal before deleting a bookmark
- ✅ Move scraping to submission time and persist metadata locally
- ✅ Allow editing bookmark URLs and tags
- ✅ Toggle between list view and thumbnail grid layout
- ✅ Add settings panel (pagination count, dark mode, default sort)
- ✅ Improve accessibility: ARIA, keyboard navigation, focus handling
- ✅ Add unit tests for `ResultComponent` and E2E tests with Playwright
- ✅ Import bookmarks via drag-and-drop `.json` or `.html` file

---

## 📄 License

MIT


---

## 🚀 Deployment

This project is configured for **Netlify** deployment:

1. Place the project root (containing `netlify/functions/scrape-article.js`) in your repo.
2. In Netlify settings:
   - Set **build command** to: `ng build`
   - Set **publish directory** to: `dist/[your-project-name]`
   - Enable **Functions directory**: `netlify/functions`

> Note: You must enable CORS and HTTPS requests for external scraping to work.

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Angular development server:
   ```bash
   ng serve
   ```

3. Serve the Netlify function locally (optional, for preview metadata):
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

> This will proxy the API calls to your local scraping function.

The app will be available at `http://localhost:4200`.



---

## ⚙️ Technical Choices & Configuration Notes

### Angular CLI (Standalone Components)
- The project uses the **Angular CLI** for build and development tooling, ensuring fast setup and reliable dependency management.
- **Standalone components** are used instead of traditional NgModules to reduce boilerplate and improve modularity.
- TypeScript configuration and `tsconfig.app.json` are auto-managed by Angular CLI with minimal overrides.

### Component Organization
- The project follows a **feature-first folder structure**:
  - `pages/overview` and `pages/result` contain view logic and templates.
  - `services/` contains application logic and shared data services.
  - Styles and templates are colocated with their components for better maintainability.

### BookmarkService Design
- The service encapsulates all bookmark operations, including:
  - CRUD via `localStorage`
  - Pagination and derived state (`getTotalPages`)
  - API integration (`fetchMetadata`)
- Methods are pure where possible and memoizable if caching were to be added.

### Metadata Scraper (Netlify Function)
- A **Node.js function** (`scrape-article.js`) deployed to Netlify’s Functions system.
- Uses **axios** for HTTP requests and **cheerio** for fast DOM parsing.
- Designed to run independently from the frontend and return only sanitized metadata (title, description, article body, image).
- Uses a spoofed `User-Agent` header to reduce scraping errors on restrictive sites.

### Configuration Details
- Uses Angular’s default build output in `dist/`, compatible with Netlify static hosting.
- The function directory `netlify/functions/` is placed adjacent to `src/` and is automatically picked up by Netlify CLI.
- Deployment tested using `netlify dev` to simulate production routes and proxy functions.
- Assets and scripts use relative paths to work both locally and when hosted.

