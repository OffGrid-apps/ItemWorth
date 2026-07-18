# Security Policy

## Supported Version

Security fixes are applied to the latest publicly released version of ItemWorth.

| Version | Supported |
| ------- | --------- |
| 1.2.x   | Yes       |
| Earlier versions | No |

Users should use the current version of the application available through the official ItemWorth deployment:

https://offgrid-apps.github.io/ItemWorth/

## Reporting a Security Vulnerability

Do not report suspected security vulnerabilities through a public GitHub Issue, discussion, social-media post, or public comment.

Use GitHub's private vulnerability-reporting system:

https://github.com/OffGrid-apps/ItemWorth/security/advisories/new

Please include:

- A clear description of the suspected vulnerability
- The affected ItemWorth version
- Device model
- Operating-system version
- Browser name and version
- Whether ItemWorth was installed as a Progressive Web App
- Exact steps required to reproduce the problem
- The expected behavior
- The observed behavior
- The potential security or privacy impact
- Any safe supporting evidence

Do not include real inventory backups, serial numbers, addresses, receipts, exact storage locations, personal photographs, or other sensitive user information.

Use sample or redacted data whenever possible.

## Response Process

Security reports will be reviewed and evaluated based on reproducibility, severity, affected versions, and potential impact.

A report may be closed if it:

- Cannot be reproduced
- Does not describe a security vulnerability
- Applies only to an unsupported version
- Depends on behavior outside ItemWorth's control
- Contains insufficient information for investigation

Valid reports may be handled privately through a GitHub repository security advisory until a correction is available.

## Security Scope

Examples of potentially valid security concerns include:

- Unauthorized exposure of locally stored inventory information
- Unsafe handling of imported backup data
- Script execution caused by inventory content
- Circumvention of intended data-isolation behavior
- Dependency vulnerabilities that materially affect ItemWorth users
- Application behavior that exposes private inventory information without user action

General bugs, feature requests, usability concerns, and ordinary data-loss reports should use the regular GitHub Issue forms unless they involve a credible security or privacy vulnerability.

## Privacy Notice

ItemWorth stores inventory information locally in the user's browser profile.

Security reports must never contain another person's private information or unredacted copies of real inventory data.
