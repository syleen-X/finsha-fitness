# CS4032 Web Programming — Assignment 02 Report
## Business Website Development Using React: Finsha Fitness & Training

---

## 1. Student and Project Details

| Field | Detail |
|---|---|
| **Student Name** | Syed Inshal Yousaf |
| **Roll Number** | 22I7439 |
| **Section** | BS CY-C (Cyber Security - Section C) |
| **Course** | Web Programming (CS4032) — Fall 2026 |
| **Institution** | FAST-NUCES Islamabad Campus |
| **Business Name** | Finsha Fitness & Training |
| **Domain** | Fitness & Training (Studio Class Booking) |
| **Repository Link** | *(Insert Public GitHub Repository URL)* |
| **Deployment Link** | *(Insert Public Deployed URL e.g. Vercel/Netlify)* |
| **Final Commit Hash** | *(Insert Commit SHA from git rev-parse HEAD)* |

---

## 2. Business Profile

| Element | Specification |
|---|---|
| **Business Identity** | **Finsha Fitness & Training** — A boutique fitness studio offering specialized group training sessions including HIIT, Strength Conditioning, Power Lifting, Yoga, Pilates, Boxing, and Cycling. |
| **Primary Audience** | Health-conscious working professionals, university students, and fitness enthusiasts in Islamabad seeking structured, trainer-led fitness sessions without restrictive annual lock-in contracts. |
| **Operating Area** | Islamabad & Rawalpindi (Physical studio located near F-10/G-11, with hybrid support for online live interactive sessions). |
| **Main Customer Task** | Browse available fitness classes, filter/search by intensity, schedule, or category, inspect class details and spot availability, configure booking seats, and complete a validated booking registration. |
| **Business Goal** | Drive session registrations, maximize studio capacity utilization, and minimize booking abandonment by providing transparent pricing and real-time availability. |
| **Offering** | 12 distinct classes across 6 categories (Cardio, Strength, Yoga, Dance, Combat, Mind & Body), led by certified trainers with defined schedules, durations, and capacities. |

---

## 3. Operating Rules

### Rule 1: Capacity & Seat Quantity Limit (Availability/Capacity)
1. **Exact Condition:** A user can book between 1 and 6 spots per class, capped strictly by remaining available spots (`capacity - enrolled`).
2. **Where Told:** Displayed dynamically on `ClassDetailPage` next to the `QuantityControl` and on `ClassCard` badges ("X spots left").
3. **Application Response:** Increment button disables when reaching the limit; attempting invalid input surfaces an inline alert and disables the "Add to Booking" action.
4. **Boundary Case:** 
   - *Case A (Remaining Spots Limit):* `cls-001` has 3 spots remaining. Booking 3 is allowed. Booking 4 is rejected with message: `"Only 3 spot(s) left in this class."`
   - *Case B (Upper Absolute Limit):* On a class with 15 spots open, selecting 6 is allowed; selecting 7 is rejected with message: `"Maximum 6 spots per booking."`

### Rule 2: Booking Availability & Inactive Items (Eligibility/Compatibility)
1. **Exact Condition:** Classes with `available === false` or `enrolled >= capacity` cannot be booked.
2. **Where Told:** Prominent Neumorphic overlay on `ClassCard` ("Fully Booked" or "Inactive") and banner on `ClassDetailPage`.
3. **Application Response:** "Add to Booking" button is permanently disabled with reason text.
4. **Boundary Case / Recovery:** If a user saved `cls-007` (Spin Cycling, inactive) in a restored cart from `localStorage`, `BookingPage` detects the conflict against live records, flags it in an alert banner, disables checkout, and offers a 1-click "Remove" button to regain checkout validity.

### Rule 3: Minimum Online Booking Spend (Pricing/Fulfilment)
1. **Exact Condition:** Total cart amount must equal or exceed **PKR 1,000** to proceed with online confirmation.
2. **Where Told:** Highlighted in the `Order Summary` sidebar on `BookingPage` and in the Checkout session options.
3. **Application Response:** If `total < 1000`, the "Proceed to Checkout" button is disabled (`aria-disabled="true"`), displaying the remaining balance required (e.g. `"Add PKR 100 more to enable online checkout"`).
4. **Boundary Case:** A single Guided Meditation session costs PKR 600 (`total = 600`) → checkout disabled. Adding another session brings total to PKR 1,200 → checkout instantly enabled. Total exactly PKR 1,000 is allowed.

---

## 4. Reference-Site Investigation

### Problem 1: Information Concealment on Listings
- **Reference URL:** `https://classpass.com` / `https://trifit.com.pk`
- **Affected Task:** Comparing multiple class offerings to select an appropriate workout.
- **Observed Difficulties:** Class list cards only show the class title and time. Critical evaluation criteria—such as intensity level, difficulty, equipment required, remaining capacity, and trainer identity—are omitted. Users are forced to click into each detail page, wait for it to load, and navigate back repeatedly.
- **Business Consequence:** High bounce rates, user drop-off during browsing, and lower class booking conversions.
- **Finsha Fitness Solution:** Every `ClassCard` displays category, trainer, duration, intensity tag (Low/Medium/High), spot status color-coding, schedule days, and session price upfront.

### Problem 2: Filter and Search Coupling / Query Reset
- **Reference URL:** `https://www.gympass.com`
- **Affected Task:** Narrowing down specific trainers or keywords within a chosen discipline.
- **Observed Difficulties:** Selecting a category filter tag automatically wipes active search input text, and typing a search keyword clears any applied category filter.
- **Business Consequence:** Frustrated customers unable to pinpoint niche classes (e.g., searching for "Hassan" in "Strength"), leading to abandoned sessions.
- **Finsha Fitness Solution:** Composable, multi-criterion filtering implemented in `ClassesPage.jsx`. Search term, category filter, and sort comparator operate as independent React states combined inside a memoized pipeline (`useMemo`).

### Problem 3: Destructive Form Reset on Validation Error
- **Reference URL:** `https://kfit.com`
- **Affected Task:** Completing customer registration and scheduling details during checkout.
- **Observed Difficulties:** If one field fails validation (e.g., phone format), the form refreshes or resets all inputs to blank, clearing previously typed names, dates, and notes.
- **Business Consequence:** Immediate abandonment at checkout due to repetitive data entry friction.
- **Finsha Fitness Solution:** Controlled inputs in `CheckoutPage.jsx` with per-field blur validation (`onBlur`). Errors are scoped to invalid fields, while all valid input remains preserved in state.

---

## 5. Frontend Decisions (from DECISIONS.md)

### Decision 1: Direct Information Availability on Listing Cards
- **Alternative:** Minimalist card showing only name and thumbnail.
- **Reason:** Aligns with customer decision-making (intensity, trainer, remaining spots).
- **Tradeoff:** Higher information density; resolved using Neumorphic card hierarchy.
- **Code Location:** `src/components/ClassCard.jsx`, `src/components/ClassCard.module.css`.

### Decision 2: Independent, Composable Search and Filters
- **Alternative:** Server-side search with explicit reset on category change.
- **Reason:** Users can refine searches iteratively without losing active queries.
- **Tradeoff:** Multiple state dependencies inside `useMemo`.
- **Code Location:** `src/pages/ClassesPage.jsx` (lines 31–68).

### Decision 3: Preserved State with Inline Field-Level Blur Validation
- **Alternative:** Form-wide submission alert or default HTML5 browser tooltips.
- **Reason:** Immediate, non-destructive feedback preserving user effort.
- **Tradeoff:** Requires granular state management (`fields`, `errors`, `touched`).
- **Code Location:** `src/pages/CheckoutPage.jsx` (`validate`, `handleBlur`, `handleChange`).

---

## 6. Implemented Application Journey

### Design System: Neumorphism & Liquid Chrome
- **Base Background:** `#F4EDE4` (Warm Cream) applied globally.
- **Neumorphic Dual Shadows:** `6px 6px 16px rgba(0,0,0,0.13), -6px -6px 16px rgba(255,255,255,0.85)` creating tactile, soft-extrusion cards.
- **Neumorphic Insets:** `inset 4px 4px 10px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.85)` on inputs and active filter tabs.
- **Liquid Chrome Typography:** Multi-color linear gradient (`#264653` → `#2A9D8F` → `#E76F51`) clipped to text on hero headings.

### Journey Walkthrough:
1. **Home (`/`):** Liquid Chrome hero banner, Neumorphic stat counters, featured class cards, and value proposition cards.
2. **Classes Catalogue (`/classes`):** Interactive search bar, category filter pills, sort dropdown, and live count indicator with dev-mode failure toggle.
3. **Class Detail (`/classes/:id`):** Full class specifications, capacity progress indicator, benefits checklist, equipment list, and interactive spot selector.
4. **My Booking (`/booking`):** Cart item review, live quantity adjustment, conflict detection for restored inactive items, and R3 minimum spend validation.
5. **Checkout (`/checkout`):** 6-field controlled form, Pakistani phone formatting, future date enforcement, and two-step "Review Summary" modal before final submission.
6. **Confirmation (`/confirmation`):** Success confirmation with generated reference code (`FF-XXXXXX`), full session summary, total paid, and automated storage cleanup.
7. **404 Not Found (`*`):** Friendly fallback card with one-click return to home.

*(Insert application screenshots here in final PDF)*

---

## 7. Verification & Edge-Case Checklist

| Edge Case | Action Taken | Expected Result | Observed Result | Status |
|---|---|---|---|---|
| **Missing/Long Content** | Rendered items with varying descriptions and placeholder letters | Layout remains intact, text wraps cleanly | No overflow, consistent grid | PASS |
| **Invalid Class Route** | Navigated to `/classes/invalid-999` | Show "Class Not Found" card with return link | Renders friendly 404 card | PASS |
| **Empty Search/Filter** | Filtered by search `"zzzz"` | Display dedicated `EmptyState` with reset action | Shows search empty message and reset button | PASS |
| **Invalid Form Submission** | Left required phone blank in `/checkout` | Highlight phone error, preserve name and email | Phone error shown; other inputs retained | PASS |
| **Restored Selection Conflict** | Restored inactive class `cls-007` from storage | Alert banner displayed, checkout blocked | Conflict banner shown, remove button works | PASS |
| **Capacity Boundary** | Selected 3 spots on `cls-001` (3 spots left), attempted 4th | 4th spot blocked with capacity message | Blocked; alert message displayed | PASS |
| **Minimum Spend Boundary** | Cart total = PKR 600 (< 1000) | Checkout disabled, difference displayed | Disabled; shows "Add PKR 400 more" | PASS |
| **Simulated Failure & Retry** | Checked "Simulate Load Failure" on `/classes` | Show error state with working Retry button | Error card appears; Retry re-fetches | PASS |

### Automated Unit Test Output

The core business rule (`validateBookingQuantity`) is tested using Node.js's built-in test runner (`node:test`, `node:assert/strict`):

```
> node --test src/rules/bookingRules.test.js

▶ validateBookingQuantity
  ✔ valid: booking 1 spot when 3 spots remain (1.758519ms)
  ✔ boundary: booking exactly 3 spots (all remaining) (0.336908ms)
  ✔ invalid: booking 4 spots when only 3 remain (2.089283ms)
  ✔ boundary: booking exactly 6 (max per booking) (0.345512ms)
  ✔ invalid: booking 7 spots exceeds max per booking (0.309734ms)
✔ validateBookingQuantity (7.313056ms)
ℹ tests 5
ℹ suites 1
ℹ pass 5
ℹ fail 0
```

---

## 8. Limitations

- **Client-Side Simulation:** Class availability and bookings are managed via client React state and `localStorage`. In a full production stack, concurrency would be managed by a database lock mechanism.
- **Payment Gateway:** Payment processing is simulated without live financial gateway integration (e.g., Stripe/PayFast), per assignment guidelines.
