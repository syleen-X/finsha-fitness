# Finsha Fitness & Training — React Business Application

**Course:** CS4032 Web Programming — Assignment 02  
**Institution:** National University of Computer and Emerging Sciences (FAST-NUCES), Islamabad Campus  
**Semester:** Fall 2026  
**Student Name:** Syed Inshal Yousaf  
**Roll Number:** 22I7439  
**Section:** BS CY-C (Cyber Security - Section C)  

---

## 1. Project Description

**Finsha Fitness** is a modern web application for a fictional boutique fitness studio and training center located in Islamabad. The application provides an end-to-end customer booking journey:
1. Discover and browse diverse fitness classes (Cardio, Strength, Yoga, Dance, Combat, Mind & Body).
2. Granular search, category filtering, and sorting without state reset.
3. Parameterized detail views with schedule, intensity, equipment, and remaining spot indicators.
4. Booking bag management with quantity controls and local storage persistence.
5. Multi-field checkout with real-time blur validation, error preservation, and order review.
6. Booking confirmation with unique reference generator and calculated breakdown.

The user interface is built with **Neumorphism** and **Liquid Chrome** accents, featuring the exact brand color palette:
- **Base Background:** `#F4EDE4` (Warm Cream)
- **Primary / CTA:** `#E76F51` (Coral Orange)
- **Dark Elements / Headings:** `#264653` (Deep Teal-Dark)
- **Accent:** `#2A9D8F` (Teal Green)

No third-party UI component libraries (MUI, Chakra, shadcn/ui) are used. All styling is authored via modular **CSS Modules** and semantic HTML.

---

## 2. Links

- **GitHub Repository:** *(To be added upon repository push)*
- **Live Deployment:** *(To be added upon deployment)*
- **Final Commit Hash:** *(Refer to git log)*

---

## 3. Installation & Run Commands

Ensure Node.js (v18+) is installed.

```bash
# Navigate to project directory
cd finsha-fitness

# Install dependencies
npm install

# Start local development server (with HMR)
npm run dev

# Run automated business-rule tests (Node.js built-in test runner)
node --test src/rules/bookingRules.test.js
# or via npm script if configured:
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Main Routes & Features

| Route | Component | Key Capabilities |
|---|---|---|
| `/` | `HomePage` | Hero with liquid chrome typography, statistics counters, 4 featured classes, "Why Finsha" highlights. |
| `/classes` | `ClassesPage` | Live text search, 7 category filters, 5 sort options, async loader, dev failure simulation toggle, empty states. |
| `/classes/:id` | `ClassDetailPage` | Detailed class breakdown, benefits, required equipment, spot availability bar, live quantity control, R1 and R2 validation. |
| `/booking` | `BookingPage` | Review selected classes, modify quantities, remove items, R2 conflict detection on restored data, R3 minimum spend check. |
| `/checkout` | `CheckoutPage` | Controlled form (Name, Email, Phone, Date, Session Type, Notes), per-field validation on blur, data retention, review summary step. |
| `/confirmation` | `ConfirmationPage` | Success screen with booking reference, session breakdown, total paid, and automatic state cleanup. |
| `*` | `NotFoundPage` | Custom 404 handler with Neumorphic card and navigation back to home. |

---

## 5. Operating Business Rules

1. **Rule 1 (Capacity & Quantity Limit):**
   - **Condition:** Users can book between 1 and 6 spots per class, capped strictly by remaining availability (`capacity - enrolled`).
   - **Enforcement:** `validateBookingQuantity()` in `src/rules/bookingRules.js`. Controls block inputs outside boundaries and display inline warnings.
   - **Boundary:** If 3 spots remain, booking 3 is allowed; booking 4 is rejected. Maximum single booking limit is 6 spots.

2. **Rule 2 (Availability & Inactive Items):**
   - **Condition:** Classes with `available: false` or `enrolled >= capacity` cannot be booked.
   - **Enforcement:** `isClassBookable()` in `src/rules/bookingRules.js`. Disables booking button with clear status reason.
   - **Recovery / Edge Case:** If an item in saved `localStorage` becomes unavailable, `BookingPage` surfaces a persistent warning banner with a 1-click remove action and disables checkout.

3. **Rule 3 (Minimum Online Booking Deposit):**
   - **Condition:** Total booking value must be at least **PKR 1,000** for online confirmation.
   - **Enforcement:** `validateMinimumBooking()` in `src/rules/bookingRules.js`.
   - **Boundary:** Total of PKR 900 disables the "Proceed to Checkout" button and specifies the exact difference needed (e.g. "Add PKR 100 more"). Total of PKR 1,000 enables checkout.

---

## 6. Edge Case Reproduction Guide

| Edge Case | How to Reproduce | Expected Handling |
|---|---|---|
| **Simulated Network Failure** | Go to `/classes`, check "Simulate Load Failure" in dev panel. | Displays `ErrorState` card with error message and working "Retry" button. |
| **Invalid Class ID** | Navigate to `/classes/cls-999` directly in URL bar. | Displays friendly "Class Not Found" message with link back to catalogue. |
| **Empty Search Results** | Search for non-existent term (e.g., "zzzzz") in `/classes`. | Shows dedicated `EmptyState` with "Clear filters" button. |
| **Form Error Preservation** | In `/checkout`, enter valid name, but enter invalid phone `1234`. Submit. | Displays specific Pakistani format error on phone; Name, Email, and Dates remain intact. |
| **Restored Selection Conflict** | Add a class to booking, simulate status change to inactive in storage/data. | `BookingPage` flags the conflict, explains reason, and provides remove button. |
| **Boundary Limit Check** | On `cls-001` (3 spots left), select 3 spots (valid), then increment to 4. | Increment is blocked and warning displays "Only 3 spot(s) left in this class." |

---

## 7. Concept Map

| Concept | File Location | Component / Function |
|---|---|---|
| **Component Hierarchy & Routing** | `src/App.jsx` | `App` (`BrowserRouter`, `Routes`, `Route`) |
| **Global State Management** | `src/hooks/useBooking.js` | `useBooking` (`useState`, `useEffect`, `localStorage`) |
| **Asynchronous Data Loading** | `src/hooks/useClasses.js`, `src/utils/mockLoader.js` | `useClasses`, `loadClasses` (Promise, async/await) |
| **Pure Business Rules Logic** | `src/rules/bookingRules.js` | `validateBookingQuantity`, `isClassBookable`, `validateMinimumBooking` |
| **Automated Unit Testing** | `src/rules/bookingRules.test.js` | `describe`, `it`, `assert` (`node:test`, `node:assert/strict`) |
| **Derived Filtering Pipeline** | `src/pages/ClassesPage.jsx` | `useMemo` (search + category + sort composed) |
| **Controlled Forms & Blur Validation** | `src/pages/CheckoutPage.jsx` | `fields`, `errors`, `touched`, `validate`, `onBlur` |
| **Neumorphism & Liquid Chrome Styles** | `src/styles/global.css`, `src/components/*.module.css` | CSS custom properties, dual box-shadows, background clip |
| **Accessibility & Semantic Layout** | `src/components/Navbar.jsx`, `src/pages/*.jsx` | ARIA roles, `role="alert"`, focus outlines, keyboard access |

---

## 8. Simulated Operations & Known Limitations

- **Simulated Operations:** Network latency and failures are simulated in `src/utils/mockLoader.js` (900ms delay). Payment processing is simulated; no credit card or financial credentials are collected.
- **Known Limitations:** Class schedule timetable is simulated via static JSON dataset (`src/data/classes.js`); multi-week recurring schedule selection is handled via single-session blocks.
