# Core and extension boundary

Casa is designed to be useful without Capx infrastructure or any hosted service.
The repository is the complete offline core, not a vendor-flavored distribution
that downstream users must trim before forking.

## What the core guarantees

- Routing, company-brain state, playbooks, local artifacts, and CAF verification
  run with Node.js 20 or newer and zero runtime dependencies.
- The plugin has no telemetry, account, hosted backend, background upload, or
  publishing hook.
- The core never imports an optional integration.
- A clean clone passes its tests without sibling repositories, private contracts,
  network access, or cloud credentials.

## How to build an integration

Build hosted publishing, billing, deployment, or registry support in a separate
package or plugin. An integration may invoke Casa's documented CLIs and consume
public CAF files, but Casa must never import it.

An integration should:

1. State exactly what files and fields it reads.
2. Require explicit installation and configuration.
3. Require an explicit command before transmitting data.
4. Show the destination and disclosed payload before the first transmission.
5. Store credentials outside `company-brain/` and the project repository.
6. Fail closed on malformed state and fail safely when offline.
7. Maintain its own service, deployment, and integration tests.

The preflight validator enforces the core side of this boundary. Pull requests
that add network clients, hosted-service trees, deployment state, or SessionEnd
publishing hooks to the core should be rejected.
