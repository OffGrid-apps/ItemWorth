# ItemWorth Support

This page explains how to get help with ItemWorth and where to report different types of problems.

## Start Here

Before submitting a report:

1. Confirm that you are using the current public version of ItemWorth.
2. Reload the application.
3. Check whether the problem occurs while online, offline, or both.
4. Check whether the problem occurs in the browser, the installed Progressive Web App, or both.
5. Search the existing GitHub Issues for the same problem.
6. Create a current JSON backup before troubleshooting when ItemWorth remains accessible.

- [Open ItemWorth](https://offgrid-apps.github.io/ItemWorth/)
- [Read the project documentation](README.md)
- [View current releases](https://github.com/OffGrid-apps/ItemWorth/releases)
- [Search existing issues](https://github.com/OffGrid-apps/ItemWorth/issues)

## Report a Reproducible Problem

Use the bug-report form when ItemWorth behaves incorrectly or a feature no longer works:

[Report an ItemWorth problem](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=bug_report.yml)

Include:

- ItemWorth version
- Device model
- Operating-system version
- Browser name and version
- Whether ItemWorth was installed
- Whether the device was online or offline
- Exact steps that reproduce the problem
- Expected behavior
- Actual behavior
- Whether the problem occurs consistently
- A privacy-safe screenshot when useful

Do not submit several unrelated problems in one issue.

## Suggest an Improvement

Use the feature-request form for focused product improvements:

[Suggest an ItemWorth improvement](https://github.com/OffGrid-apps/ItemWorth/issues/new?template=feature_request.yml)

Explain:

- The problem you are trying to solve
- Who experiences the problem
- Why the existing behavior is insufficient
- The smallest useful improvement
- Any effect on privacy
- Any effect on offline operation
- Any effect on accessibility
- Any effect on backup or storage compatibility

Feature requests are evaluated according to usefulness, project scope, implementation risk, and long-term maintenance requirements.

## Report a Security or Privacy Vulnerability

Do not disclose suspected security vulnerabilities through a public issue.

Use GitHub's private vulnerability-reporting system:

[Privately report a vulnerability](https://github.com/OffGrid-apps/ItemWorth/security/advisories/new)

See [SECURITY.md](SECURITY.md) for the complete security-reporting policy.

## Storage and Data Recovery

ItemWorth stores inventory information locally in the current browser profile.

Inventory data may be lost if browser storage is cleared, the browser is reset or removed, the device is lost, or access to the browser profile is lost.

ItemWorth cannot recover deleted local inventory information from a server because ItemWorth does not operate a remote inventory database.

When a valid JSON backup exists:

1. Open ItemWorth.
2. Select **Import** or **Restore from backup**.
3. Choose the JSON backup file.
4. Review the import information.
5. Confirm the restoration.

Create regular JSON backups and store them somewhere separate from the browser containing the active inventory.

## Installation and Offline Help

On supported devices and browsers, ItemWorth can be installed as a Progressive Web App.

The browser may label the installation option as:

- Install app
- Add to Home screen
- Install ItemWorth
- Create shortcut

If installation is unavailable:

1. Confirm that ItemWorth is open in a supported browser.
2. Reload the application.
3. Confirm that the browser allows website storage.
4. Confirm that the browser is not using a restricted or temporary browsing mode.
5. Check whether the browser menu contains an installation option.

ItemWorth should continue operating offline after the required application resources have loaded successfully.

Internet access is still required for GitHub Issues, release updates, and other external websites.

## Privacy Requirements

Never include real private inventory information in a public issue, pull request, screenshot, or comment.

Do not publicly submit:

- JSON backup files
- Complete inventory lists
- Serial numbers
- Receipts
- Addresses
- Exact storage locations
- Personal photographs
- Sensitive notes
- Other personally identifying information

Use fictional, sample, or thoroughly redacted information.

## Support Boundaries

ItemWorth support does not provide:

- Professional item appraisals
- Insurance coverage decisions
- Legal advice
- Tax advice
- Guaranteed recovery of deleted browser data
- Device repair
- General browser-account recovery
- Support for unofficial modified versions of ItemWorth

ItemWorth values and records are entered and maintained by the user.

## Contributing

For documentation changes, testing, or proposed code contributions, read:

[CONTRIBUTING.md](CONTRIBUTING.md)
