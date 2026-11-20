# Project Memory: CuraRx Licensed Pharmacy & Healthcare Platform

## Project Overview
- **Brand**: CuraRx Licensed Pharmacy & Wellness
- **Directory**: `D:\My-Work\Ai-Websites\Pharmacy`
- **Architecture**: Multi-page Healthcare E-Commerce Platform + Pharmacist Administrative CMS
- **Concept**: State-of-the-art online pharmacy with prescription verification, cold-chain temperature telemetry, clinical drug monographs, and regulatory compliance.

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
- **Catalog**: 30+ medications and healthcare supplies across 7 core departments (`js/pharmacy-data.js`).
- **Reactive Storage**: Cart, Wishlist, Prescriptions, Orders, Health Profile, and Regulatory Settings persisted in LocalStorage (`js/pharmacy-store.js`).
- **Interactive Prescription Wizard**: 3-step prescription upload with sample scripts, allergy verification, and instant tracking reference (`upload-prescription.html`).
- **Order Tracking**: 5-phase visual timeline with live cold-chain temperature monitoring sensor at 4.2°C (`track-order.html`).
- **Pharmacist Admin Console**: Rx verification desk with digital PharmD license stamp, Medicine Catalog CRUD, Orders Manager, and Multi-jurisdiction presets (`admin/index.html`).
- **Regulatory Frameworks**: Configurable for US (FDA/DEA), UK (MHRA/GPhC), Canada (Health Canada), Australia (TGA), and WHO Good Pharmacy Practice.

## Log
- **2026-11-20**: Initialized, built, verified, and pushed to GitHub organizations `Penta-Websites` and `Pixel-Force`.
- **2026-11-20**: Relocated project directory to `D:\My-Work\Ai-Websites\Pharmacy` to align with the workspace standard for AI websites.
