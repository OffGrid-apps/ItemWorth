# ItemWorth Roadmap

> **Product roadmap for ItemWorth — an offline-first, privacy-focused personal inventory application.**

This roadmap outlines the planned evolution of ItemWorth. It reflects the current state of development and the intended direction of the project. Milestones are implemented incrementally to preserve stability, maintain backward compatibility, and ensure a high-quality user experience.

---

# Project Status

**Application:** ItemWorth

**Current Version:** v1.1.1

**Development Status:** Public Deployment, Support, and Browser Storage Recovery Complete

**Current Milestone:** v1.1.1 — Browser Storage Availability Fix (Complete)

---

# Vision

ItemWorth is designed to be a dependable, offline-first inventory management application that helps people organize, document, and estimate the value of their belongings without sacrificing privacy.

The application is intended for:

- Home inventory management
- Insurance documentation
- Moving preparation
- Estate planning
- Asset organization
- Personal record keeping

ItemWorth is built around a simple philosophy:

- Your data belongs to you.
- Your inventory should remain available without an Internet connection.
- Core functionality should never depend on online services.

---

# Guiding Principles

Every release should reinforce the following principles:

- Offline-first
- Privacy-first
- Mobile-first
- Accessibility-first
- Color-blind-friendly design
- Responsive interface
- Lightweight architecture
- Minimal dependencies
- Long-term maintainability
- Backward compatibility

Stability is always prioritized over feature quantity.

---

# Completed Milestones

## ✅ Milestone 1 — Foundation

**Status:** Complete

Established the core application architecture.

Highlights:

- React + Vite foundation
- Responsive mobile-first interface
- Inventory CRUD operations
- Dashboard
- Local storage persistence
- Design system
- Offline-first architecture

---

## ✅ Milestone 2A — Inventory Management

**Status:** Complete

Expanded inventory management capabilities.

Features:

- Search
- Category filtering
- Sorting
- Dashboard improvements
- CSV export

---

## ✅ Milestone 2B — Backup & Restore

**Status:** Complete

Added data protection and recovery features.

Features:

- JSON backup
- JSON restore
- Import preview
- Duplicate detection
- Import validation
- Backward-compatible data import

---

## ✅ Milestone 2C — Progressive Web App

**Status:** Complete

Added Progressive Web App support.

Features:

- Installable PWA
- Offline support
- Service Worker integration
- Update notifications
- Offline status indicator
- Web App Manifest

---

## ✅ Milestone 3A — First-Run Experience

**Status:** Complete

Improved the onboarding experience.

Features:

- Welcome panel
- Sample inventory
- Enhanced empty state
- First-run guidance

---

## ✅ Milestone 3B — Rich Item Information

**Status:** Complete

Expanded the information that can be stored for each inventory item.

Features:

- Serial numbers
- Purchase dates
- Condition tracking
- Photo attachments
- Client-side image compression
- Expandable item details
- Search by serial number
- Backward-compatible storage updates

---

## ✅ Milestone 3C — Organization Enhancements

**Status:** Complete

Improved organization, navigation, and data entry.

Features:

- Group inventory by location
- Toggle between grouped and flat views
- Per-location item counts and value subtotals
- Custom tags with multiple tags per item
- Search and filter by tag
- Tag chips displayed on inventory cards
- Location autocomplete for faster data entry
- Expanded CSV export (Serial Number, Purchase Date, Condition, Tags)

---

## ✅ Milestone 4A — Accessibility Review

**Status:** Complete

Conducted a WCAG-focused accessibility audit and implemented targeted improvements.

Issues resolved:

- Added skip-to-content link (WCAG 2.4.1)
- Auto-focus on item form open (WCAG 2.4.3)
- Focus returned to trigger element when dialogs close (WCAG 2.4.3)
- Keyboard focus trap implemented in modal dialogs (WCAG 2.1.2, 2.4.3)
- ChevronIcon transition moved to CSS, respects prefers-reduced-motion (WCAG 2.3.3)
- Photo file inputs now have programmatic label association (WCAG 4.1.2)
- Item card tag chip touch targets improved (WCAG 2.5.5)

Known deferred issue:

- `--color-text-muted` (#94a3b8) contrast ratio is below AA for normal text.
  Deferred to Milestone 4C to allow a holistic design review without disrupting
  the current visual hierarchy.

---

# Completed Milestones (continued)

## ✅ Milestone 4B — Performance & Reliability

**Status:** Complete

Improved storage reliability and error handling.

Features:

- localStorage quota detection and user-visible error toasts
- Proactive storage warning when usage exceeds 80%
- Hardened saveItems with QuotaExceededError handling
- Clear, actionable error messages directing users to free space

---

# Completed Milestones (final)

## ✅ Milestone 4C — Version 1.0 Release

**Status:** Complete

Completed objectives:

- Final interface polish
- Color contrast review, including --color-text-muted
- Static page muted-text contrast alignment
- PWA update-check interval cleanup
- Sample inventory data-shape consistency
- Documentation review
- Production readiness assessment
- Version 1.0 release

---

## ✅ Milestone 5A — Public Deployment

**Status:** Complete

Published ItemWorth as a publicly accessible and installable web application.

Completed objectives:

- GitHub Pages hosting
- Automated deployment through GitHub Actions
- Public live-app URL
- GitHub Pages base-path configuration
- Installed-PWA launch-path correction
- About, Privacy, and Terms navigation fixes
- Verified online and offline installed-app behavior
- README live-demo link and application screenshots

---

## ✅ Milestone 5B — Public Feedback and Support

**Status:** Complete

Added structured, privacy-conscious support channels for public users.

Completed objectives:

- Structured GitHub bug-report issue form
- Structured GitHub feature-request issue form
- Privacy guidance for public issue submissions
- PWA, offline, installation, and persistence diagnostic prompts
- README feedback and support documentation
- About-page links to the live app, repository, bug reports, and feature requests
- Disabled unstructured blank issues

---

## ✅ v1.1.1 — Browser Storage Availability Fix

**Status:** Complete

Corrected a production startup defect discovered through real-user testing.

Completed objectives:

- Prevented a blank white screen when browser storage is blocked or unavailable
- Added a pre-start browser-storage availability check
- Added an accessible storage-recovery screen
- Added clear Chrome Android recovery instructions
- Protected welcome and install preference storage operations
- Replaced unreliable same-document retry behavior with full-document reload recovery
- Preserved existing inventory, backups, PWA configuration, and offline behavior
- Verified the correction on a Moto G 5G (2024) running Android 15 and Chrome 149.0.7827.200

---

# Future Considerations

The following ideas may be evaluated after Version 1.0. They are exploratory and are **not currently scheduled**.

Potential areas of exploration include:

- Barcode scanning
- Receipt management
- Additional reporting tools
- Advanced inventory analytics
- Additional export formats
- Optional cloud synchronization
- Cross-device synchronization

Future priorities will be determined based on project goals and user feedback.

---

# Release Philosophy

ItemWorth is developed through small, carefully scoped milestones.

Every release is expected to:

- Preserve existing user data
- Maintain backward compatibility
- Build successfully in production
- Preserve offline functionality
- Maintain accessibility standards
- Improve usability without unnecessary complexity

Incremental improvements are preferred over large-scale rewrites.

---

# Version History

| Version | Status    | Description                     |
|---------|-----------|----------------------------------|
| v0.1.0  | Released  | Initial Foundation               |
| v0.2.0  | Released  | Inventory Management             |
| v0.3.0  | Released  | Backup & Restore                 |
| v0.4.0  | Released  | Progressive Web App              |
| v0.5.0  | Released  | First-Run Experience             |
| v0.6.0  | Released  | Rich Item Information            |
| v0.7.0  | Released  | Organization Enhancements        |
| v0.8.0  | Released  | Accessibility Review             |
| v0.9.0  | Released  | Performance & Reliability        |
| v1.0.0  | Released  | Version 1.0 Release              |
| v1.0.1  | Released  | GitHub Pages & Offline Fixes      |
| v1.1.0  | Released  | Public Feedback & Support         |
| v1.1.1  | Released  | Browser Storage Availability Fix  |

---

# Long-Term Goal

The long-term goal of ItemWorth is to provide a dependable, privacy-respecting inventory management solution that remains lightweight, maintainable, and fully functional without requiring accounts, subscriptions, servers, or cloud infrastructure.

Every milestone should strengthen the application's reliability, usability, accessibility, and offline capabilities while preserving the simplicity that defines the project.
