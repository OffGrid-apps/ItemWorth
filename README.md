# ItemWorth

> **An offline-first Progressive Web App for organizing, tracking, and valuing personal belongings.**

ItemWorth is a production-quality inventory management application designed to help users document, organize, and estimate the value of their possessions for personal organization, insurance documentation, moving, estate planning, and asset management.

The application is intentionally built around a simple philosophy:

- Your data stays on your device.
- The application works without an Internet connection.
- The codebase remains small, maintainable, and easy to evolve.

---

# Vision

ItemWorth aims to provide a dependable, privacy-focused inventory solution that is fast, intuitive, and accessible without requiring accounts, subscriptions, cloud storage, or servers.

The project prioritizes long-term stability over feature bloat.

---

# Core Principles

- Offline-first
- Privacy-first
- Mobile-first
- Accessibility-first
- Color-blind friendly
- Lightweight
- Fast
- Reliable
- Maintainable

Every design and engineering decision should reinforce these principles.


## Live Demo

Try ItemWorth online or install it as a Progressive Web App.

➡️ **[Launch ItemWorth](https://offgrid-apps.github.io/ItemWorth/)**

## Screenshots

### Dashboard

![ItemWorth Dashboard](screenshots/dashboard.jpg)

The main dashboard provides a clear overview of your inventory, including search, filtering, categories, item counts, and estimated total value.

### Add New Item

![Add New Item](screenshots/add-item.jpg)

Create detailed inventory records with categories, values, conditions, serial numbers, purchase dates, locations, notes, and photos.

---

# Features

## Inventory Management

- Add, edit, and delete inventory items
- Organize items by category
- Assign storage locations
- Track quantities
- Record estimated values
- Store notes

## Rich Item Information

- Serial numbers
- Purchase dates
- Condition tracking
- Item photos
- Expandable item details

## Organization

- Search
- Filtering
- Sorting
- Dashboard statistics
- Running inventory totals

## Data Protection

- JSON backup
- JSON restore
- CSV export
- Backward-compatible data model

## Progressive Web App

- Installable
- Offline operation
- Service Worker support
- Update notifications

---

# Feedback and Support

ItemWorth uses GitHub Issues for structured bug reports and feature requests.
Submitting an issue requires an Internet connection and a GitHub account.

- **[Report a problem](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=bug_report.yml)**
- **[Suggest an improvement](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=feature_request.yml)**
- **[View existing issues](https://github.com/OffGrid-apps/ItemWorth/issues)**
- **[Open the live app](https://offgrid-apps.github.io/ItemWorth/)**

For installation, PWA, offline, or data-persistence problems, include your device,
operating system, browser version, whether ItemWorth was installed, and whether
the issue occurs online, offline, or both.

> **Protect your privacy:** Never post JSON backup files, complete inventory lists,
> serial numbers, receipts, exact storage locations, private photos, addresses, or
> other sensitive personal information in a public issue.

---

# Technology Stack

ItemWorth intentionally uses a minimal technology stack.

- React 19
- Vite 8
- JavaScript (ES Modules)
- vite-plugin-pwa
- HTML5
- CSS3

Persistent storage:

- localStorage

---

# Architecture

ItemWorth is intentionally client-only.

There is:

- No backend
- No server
- No database
- No authentication
- No cloud storage
- No APIs
- No environment variables

Every feature operates entirely within the browser.

---

# Design Philosophy

The project favors simplicity over complexity.

When multiple implementation approaches exist, prefer the solution that is:

- Smaller
- Easier to understand
- Easier to maintain
- Easier to test
- Easier to extend

Avoid unnecessary abstraction.

Avoid unnecessary dependencies.

Avoid unnecessary refactoring.

Incremental improvement is preferred over large rewrites.

---

# Development Workflow

Every milestone follows the same engineering process.

## Before implementation

- Read the complete source.
- Treat the uploaded source as the authoritative codebase.
- Analyze the entire repository.
- Identify every affected file.
- Explain why each file changes.
- Evaluate:
  - Risks
  - Edge cases
  - Trade-offs
  - Accessibility
  - Performance
  - Storage implications
  - Browser compatibility
  - Offline behavior
  - Backward compatibility
- Obtain approval before writing code.

## During implementation

- Implement only the approved milestone.
- Make the smallest possible incremental change.
- Preserve the existing architecture.
- Preserve coding style.
- Preserve formatting.
- Preserve naming conventions.
- Preserve component structure.
- Preserve storage compatibility.
- Preserve design language.
- Preserve accessibility.
- Avoid unrelated changes.

## Before delivery

Verify:

- Production build succeeds
- No regressions
- No unrelated modifications
- Existing functionality remains intact
- Existing inventories remain compatible
- Existing JSON backups remain compatible

Deliver:

- Implementation summary
- Modified file list
- Regression assessment
- Manual testing checklist
- ZIP containing only modified files

---

# Accessibility

Accessibility is a core requirement.

The project aims to provide:

- WCAG-conscious interfaces
- Color-blind friendly design
- Screen reader compatibility
- Native controls where appropriate
- Large touch targets
- Keyboard accessibility
- Reduced motion support

Accessibility should never be treated as an afterthought.

---

# Offline Philosophy

Offline capability is fundamental.

Users should always be able to:

- View inventory
- Search inventory
- Filter inventory
- Add items
- Edit items
- Delete items
- Export backups
- Restore backups

without an Internet connection.

---

# Data Storage

Current storage mechanism:

- localStorage

Current storage key:

```
itemworth.inventory.v1
```

Future updates should preserve backward compatibility whenever reasonably possible.

---

# Quality Standards

Every release should satisfy the following requirements:

- Production build passes
- No console errors
- No regressions
- Backward compatibility maintained
- Accessibility reviewed
- Responsive layout verified
- Offline functionality verified

---

# Current Roadmap

Current version:

- Version 1.1.1

Completed:

- Milestone 1 — Foundation
- Milestone 2A — Inventory Management
- Milestone 2B — Backup & Restore
- Milestone 2C — Progressive Web App
- Milestone 3A — First-Run Experience
- Milestone 3B — Rich Item Information
- Milestone 3C — Organization Enhancements
- Milestone 4A — Accessibility Review
- Milestone 4B — Performance & Reliability
- Milestone 4C — Final Polish & Version 1.0
- Milestone 5A — Public Deployment
- Milestone 5B — Public Feedback & Support
- Maintenance Release v1.1.1 — Browser Storage Availability Fix

---

# Development Environment

Primary development platform:

- Android
- Termux
- Git
- GitHub

The project is intentionally developed without requiring a desktop operating system.

---

# Repository Standards

Contributors should:

- Preserve architecture.
- Preserve formatting.
- Preserve naming conventions.
- Preserve storage compatibility.
- Preserve offline functionality.
- Preserve accessibility.
- Favor incremental improvements.
- Keep changes narrowly scoped.
- Avoid unnecessary complexity.

The goal is for every milestone to feel like a natural evolution of the existing codebase rather than a rewrite.

---

# License

Copyright © 2026 Dani Terry.

All rights reserved.
