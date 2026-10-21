# MatriCare — Functionality-Only Audit Report

**Audit Date:** 2026-10-21  
**Target URL:** `http://127.0.0.1:5173/`  
**Application:** MatriCare Maternal Care Companion (Mobile-First Web Application)  
**Environment:** React 19 + TypeScript + Vite + Tailwind CSS + React Router + Recharts  

---

## 1. Executive Summary

This functionality-only audit rigorously inspected client-side routing, state management, form validations, data CRUD operations, alert lifecycles, emergency triggers, local storage persistence, and component synchronization across all 14 pages of MatriCare.

The audit verified that the application possesses an established reactive architecture with persistent client state. However, several functional deficiencies, dead filter actions, and status inversion bugs were identified where buttons only changed appearance or produced incorrect domain states.

---

## 2. Page-by-Page Audit Findings

### Page 1 — Welcome / Landing (`/`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Regional language selector: switched to Hindi (हिंदी) and verified reactive updates for core brand titles and action buttons; switched back to English.
  - "Get Started" button: navigates correctly to `/register`.
  - "Existing Patient Login" button: navigates correctly to `/login`.
  - Direct demo skip link: populates default session and navigates directly to `/home`.

### Page 2 — Registration (`/register`)
- **Status:** **VERIFIED WORKING WITH MINOR REFINEMENTS**
- **Tested Actions:**
  - 3-step wizard (Personal Details $\rightarrow$ Pregnancy Details $\rightarrow$ Consent & Review).
  - Validation: verified required field checks for name, DOB, phone, city, EDD, and pregnancy week.
  - Trimester calculation: dynamically computes Trimester 1, 2, or 3 based on entered gestational week.
  - Form submission: successfully creates profile for "Pooja Verma", persists to `localStorage`, and redirects to `/home` with updated personalized greeting.

### Page 3 — Login & Verification (`/login`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - One-click demo sign-in: signs in instantly as Ananya Sharma and navigates to `/home`.
  - Phone & OTP simulation: input phone, triggers simulated OTP step, auto-fill `123456`, validates code, and logs into dashboard.
  - Error handling: validates 10-digit mobile number and minimum 4-digit OTP.

### Page 4 — Home Dashboard (`/home`)
- **Status:** **VERIFIED WORKING WITH SYNCHRONIZATION BUG**
- **Tested Actions:**
  - Gestational progress indicator: calculates percentage (e.g. Week 26 of 40 = 65%).
  - Vitals summary cards: click navigates to `/health`.
  - Upcoming checkup card: click navigates to `/appointments`.
  - Prescribed medicines checklist: clicking checkbox toggles status and triggers feedback toast.
  - Emergency SOS button: launches `/emergency` immediately.
  - Alerts bell icon: navigates to `/alerts` with unread count badge.
- **Identified Issue:** Toggling a taken medicine from the checklist inverted its status to `skipped` instead of `pending` (see Issue #2 below).

### Page 5 — Health Monitoring (`/health`)
- **Status:** **PARTIALLY WORKING (STATIC CHART DATA)**
- **Tested Actions:**
  - 5 Metric tabs (Heart Rate, SpO2, Temperature, Blood Pressure, Fetal Kicks): switches metric cards and contextual clinical advice.
  - Timeframe toggles (`24h`, `7d`, `30d`): updates Recharts view.
  - "Log Health Reading" modal: successfully opens, validates inputs, and saves reading to context.
- **Identified Issues:**
  1. **Static Telemetry Charts:** When a manual reading is saved via the modal, the top card updates, but the Recharts dataset (`timeSeries24h`) is a static imported array and does not append the new reading.
  2. **Uncalibrated Modal Defaults:** Switching metric type in the modal does not update `formValue`, keeping `80` even for SpO2 or Temperature.

### Page 6 — Pregnancy Journey (`/pregnancy`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Interactive week timeline: tested selecting weeks 12, 16, 20, 24, 28, 32, 36, 40.
  - Content updates: dynamically updates fruit size comparison, milestones, maternal changes, care tips, recommended scans, and warning signs.

### Page 7 — Appointments & Check-ups (`/appointments`)
- **Status:** **WORKING WITH MISSING 'COMPLETE' LIFECYCLE ACTION**
- **Tested Actions:**
  - Upcoming vs. Past tabs: filters appointments based on status.
  - Add Appointment: modal validates title, doctor, facility, date, time, and prepends to list.
  - Reminder toggle: updates bell icon state.
  - Edit Appointment: opens prefilled modal, saves updates.
  - Cancel Appointment: opens confirmation dialog; confirming marks status as `cancelled` and moves it to Past tab.
- **Identified Issue:** There is no UI action to mark an upcoming check-up as `completed`, preventing normal lifecycle transitions without cancelling.

### Page 8 — Medicines & Supplements (`/medications`)
- **Status:** **WORKING WITH STATUS INVERSION BUG**
- **Tested Actions:**
  - Adherence progress ring: recalculates percentage dynamically.
  - Dose History tab: records past taken and skipped events.
  - Add Reminder modal: creates new supplement schedule.
  - Edit and Delete modal actions: functional with confirmation.
- **Identified Issue:** Clicking "Undo Taken" on a taken medication passed `'skipped'` to `markMedicationStatus`, incorrectly recording the dose as skipped/missed rather than reverting to pending.

### Page 9 — Safety Alerts & Notifications (`/alerts`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Filter tabs (`All`, `Needs Action`, `Acknowledged`, `Resolved`): verified count badges and accurate list filtering.
  - Alert Detail modal: displays full description and action recommendations.
  - Acknowledge button: updates status to `acknowledged`, updates counts across the app.
  - Resolve button: opens confirmation modal; confirming transitions alert to `resolved` and archives it.

### Page 10 — Emergency SOS (`/emergency`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Central SOS button: activates emergency beacon, switches button text to `ACTIVE`, creates a critical alert in context, and shows pulsating banner across `/home`.
  - Speed dialers: "Call 108" and "Call ASHA" open simulator dialogs with native dialer link fallback.
  - Deactivate SOS button: cancels emergency state and removes pulsating banner.

### Page 11 — Trusted Contacts (`/contacts`)
- **Status:** **WORKING WITH INCONSISTENT CALL LINK**
- **Tested Actions:**
  - Add Contact modal: validates and adds new trusted contact.
  - Edit and Delete modals: functional with confirmation dialogs.
  - Test Alert SMS button: opens simulated SMS preview dialog.
- **Identified Issue:** The "Call" button used a direct `<a href="tel:...">` which fails or does nothing on desktop environments, unlike the friendly simulator modals on `/emergency` and `/asha-contact`.

### Page 12 — My ASHA Worker (`/asha-contact`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Displays ASHA worker profile (Sunita Devi, ID AS-UP-2490, 8 yrs experience).
  - Next planned home visit details.
  - "Call ASHA": opens interactive simulator modal.
  - "Message": opens message dialog, displays sending state, queues demo message, and emits feedback toast.

### Page 13 — Health History & Reports (`/history`)
- **Status:** **PARTIALLY WORKING (DEAD DATE FILTER)**
- **Tested Actions:**
  - Tabs (`Vitals`, `Check-ups`, `Med Logs`, `Alerts`): displays past clinical logs.
  - Export action: generates and triggers download of `MatriCare_Report_<Name>_Week<N>.html` clinical dossier.
- **Identified Critical Issue:** The date filter buttons (`All Records`, `Past 7 Days`, `Past 30 Days`) update visual active state, but the list mapping completely ignores `dateFilter`, rendering all records regardless of selection.

### Page 14 — Profile & Settings (`/profile`)
- **Status:** **VERIFIED WORKING**
- **Tested Actions:**
  - Edit profile modal: updates patient details and recalculates gestational trimester.
  - Language selector: updates application language.
  - Wearable sync: updates `lastSyncTime` to "Just now" and triggers success toast.
  - Notification preference switches: toggle checkboxes update state.
  - Government helplines modal: displays 104, 181, 108 hotlines.
  - Reset demo data: restores original Ananya Sharma dataset.
  - Sign out: opens confirmation modal and redirects to welcome screen.

### Cross-Cutting: Refresh & State Persistence
- **Status:** **VERIFIED WORKING**
- State is serialized to `localStorage` under `matricare_app_state_v1` on any mutation and reliably rehydrated on page reload.

---

## 3. Discovered Issues Summary

| Issue # | Component / Route | Exact File | Description | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Health History | `src/pages/HealthHistoryPage.tsx` | Date filter buttons (`All`, `7d`, `30d`) change visual selection but do not filter the displayed records. | High (Dead Filter) |
| **2** | Medications & Home | `src/pages/MedicationsPage.tsx`, `src/pages/HomePage.tsx`, `src/context/AppContext.tsx` | "Undo Taken" inverts medicine status to `'skipped'` instead of reverting to `'pending'`. | High (Data Corruption) |
| **3** | Appointments | `src/pages/AppointmentsPage.tsx`, `src/context/AppContext.tsx` | No action to mark an upcoming appointment as `completed`. | Medium (Missing Lifecycle) |
| **4** | Health Monitoring | `src/pages/HealthPage.tsx` | Changing metric type in manual log modal leaves default value unchanged (e.g. 80 for SpO2 or Temp). | Medium (UX Flaw) |
| **5** | Health Monitoring | `src/pages/HealthPage.tsx`, `src/context/AppContext.tsx` | Recharts charts rely on static arrays; newly logged readings do not appear on trend graphs. | Medium (Telemetry Desync) |
| **6** | Contacts | `src/pages/ContactsPage.tsx` | Call button triggers direct `tel:` link without interactive simulator modal on desktop. | Low (Inconsistent UX) |

---

## 4. Minimal Implementation Plan

1. **Fix Issue #1 (`HealthHistoryPage.tsx`):**
   - Implement date filtering logic based on record timestamp/date against the active `dateFilter` ('all', '7d', '30d').
2. **Fix Issue #2 (`AppContext.tsx`, `MedicationsPage.tsx`, `HomePage.tsx`):**
   - Extend `markMedicationStatus` to support `'pending'`.
   - Update "Undo Taken" button to set status to `'pending'` and remove the taken log entry.
   - Add "Undo Skip" support so skipped doses can also be reverted to pending.
3. **Fix Issue #3 (`AppointmentsPage.tsx`, `AppContext.tsx`):**
   - Add `completeAppointment(id: string)` to `AppContext`.
   - Add a "Mark Completed" checkmark action on upcoming appointment cards.
4. **Fix Issue #4 (`HealthPage.tsx`):**
   - Update `onSelectMetric` in the manual log modal to auto-populate sensible clinical defaults (HR: 78, SpO2: 98, Temp: 98.4, Kicks: 10, BP: 120/80).
5. **Fix Issue #5 (`HealthPage.tsx`, `AppContext.tsx`):**
   - Integrate recently logged readings into the chart dataset so manual observations visibly render on 24h charts.
6. **Fix Issue #6 (`ContactsPage.tsx`):**
   - Add call simulator modal to `ContactsPage.tsx` matching `EmergencyPage` and `AshaContactPage`.
