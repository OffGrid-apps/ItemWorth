# Contributing to ItemWorth

Thank you for your interest in improving ItemWorth.

ItemWorth is an independently maintained, privacy-first, offline-first Progressive Web App. Contributions should preserve its reliability, accessibility, local-only architecture, and intentionally small technical footprint.

## Ways to Contribute

You can help ItemWorth by:

- Reporting reproducible bugs
- Suggesting focused improvements
- Testing the application on additional devices and browsers
- Reporting accessibility problems
- Improving documentation
- Reviewing privacy, offline, storage, or responsive behavior
- Proposing narrowly scoped code changes after prior discussion

## Before Contributing Code

Please open an issue before beginning a code change.

Use the appropriate form:

- [Report a problem](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=bug_report.yml)
- [Suggest an improvement](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=feature_request.yml)
- [View existing issues](https://github.com/OffGrid-apps/ItemWorth/issues)

Describe the proposed change and wait for confirmation that it fits the project direction.

Unrequested pull requests may be closed when they:

- Introduce work that was not discussed
- Expand the project beyond its approved scope
- Change architecture unnecessarily
- Add avoidable dependencies
- Break storage or backup compatibility
- Reduce accessibility
- Alter unrelated files
- Duplicate existing or planned work

Prior discussion prevents contributors from spending time on changes that cannot be accepted.

## Project Priorities

Every contribution should reinforce these principles:

- Offline-first operation
- Privacy-first design
- Local storage of inventory information
- No required accounts
- No backend or cloud database
- Mobile-first usability
- Accessibility
- Color-blind-friendly design
- Minimal dependencies
- Small and understandable code
- Backward compatibility
- Long-term maintainability

## Scope Requirements

Code changes should:

- Address one clearly defined problem
- Use the smallest clean implementation
- Preserve the existing architecture
- Preserve established naming and formatting
- Avoid unrelated refactoring
- Avoid speculative features
- Avoid unnecessary configuration
- Avoid unnecessary dependencies
- Preserve existing stored inventories
- Preserve supported JSON backups
- Preserve offline functionality
- Preserve responsive layouts
- Preserve keyboard and screen-reader behavior

If a proposed change requires a broader architectural revision, explain the need before implementation.

## Bug Reports

A useful bug report should include:

- ItemWorth version
- Device model
- Operating-system version
- Browser name and version
- Whether ItemWorth was installed as a Progressive Web App
- Whether the device was online or offline
- Exact reproduction steps
- Expected behavior
- Actual behavior
- Whether the problem occurs consistently
- Relevant screenshots that contain no private information

Before reporting a bug:

1. Confirm that the problem occurs in the current release.
2. Reload the application.
3. Check whether the problem occurs in both browser and installed-PWA modes when applicable.
4. Search existing issues for the same problem.
5. Remove private information from screenshots and examples.

## Feature Requests

Feature requests should explain:

- The problem being solved
- Who experiences the problem
- Why the existing behavior is insufficient
- The smallest useful solution
- Any effect on privacy
- Any effect on offline operation
- Any effect on accessibility
- Any effect on storage compatibility
- Any additional maintenance burden

Feature requests are evaluated according to practical user value, project scope, implementation risk, and long-term maintenance cost.

## Privacy Requirements

Never include real private inventory information in an issue, pull request, test fixture, screenshot, or discussion.

Do not submit:

- JSON backups containing real inventory data
- Complete personal inventory lists
- Serial numbers
- Receipts
- Home addresses
- Exact storage locations
- Personal photographs
- Sensitive notes
- Authentication information
- Other personally identifying information

Use fictional, sample, or thoroughly redacted information.

Suspected security vulnerabilities should be reported privately through GitHub's private vulnerability-reporting feature rather than through a public issue.

See [SECURITY.md](SECURITY.md) for the reporting process.

## Development Setup

Requirements:

- Node.js
- npm
- Git

Clone the repository and install dependencies:

```bash
git clone https://github.com/OffGrid-apps/ItemWorth.git
cd ItemWorth
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Required Verification

Before proposing a code change, verify that:

- The production build succeeds
- The application opens normally
- Existing inventory records still load
- Items can be added
- Items can be edited
- Items can be deleted
- Search and filtering still work
- JSON backup still works
- JSON restoration still works
- CSV export still works
- Responsive layouts remain usable
- Keyboard focus remains visible and logical
- The application still operates offline
- No unrelated files have changed
- No unexpected console errors were introduced

Additional testing may be required depending on the affected behavior.

## Pull Request Requirements

A pull request should include:

- A concise title
- A clear description of the problem
- A description of the implemented solution
- The associated issue number
- A complete list of modified files
- Testing performed
- Responsive-layout results when applicable
- Accessibility considerations
- Storage and backup compatibility considerations
- Offline-behavior considerations
- Known limitations or remaining risks

Keep each pull request limited to one approved concern.

Do not combine unrelated fixes, formatting changes, dependency updates, or refactoring in the same pull request.

## Dependencies

Do not add, remove, or substantially update dependencies without prior approval.

A dependency proposal must explain:

- Why existing platform features are insufficient
- Why the dependency is necessary
- Its maintenance status
- Its size and performance effect
- Its privacy implications
- Its offline implications
- Its licensing compatibility
- The long-term maintenance cost

ItemWorth deliberately favors browser capabilities and small internal implementations over additional packages.

## Accessibility

Changes must not make the application dependent on:

- Color alone
- Mouse or touch input alone
- Unlabeled icon controls
- Invisible keyboard focus
- Unannounced status changes
- Motion that cannot be reduced

Use semantic HTML and native controls whenever practical.

Test keyboard navigation, focus behavior, labels, status messages, touch-target sizes, and responsive layouts.

## Artificial-Intelligence-Assisted Contributions

AI-assisted work is permitted, but the contributor remains responsible for:

- Reviewing every submitted change
- Verifying technical correctness
- Testing the behavior
- Confirming that no confidential information was included
- Confirming that submitted material may legally be contributed
- Identifying unsupported assumptions
- Avoiding fabricated test results or documentation

Do not submit unreviewed generated code.

## Licensing

ItemWorth is publicly viewable but is not currently licensed for unrestricted copying, modification, redistribution, sublicensing, or commercial reuse.

The repository's [LICENSE](LICENSE) file is authoritative.

Do not submit code, images, text, or other material copied from another source unless it can legally be included and its origin and license are clearly documented.

## Maintainer Decisions

Acceptance of an issue, proposal, or pull request is not guaranteed.

Changes may be declined because of:

- Project scope
- Maintenance cost
- Architectural fit
- Reliability risk
- Privacy concerns
- Accessibility concerns
- Offline limitations
- Storage compatibility
- Licensing concerns
- Duplication
- Insufficient testing

The goal is controlled, dependable improvement rather than rapid feature expansion.
