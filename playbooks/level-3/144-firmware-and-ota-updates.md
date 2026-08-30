---
id: firmware-and-ota-updates
title: Firmware & OTA Updates
level: 3
summary: Architect the device firmware, a secure signed over-the-air update channel, fleet management, and a safe rollback path so a connected device can be fixed and improved in the field without bricking units.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
existential_at: [launched, revenue]
model_fit: [physical_goods]
selection_hint: Run for any connected device that ships firmware. A device with no secure update path cannot be patched for a security flaw or a field bug, and a bad push with no rollback bricks the installed base. Build the update channel before the device ships, not after the first recall.
depends_on:
  - hardware-prototyping-and-dfm
soft_after:
  - contract-manufacturing-setup
produces:
  - firmware_ota
consumes:
  - hardware_prototype
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: firmware-ota-ready
---
# Firmware & OTA Updates

A connected hardware product ships with a defect it does not yet know about. The only
question is whether the company can fix that defect in the field or has to recall the
fleet. This playbook builds the firmware architecture, a cryptographically signed
over-the-air (OTA) update channel, the device-management backend that tracks and
targets units, and the rollback path that makes pushing an update safe. The two failure
modes it exists to prevent are a security vulnerability that cannot be patched and a bad
update that bricks units with no way back. Both are existential once devices are in
customers' hands.

## Procedure

1. Fix the firmware architecture. Partition the image into a hardware-locked bootloader,
   an application image, and a configuration store. Reserve a dual-bank (A/B) flash
   layout so a new image is written to the inactive bank and only activated after it
   verifies and boots, leaving the known-good image to fall back to.
2. Establish a secure boot and signing chain. Provision a signing key in an HSM or
   hardware key store, sign every image, and have the bootloader verify the signature and
   version before it runs. The device runs only firmware the company signed, and never
   accepts a downgrade below a security floor (anti-rollback counter).
3. Build the OTA delivery channel. Define how a device checks in, authenticates to the
   update server with a per-device identity (not a shared secret), downloads the delta or
   full image over TLS, verifies the signature and hash, and applies it to the inactive
   bank. Resume interrupted downloads; never apply a partially received image.
4. Stand up fleet management. Maintain a device registry keyed by unique device ID with
   model, current firmware version, hardware revision, last check-in, and group tags.
   This is the source of truth for who is on what and what to target.
5. Make every rollout staged and reversible. Push to an internal ring, then a small
   canary cohort, then graduated waves, watching the post-update boot-success rate and
   crash and check-in telemetry at each gate. Halt the rollout automatically if the canary
   boot-success or check-in rate drops below threshold, and roll the cohort back to the
   prior bank.
6. Instrument and own the update health metrics: rollout success rate, post-update boot
   failures, devices stuck on old versions, and the time to patch a disclosed
   vulnerability. Define who is paged when a rollout regresses.

## Output

`firmware_ota` in the company brain: the firmware architecture and signing chain, the
secure OTA delivery channel, the device-fleet registry and targeting, and the staged
rollout and rollback runbook with its halt thresholds. This unblocks shipping a
field-serviceable connected device and feeds the QA, warranty, and incident processes.

## Rules

- Never ship a device with no rollback. A single-bank device that fails to boot after an
  update is a brick and a truck roll; A/B with verified activation is non-negotiable.
- The device trusts only signed firmware and never downgrades past the anti-rollback
  floor. An unsigned or downgradeable update channel is a remote-code-execution path into
  the entire fleet.
- Roll out in stages behind health gates, never to 100% at once. The canary cohort exists
  so a bad image hits hundreds of units, not the whole installed base.
- Per-device identity, not a shared key. One leaked shared secret compromises every unit.

Revisit on a new hardware revision, a disclosed vulnerability, or a change to the signing
infrastructure. Deepen this same update channel rather than building a second one.
