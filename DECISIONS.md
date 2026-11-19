# Frontend Design & Architecture Decisions (DECISIONS.md)

**Project:** Finsha Fitness — React Business Application  
**Student:** Syed Inshal Yousaf | Roll No: 22I7439 | Section: BS CY-C  
**Course:** CS4032 Web Programming | Fall 2026 | FAST-NUCES Islamabad  

---

## Decision 1 — Direct Information Availability on Listing Cards (Problem 1)

### Problem
On competitor gym/fitness scheduling portals (e.g. ClassPass, local gym reservation portals), class listings only show title and time. Users cannot compare intensity levels, remaining spots, trainer names, or pricing without clicking through into each individual detail page. This causes excessive back-and-forth navigation and cognitive fatigue.

### Decision
Present critical decision metadata directly on each `ClassCard` component in the main browsing grid:
- Category badge with color coding
- Trainer name and session duration
- Intensity level badge (Low, Medium, High) with contextual colors
- Real-time remaining spot count (color-coded: green for available, orange for low stock, red for 1 spot left, grey for sold out)
- Price per session in PKR
- Clear "Sold Out / Inactive" overlay when unbookable

### Alternative
Keep cards minimal with only title and thumbnail image, deferring all information to `ClassDetailPage`.

### Reason
Fitness customers prioritize schedule compatibility, intensity fit, and spot availability when choosing a workout. Surfacing these upfront lets users compare options side-by-side in one view.

### Tradeoff
Higher visual density per card. Mitigated using clean Neumorphic surfaces, distinct spacing tokens, and clear typographic hierarchy.

### Code Location
- `src/components/ClassCard.jsx`
- `src/components/ClassCard.module.css`

### Evidence
In the class listing view (`/classes`), cards display intensity (`High`), trainer (`Ayesha Khan`), spots left (`3 spots left` in orange), and price (`PKR 1,200/session`). Users compare without leaving the catalogue.

---

## Decision 2 — Independent, Composable Search and Multi-Category Filters (Problem 2)

### Problem
On existing fitness booking websites, selecting or switching a category filter often resets the text search input, or typing in the search box clears active category tags. Users lose their filter state and must reconstruct their queries repeatedly.

### Decision
Implement reactive, non-destructive search and filtering where search text, category filter, and sort order are stored as separate state variables (`search`, `category`, `sort`). The displayed list is calculated through a single derived memoized pipeline (`useMemo`):
1. Text query filter (matches class name, trainer, or description)
2. Category filter (applies without modifying or clearing the text query)
3. Sort comparator (re-orders the filtered subset)
Neither control clears or resets the other.

### Alternative
Trigger an explicit "Apply Filter" button that re-fetches from the server or resets conflicting query parameters.

### Reason
Allows granular discovery (e.g., searching "Raza" within "Strength" sorted by "Price ↑") without frustrating state wipes.

### Tradeoff
Slightly higher computation in the client-side render cycle; easily handled with `useMemo` for standard catalog sizes.

### Code Location
- `src/pages/ClassesPage.jsx` (`filtered` memoized pipeline, lines 31–68)

### Evidence
Type "HIIT" into search, click "Cardio" category, and select "Price ↓" sort. All three criteria remain active simultaneously. Clearing is only done explicitly via the "Clear filters" action.

---

## Decision 3 — Preserved State with Inline Field-Level Blur Validation (Problem 3)

### Problem
Many booking checkout forms validate only on full form submission and wipe out valid fields (e.g., clearing dates, notes, or phone numbers) when an error occurs in another field, forcing users to re-enter all details.

### Decision
Implement controlled inputs with per-field blur validation (`onBlur`) and live error clearing (`onChange`):
- Individual errors are stored in an `errors` object keyed by field name.
- Fields are marked `touched` on blur to avoid showing premature error states while the user is typing.
- When an error occurs, existing valid values in all other fields remain completely intact in React state.
- Semantic `aria-describedby`, `aria-invalid`, and `role="alert"` provide immediate accessibility feedback.
- A two-step "Review Booking" preview allows final verification before clearing state and navigating to `/confirmation`.

### Alternative
Use native HTML5 form validation popups without custom state retention, or validate only upon final submission.

### Reason
Reduces user frustration, prevents accidental data loss, and assists users in fixing only the specific erroneous field.

### Tradeoff
Requires maintaining more fine-grained state (`fields`, `errors`, `touched`) and explicit validation helper logic.

### Code Location
- `src/pages/CheckoutPage.jsx` (`validate`, `handleBlur`, `handleChange`, `handleSubmit`)
- `src/pages/CheckoutPage.module.css`

### Evidence
Entering an invalid phone number (e.g., `12345`) and blurring highlights only the phone input in red with an inline alert, while name, email, start date, and session type remain safely preserved.
