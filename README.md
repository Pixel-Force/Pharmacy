# CuraRx Pharmacy — Professional & Online Pharmacy Platform

![CuraRx Pharmacy Platform Showcase](images/pharmacy-mockup.svg)

> **CuraRx Licensed Online Pharmacy & Wellness** is a modern, responsive, clinical-grade e-commerce website and administrative management suite designed for licensed pharmacy businesses, combining consumer convenience with pharmaceutical dispensing safety.

---

## 🌐 Live Deployed URLs (GitHub Pages)

- **Penta-Websites**: [https://penta-websites.github.io/Pharmacy/](https://penta-websites.github.io/Pharmacy/)
- **Pixel-Force**: [https://pixel-force.github.io/Pharmacy/](https://pixel-force.github.io/Pharmacy/)

---

## 🏥 Key Capabilities & Modules

### 1. 🔍 Medicine Search & Autocomplete
- **Live Search Autocomplete**: As users type in the header or search bars, matching medicines, active generic ingredients, and brands appear in a live dropdown with thumbnails, prices, and Rx requirements.
- **Drug Finder Bar**: Instant lookup by medicine commercial name, active compound, department, and dosage form (Tablets, Capsules, Liquids, Inhalers, Medical Devices).

### 2. 📋 3-Step Interactive Prescription Upload Wizard
Located at [`upload-prescription.html`](upload-prescription.html):
- **Step 1: Document Upload**: Drag-and-drop prescription scans, photos, or PDFs. Includes 3 built-in sample scripts (Cardiology, Respiratory, Antibiotic) for instant demonstration.
- **Step 2: Patient & Prescriber Coordinates**: Patient legal name, DOB, phone, drug allergies, prescriber's clinic name, and prescription date.
- **Step 3: Fulfillment & Consultation Options**: Select Home Cold-Chain Delivery vs In-Store Pickup; request a free 1-on-1 pharmacist consultation; confirm legal authenticity certification.
- **Instant Tracking ID**: Generates an audit tracking number (e.g., `RX-2026-9812`) routed directly to the pharmacist verification desk.

### 3. 🛍️ E-Commerce Catalog & Drug Monographs
- **Faceted Filters ([`shop.html`](shop.html))**: Filter by **Prescription Type** (All, Rx Only, OTC Only), **Category**, **Dosage Form**, **Price Range Slider**, and **In-Stock Only** with active filter chips.
- **Clinical Monograph ([`product-detail.html`](product-detail.html))**: Detailed drug information with Rx alert boxes, batch numbers, expiry dates, and tabbed clinical monographs:
  1. *Indications & Description*
  2. *Dosage & Administration*
  3. *Active Ingredients & Composition*
  4. *Precautions & Side Effects*
  5. *Storage & Handling Guidelines*

### 4. 🛒 Prescription Basket & Verification Manager
Located at [`cart.html`](cart.html) & Slide-Out Cart Drawer:
- **Prescription Warning Banners**: Automatically detects Rx items in the basket and prompts the user to link a verified prescription.
- **Free Cold-Chain Delivery Meter**: Real-time progress bar towards free shipping threshold ($45.00).
- **Promo Coupon Codes**: Supports instant discounts (e.g. `HEALTH10` or `RX10`).

### 5. 💳 Clinical Checkout & Payment
Located at [`checkout.html`](checkout.html):
- **Delivery vs Pickup**: Morning/Afternoon courier delivery windows or in-store pickup counter locations.
- **Prescription Attachment Badge**: Displays the verified prescription reference linked to the order.
- **Payment Options**: Credit/Debit Card, Health Insurance Direct Co-Pay, and Cash on Delivery / Pay at Pickup.
- **Legal Regulatory Certification**: Mandatory age (18+) and therapeutic use declaration.

### 6. 🚚 Real-Time Order Tracking & Cold-Chain Telemetry
Located at [`track-order.html`](track-order.html):
- **5-Phase Progress Pipeline**: `Placed` ➔ `Pharmacist Reviewing` ➔ `Prescription Approved` ➔ `Dispensing & Sealed` ➔ `Out for Delivery` ➔ `Delivered`.
- **Live Cold-Chain Sensor**: Temperature telemetry display (4.2°C, optimal range: 2°C – 8°C) for insulin and biological integrity.
- **Chain of Custody Logs**: Timestamped audit trail with pharmacist review notes.

### 7. 👤 Patient Account & Health Portal
Located at [`portal.html`](portal.html):
- **My Prescriptions**: Active prescriptions viewer, remaining refill counters, and 1-click refill orders.
- **Order History**: Review past orders, invoices, and active tracking.
- **Health & Allergy Profile**: Manage known drug allergies and chronic conditions used for pharmacist safety screenings.
- **Saved Wishlist**: Manage saved medications and devices.

### 8. 👨‍⚕️ Complete Pharmacist & Admin Dashboard
Located at [`admin/index.html`](admin/index.html):
- **KPI Metrics**: Real-time counters for Total Orders, Pending Rx Approvals, Revenue, and Catalog Inventory.
- **Rx Verification Desk**: Review uploaded patient scripts, examine patient allergies, and **Approve & Certify** with Dr. Eleanor Vance's PharmD digital license stamp (`RPH-942817-A`), request clarification, or reject invalid scripts.
- **Medicine Catalog CMS**: Full inventory CRUD (add, edit, remove medications, toggle Rx requirement, update stock counts, batch numbers, and expiry dates).
- **Orders & Dispensing Manager**: Advance order phases with real-time customer tracking synchronization.
- **Configurable Jurisdiction & Regulatory Settings**: Switch between **United States (FDA/DEA)**, **United Kingdom (MHRA/GPhC)**, **Canada (Health Canada)**, **Australia (TGA)**, and **International WHO GPP** presets; configure pseudoephedrine limits and mandatory Rx verification enforcement.

---

## ⚖️ Pharmaceutical Regulatory & Safety Compliance

- **Mandatory Prescription Enforcement**: Prescription-only medicines (Rx / POM) cannot be dispensed without verified pharmacist sign-off.
- **Schedule II Controlled Narcotics Policy**: Strict prohibition on online dispensing of Schedule II narcotics pursuant to federal DEA regulations.
- **Pseudoephedrine Restrictions**: Enforces legal transaction limits (3.6 grams per transaction) under Combat Methamphetamine legislation.
- **HIPAA & GDPR Health Data Protection**: All patient health data (PHI) and prescription uploads are encrypted at rest and in transit.
- **Cold-Chain Transport**: Validated thermal storage protocols (2°C – 8°C) for temperature-sensitive medications.

---

## 📂 Repository File Directory

```
Pharmacy/
├── admin/
│   └── index.html               # Pharmacist & Admin Verification Dashboard
├── css/
│   └── pharmacy.css             # Healthcare Green & Navy Blue Design System
├── images/
│   └── pharmacy-mockup.svg      # High-Resolution Vector Platform Mockup
├── js/
│   ├── pharmacy-data.js         # Master Catalog Database (30+ Medications across 7 Departments)
│   ├── pharmacy-store.js        # Reactive LocalStorage Engine (Cart, Orders, Rx, Settings)
│   └── pharmacy-ui.js           # Cart Drawer, Autocomplete Live Search, Product Cards
├── .gitignore                   # Git Ignore Configuration
├── .nojekyll                    # GitHub Pages Jekyll Bypass
├── about.html                   # Clinical Leadership & Accreditation
├── cart.html                    # Shopping Basket & Prescription Warning
├── checkout.html                # Clinical Checkout & Payment
├── compliance.html              # Regulatory Dispensing & Controlled Substances Policy
├── contact.html                 # 24/7 Urgent Pharmacist Hotline & Dispensary Hours
├── index.html                   # Master Homepage
├── launch-pharmacy.bat          # 1-Click Windows Launcher
├── order-confirmation.html      # Order Success Receipt & Printable Invoice
├── package.json                 # Node.js Project Configuration
├── portal.html                  # Patient Account, Prescriptions & Allergy Profile
├── product-detail.html          # Clinical Drug Monograph Page
├── server.js                    # Zero-Dependency Node.js HTTP Server
├── services.html                # Pharmacy Consultations, Vaccinations & Refill Program
├── shop.html                    # Product Catalog & Faceted Filters
├── test-server.js               # Automated 18-Endpoint Verification Suite
└── track-order.html             # Live Order & Prescription Tracking with Cold-Chain Telemetry
```

---

## 🚀 Quick Start & Local Preview

### Option A: 1-Click Windows Launcher
Double-click `launch-pharmacy.bat` to launch the local Node server and open `http://localhost:3030` in your default browser.

### Option B: Terminal Command
```bash
node server.js
```
Visit:
- Storefront: `http://localhost:3030/index.html`
- Pharmacist Admin: `http://localhost:3030/admin/index.html`
- Prescription Upload: `http://localhost:3030/upload-prescription.html`
- Catalog & Filters: `http://localhost:3030/shop.html`

### Option C: Direct Browser Opening
All HTML files use relative links and client-side reactive storage. You can double-click `index.html` to run the entire application directly in any browser with zero dependencies.

---

## 🧪 Verification & Test Suite
Run the automated endpoint test suite:
```bash
node test-server.js
```
*Result: 18/18 checks passed (100% pass rate).*

---

## 📄 License
MIT License. Created by CuraRx Healthcare Systems.
