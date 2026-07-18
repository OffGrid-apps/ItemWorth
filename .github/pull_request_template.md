## Summary

Describe the change clearly and concisely.

## Related Issue

Closes #

A pull request should normally be associated with an approved issue or prior maintainer discussion.

## Problem

Explain the specific problem this change addresses.

## Solution

Explain what was changed and why this approach was selected.

## Modified Files

List every modified file and explain why it changed.

- `path/to/file` — Reason for the change

## Verification Performed

Check every applicable item.

- [ ] Production build succeeds
- [ ] Application opens normally
- [ ] Existing inventory records still load
- [ ] Items can be added
- [ ] Items can be edited
- [ ] Items can be deleted
- [ ] Search, filtering, sorting, and grouping still work
- [ ] JSON backup still works
- [ ] JSON restoration still works
- [ ] CSV export still works
- [ ] Responsive layouts remain usable
- [ ] Keyboard focus remains visible and logical
- [ ] Screen-reader labels and status messages were reviewed
- [ ] Offline operation was verified
- [ ] No unexpected console errors were introduced
- [ ] No unrelated files were changed

Mark tests that do not apply as explained in the Testing Notes section.

## Testing Notes

Describe:

- Devices tested
- Operating systems tested
- Browsers tested
- Viewport sizes tested
- Online and offline testing
- Installed-PWA testing
- Any tests that were not performed and why

## Accessibility

Describe any effect on:

- Keyboard navigation
- Focus management
- Screen-reader behavior
- Touch-target sizes
- Color and contrast
- Reduced-motion behavior
- Responsive layouts

Use `No accessibility impact` only after reviewing the change.

## Privacy and Security

Confirm that:

- [ ] No private inventory information is included
- [ ] No real JSON backup is included
- [ ] No serial numbers, receipts, addresses, or private photographs are included
- [ ] No credentials, secrets, or personal authentication information are included
- [ ] Any sample data is fictional or thoroughly redacted

Describe any privacy or security implications:

## Storage and Compatibility

Describe any effect on:

- Existing `localStorage` inventory records
- The `itemworth.inventory.v1` storage key
- Supported JSON backups
- CSV export
- Imported records
- Earlier ItemWorth versions

Confirm that:

- [ ] Existing stored inventories remain compatible
- [ ] Supported JSON backups remain compatible
- [ ] No storage key was changed without prior approval

## Offline Behavior

Describe how this change affects offline operation.

Confirm that:

- [ ] Normal inventory features remain usable offline
- [ ] No unnecessary network dependency was added
- [ ] Service Worker or caching behavior was tested when affected

## Dependencies

- [ ] This change adds no dependency
- [ ] This change modifies a dependency with prior approval

When a dependency changes, explain its necessity, size, maintenance status, licensing, privacy implications, offline implications, and long-term maintenance cost.

## Scope Confirmation

Confirm that:

- [ ] The change addresses one approved concern
- [ ] The implementation is the smallest clean solution
- [ ] Existing architecture and naming conventions were preserved
- [ ] Unrelated refactoring was avoided
- [ ] Unrelated formatting changes were avoided
- [ ] Project documentation was updated when required

## Screenshots

Add privacy-safe before-and-after screenshots for visible interface changes.

Remove this section when screenshots are not applicable.

## Known Limitations or Risks

Describe any remaining limitations, edge cases, trade-offs, or regression risks.

Write `None identified` only after reviewing the change carefully.

## Final Contributor Confirmation

- [ ] I reviewed every submitted change
- [ ] I verified the information in this pull request
- [ ] I followed `CONTRIBUTING.md`
- [ ] I am permitted to contribute all submitted code, text, and other material
- [ ] AI-assisted content, if used, was reviewed and tested by me
