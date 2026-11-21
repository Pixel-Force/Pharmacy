# Project Memory: CuraRx Pakistan Licensed Pharmacy & Healthcare Platform

## Project Overview
- **Brand**: CuraRx Pakistan — DRAP Licensed Online Pharmacy & Healthcare Store
- **Directory**: `D:\My-Work\Ai-Websites\Pharmacy`
- **Architecture**: Multi-page Healthcare E-Commerce Platform + Operations Management Suite
- **Concept**: Tailored specifically for Pakistani consumers with authentic national medicines (Panadol Extra, Augmentin, Risek, Surbex Z, CaC-1000), Pakistani Rupee (PKR / Rs.) pricing, Cash on Delivery (COD), JazzCash, Easypaisa, Raast, instant WhatsApp ordering, and zero prescription upload barriers.

## Repositories & Live URLs
- **Penta-Websites**: [https://penta-websites.github.io/Pharmacy/](https://penta-websites.github.io/Pharmacy/)
  - Git Remote `origin`: `https://github.com/Penta-Websites/Pharmacy.git`
- **Pixel-Force**: [https://pixel-force.github.io/Pharmacy/](https://pixel-force.github.io/Pharmacy/)
  - Git Remote `pixel`: `https://github.com/Pixel-Force/Pharmacy.git`

## Environment & Tooling Settings
- **OS**: Windows
- **CLI Standard**: Use `npm.cmd` and `npx.cmd` for Node/NPM commands due to PowerShell script execution policies.
- **Server**: Standalone lightweight Node.js server (`server.js`) with zero dependencies, plus static GitHub Pages compatibility.

## Core Features & Architecture
- **Catalog**: 32+ authentic Pakistani medicines and healthcare products in PKR (`js/pharmacy-data.js`) from top national manufacturers (GSK Pakistan, Abbott Pakistan, Getz Pharma, Martin Dow, The Searle Company, Reckitt Benckiser, Sanofi, Roche Diagnostics, Omron).
- **Reactive Storage**: Cart, Wishlist, Orders, Pakistani customer profiles (Muhammad Ali Khan, Karachi), and settings persisted in LocalStorage version key `curarx_products_pk_v3` (`js/pharmacy-store.js`).
- **Zero Script Upload Barriers**: Removed mandatory prescription upload gating; converted prescription page (`upload-prescription.html`) into an Instant WhatsApp Concierge and Fast Medicine Assistant.
- **Instant WhatsApp Ordering**: Dedicated header and hero WhatsApp ordering actions (`+92 300 1234567`) allowing users to order via chat, voice note, or slip.
- **Local Payment Gateways**: Cash on Delivery (COD) [Default & Recommended], JazzCash, Easypaisa, Raast ID, and Bank Debit/Credit Cards.
- **Nationwide Logistics**: Express 2-4 hour delivery in Karachi; same-day delivery in Lahore and Islamabad/Rawalpindi; 24-48 hours via TCS/Leopards nationwide. Free delivery threshold at Rs. 1,500.
- **DRAP & Pharmacy Council Compliance**: DRAP Act 2012, Drugs Act 1976, and Pharmacy Act 1967 registered clinical pharmacists.

## Log
- **2026-11-20**: Initialized, built, verified, and pushed to GitHub organizations `Penta-Websites` and `Pixel-Force`.
- **2026-11-20**: Relocated project directory to `D:\My-Work\Ai-Websites\Pharmacy` to align with the workspace standard for AI websites.
- **2026-11-20**: UI/UX Simplification & Header Modernization.
- **2026-11-21**: Premium WordPress Theme Homepage Overhaul.
- **2026-11-21**: Complete Pakistani Consumer Redesign & Removal of Script Upload:
  - Redesigned header to slim 58px layout with Pakistani flag badge, DRAP approval indicator, UAN `021-111-CURA-RX`, and prominent WhatsApp button (`.btn-whatsapp-header`).
  - Completely rewrote catalog (`js/pharmacy-data.js`) with 32 authentic Pakistani medicines with realistic PKR prices (Panadol Extra Rs. 380, Surbex Z Rs. 495, CaC-1000 Rs. 480, Augmentin 625mg Rs. 445, Risek 20mg Rs. 320, Arinac Forte Rs. 210, Disprin Rs. 120, Brufen Rs. 180, etc.).
  - Removed all prescription script upload gating and warnings across `cart.html`, `checkout.html`, and `shop.html`.
  - Converted `upload-prescription.html` into a friendly WhatsApp Concierge & Instant Order Assistant.
  - Added Pakistani payment methods: Cash on Delivery (COD), JazzCash, Easypaisa, Raast / Bank Cards.
  - Added Pakistani cities coverage: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Hyderabad.
  - Redesigned all 14 pages (`index.html`, `shop.html`, `product-detail.html`, `cart.html`, `checkout.html`, `order-confirmation.html`, `track-order.html`, `portal.html`, `services.html`, `about.html`, `contact.html`, `compliance.html`, `admin/index.html`, `upload-prescription.html`).
  - Redesigned high-resolution vector mockup (`images/pharmacy-mockup.svg`) to showcase CuraRx Pakistan, PKR currency, and WhatsApp ordering.
  - Synchronized and verified across both GitHub Pages deployments (`Penta-Websites/Pharmacy` & `Pixel-Force/Pharmacy`).
