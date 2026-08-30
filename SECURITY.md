# Security policy

## Supported version

Security fixes are applied to the latest commit on `main`.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability, exposed credential, or
privacy problem. Use GitHub's private vulnerability report form:

https://github.com/Capx-AI/casa/security/advisories/new

Include the affected path, impact, reproduction steps, and any suggested fix.
Do not include real company-brain data or credentials. Maintainers will acknowledge
a complete report within five business days and coordinate remediation and disclosure.

## Scope

The Casa core is offline-first. Reports are especially useful when they involve:

- unintended file access or disclosure
- command or argument injection
- a network path in the public core
- unsafe handling of keys or attestations
- dependency or GitHub Actions supply-chain risk
- a way to bypass approval or state-mutation gates

