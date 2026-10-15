# Flintzy — Social Media Post Scheduler

A production-quality social media post scheduling dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. Flintzy enables creators and marketing teams to compose posts across multiple platforms (Facebook, Instagram, X, and TikTok), validate character limits live per network, schedule future releases with timezone-aware conversions, filter queue items via URL query parameters, and optimistically retry failed posts.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture & Project Structure](#architecture--project-structure)
5. [Prerequisites & Installation](#prerequisites--installation)
6. [Available Scripts](#available-scripts)
7. [UTC & Timezone Handling](#utc--timezone-handling)
8. [Mock API & Data Persistence](#mock-api--data-persistence)
9. [Optimistic Retry Mechanism](#optimistic-retry-mechanism)
10. [Character Counter & Unicode Strategy](#character-counter--unicode-strategy)
11. [Testing Strategy](#testing-strategy)
12. [Assumptions & Known Limitations](#assumptions--known-limitations)

---

## Project Overview

Flintzy is designed with a modern SaaS aesthetic—clean typography, subtle borders, high-contrast badges, and micro-animations. It delivers an intuitive chronological posting queue grouped by local calendar days (`Today`, `Tomorrow`, and formatted future dates like `Thursday, October 22`).

> **Note:** This is a frontend-only application. All social network publishing, network latencies, and retry outcomes are realistically mocked locally.

---

## Key Features

### 1. Chronological Post Queue
- **Day Grouping:** Automatically groups posts into `Today`, `Tomorrow`, and formatted future dates according to the user's local timezone.
- **Chronological Sorting:** Day groups are sorted chronologically, and posts within each day group are sorted by scheduled time ascending.
- **Card Preview:** Shows platform badges, content snippet with "Read more / Show less" expansion, optional media image preview, local time indicator, and status badge.

### 2. Search & Persistent URL Filters
- **Platform Filter:** Filter by `All`, `Facebook`, `Instagram`, `X`, or `TikTok`. Matches any post where the platform is included in its destination list.
- **Status Filter:** Filter by `All`, `Scheduled`, `Published`, or `Failed`.
- **Content Search:** Real-time, case-insensitive search across post content and failure error messages.
- **URL Synchronization:** Filter state is synced with URL query parameters (`?platform=instagram&status=failed&search=launch`).
  - Supports browser back and forward navigation (`popstate`).
  - Restores filter state on browser reload.
  - Cleans default parameters from URL to keep URLs clean.
  - Uses `history.replaceState` during search typing to prevent polluting browser history.

### 3. Post Composer & Editor Modal
- **Create & Edit Modes:** Schedule new posts or click the **Edit** icon (pencil) on any scheduled or failed post to modify content, platforms, media URL, or reschedule the release time.
- **Failed Post Rescheduling:** Editing a failed post automatically resets its status to `scheduled`, clears the previous failure error message, and queues it up for future publication.
- **Multi-Platform Selector:** Toggle individual platforms (`Facebook`, `Instagram`, `X`, `TikTok`) with active border highlights and checkmarks. At least one platform is required.
- **Live Character Counters:** Displays dedicated character counts for each selected platform simultaneously (`X: 145 / 280`, `Instagram: 145 / 2200`). Counters shift from neutral to amber warning and red when limits are exceeded.
- **Strictly Future Time Scheduling:** Prevents scheduling past or current times. The local datetime input is automatically validated and converted to canonical ISO 8601 UTC strings (`...Z`).
- **Media Image URL:** Optional image URL input with instant preview card, loading spinner, and graceful fallback for invalid image URLs.
- **Duplicate Submission Guard:** Disables buttons and shows a spinner while the simulated API call is pending.

### 4. Optimistic Retry with Rollback
- Failed posts display the exact upstream error message and a visible **Retry** button.
- **Immediate Optimistic UI:** Clicking Retry switches the badge to `Retrying...`, temporarily marks the post as scheduled, and clears the previous error banner.
- **Simulated 1,000ms Delay:** Models realistic network latency.
- **80% Success / 20% Failure Probability:**
  - On Success (80%): Updates post to `scheduled`, clears error message, persists to `localStorage`, and triggers a success toast.
  - On Failure (20%): Rolls back optimistic changes, restores `failed` status with a descriptive failure message, persists to `localStorage`, and triggers an error toast.
- **Race Condition Prevention:** Retry buttons are disabled during active retries to prevent duplicate concurrent submissions.

### 5. Summary Metrics
- Real-time counters for **Total Posts**, **Scheduled**, **Published**, and **Failed**.
- Clicking any summary card acts as a fast filter for that status.

---

## Technology Stack

- **React 18** (Functional components, hooks, strict mode)
- **TypeScript 5.6** (Strict type checking, zero `any` usage)
- **Vite 5.4** (Lightning fast ESM bundler)
- **Tailwind CSS 3.4** (Tailored design tokens, subtle shadows, custom transitions)
- **Lucide React** (Clean, accessible interface icons)
- **date-fns 3.6** (Timezone parsing, formatting, calendar day grouping)
- **React Hot Toast 2.4** (Sleek dark toasts with accessible contrast)
- **Vitest 2.1 & React Testing Library** (Comprehensive unit, hook, and component tests)

---

## Architecture & Project Structure

The project follows a clean, feature-oriented folder structure separating presentation, state management, and business logic:

```text
src/
├── app/
│   ├── App.tsx                     # Root application container & toast provider
├── components/
│   ├── EmptyState.tsx              # Empty state for 0 posts and 0 filter matches
│   ├── ErrorState.tsx              # Error boundary and retry banner
│   ├── LoadingSkeleton.tsx         # Skeleton cards for initial load
│   ├── PlatformIcon.tsx            # SVG platform icons with brand colors
│   └── StatusBadge.tsx             # Scheduled, Published, Failed, Retrying badges
├── data/
│   └── mockPosts.ts                # 32 dynamic mock posts relative to Date.now()
├── features/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx     # Branding, timezone badge, Create & Reset CTAs
│   │   ├── DashboardPage.tsx       # Main dashboard layout coordinator
│   │   └── SummaryCards.tsx        # Interactive metric cards
│   ├── posts/
│   │   ├── CharacterCounter.tsx    # Multi-platform character limit validation
│   │   ├── PostCard.tsx            # Post card with preview, image, & actions
│   │   ├── PostComposer.tsx        # Post creation modal dialog
│   │   ├── PostFilters.tsx         # Platform chips, status select, search
│   │   ├── PostGroup.tsx           # Day group with timeline connector line
│   │   ├── PostQueue.tsx           # Chronological post queue
│   │   └── PostSearch.tsx          # Debounced search input
│   └── retry/
│       └── RetryButton.tsx         # Retry button with spinner
├── hooks/
│   ├── usePosts.ts                 # Post collection state, CRUD, & metrics
│   ├── usePostFilters.ts           # URL query param sync & filtering logic
│   └── usePostRetry.ts             # Optimistic retry & rollback state machine
├── lib/
│   ├── dateUtils.ts                # Local/UTC conversions & day grouping
│   ├── platformConfig.ts           # Platform limits, colors, and labels
│   ├── storage.ts                  # LocalStorage resilience & JSON parsing
│   └── validation.ts               # Unicode counting & future date validators
├── types/
│   └── post.ts                     # TypeScript interfaces & discriminated unions
├── test/
│   ├── setup.ts                    # Vitest environment setup
│   ├── components.test.tsx         # Component rendering & interaction tests
│   ├── dateUtils.test.ts           # UTC/local and day grouping tests
│   ├── postService.test.ts         # Storage persistence & retry rollback tests
│   ├── usePostFilters.test.ts      # Filter & search hook tests
│   └── validation.test.ts          # Unicode & character limit tests
├── index.css                       # Tailwind layers & custom animations
└── main.tsx                        # DOM mount entrypoint
```

---

## Prerequisites & Installation

### Prerequisites
- **Node.js** v20.x or higher
- **npm** v10.x or higher

### Installation

Clone or extract the repository and run:

```bash
npm install
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server on `http://localhost:5173/` |
| `npm run build` | Runs TypeScript compilation (`tsc`) and bundles production assets with Vite |
| `npm run test` | Runs the full Vitest test suite (47 unit and component tests) |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run type-check` | Performs strict TypeScript type-checking without emitting files |
| `npm run preview` | Previews the production build locally |

---

## UTC & Timezone Handling

- **Storage Format:** All scheduled dates are stored as canonical UTC ISO 8601 strings ending in `Z` (e.g. `2027-01-15T10:30:00.000Z`).
- **Input Conversion:** In the Post Composer, user input from `<input type="datetime-local" />` (which reflects the user's browser timezone) is converted to UTC before persistence via `localToUtcIso()`.
- **Presentation Formatting:** When rendering post cards and headers, dates are formatted into the user's local timezone using `date-fns` and `Intl.DateTimeFormat`.
- **Timezone-Aware Day Grouping:** A timestamp close to midnight UTC is grouped into `Today`, `Tomorrow`, or future dates based on the local calendar boundaries of the user's machine.

---

## Mock API & Data Persistence

1. **Local Storage:** Posts are stored under the key `flintzy_scheduled_posts_v1`. Newly scheduled posts and retry status updates persist across page reloads.
2. **Seed Generation:** On first load or when storage is empty, 32 realistic mock posts are dynamically generated relative to `Date.now()`. This guarantees that scheduled posts are always in the future and never expire.
3. **Corruption Protection:** If `localStorage` data is corrupted or invalid, Flintzy catches the error and safely falls back to fresh seed data without crashing.
4. **Reset Sample Data:** A prominent "Reset Sample Data" button in the header resets the database back to the default seed dataset at any time.

---

## Optimistic Retry Mechanism

When a failed post is retried:
1. `usePostRetry` captures a snapshot of the post before mutation.
2. An optimistic update changes the post status to `scheduled` and clears the error message immediately in the UI.
3. A 1,000ms artificial delay simulates a network round-trip.
4. An 80% success / 20% failure probability determines the outcome:
   - **Success (80%):** Post status is permanently updated to `scheduled` in `localStorage` and a success toast appears.
   - **Failure (20%):** The post is rolled back to `failed` with a descriptive error message (e.g., `"Retry rejected: Upstream social platform API is temporarily down"`), persisted, and an error toast is displayed.
5. Concurrent retries for the same post ID are blocked while the retry is in-flight.

---

## Character Counter & Unicode Strategy

### Platform Limits
- **X (Twitter):** 280 characters
- **Instagram:** 2,200 characters
- **TikTok:** 2,200 characters
- **Facebook:** 5,000 characters

### Unicode Code-Point Counting
JavaScript's standard `.length` counts UTF-16 code units, which inadvertently counts multi-byte emojis (such as 🚀 or 🔥) as 2 characters. Flintzy utilizes Unicode code point counting via:

```ts
export function countCodePoints(text: string): number {
  if (!text) return 0;
  return Array.from(text).length;
}
```

This ensures emojis and supplementary symbols count as 1 character, matching modern social media network counter standards.

---

## Testing Strategy

The project includes **47 automated tests** across 5 test suites using Vitest and React Testing Library:

1. **`validation.test.ts`**: Unicode code point counting, platform limit validation, multiple platform limit enforcement, future date verification, and URL validation.
2. **`dateUtils.test.ts`**: UTC to local conversion, ISO 8601 `Z` formatting, `Today`/`Tomorrow`/future day grouping, and chronological sorting.
3. **`postService.test.ts`**: LocalStorage initialization, fallback on malformed JSON, post creation, deletion, and deterministic retry testing (both 100% success and 100% rollback failure).
4. **`usePostFilters.test.ts`**: Platform filtering, status filtering, case-insensitive search, multi-filter combinations, and filter reset.
5. **`components.test.tsx`**: Rendering and interaction tests for `StatusBadge`, `SummaryCards`, `CharacterCounter`, `EmptyState`, and `PostCard`.

Run tests anytime with:

```bash
npm test
```

---

## Assumptions & Known Limitations

1. **Simulated Publishing:** No actual publishing to external social media platforms occurs. All API requests are mocked locally with realistic artificial delays.
2. **Media Storage:** Media attachments accept public image URLs (e.g. Unsplash) rather than local binary file uploads.
3. **Timezones:** The application formats times into the user's active browser timezone via `Intl.DateTimeFormat`.
