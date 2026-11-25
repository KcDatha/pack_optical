# DECISIONS.md

> **SECURITY RULE: NEVER STORE SECRETS OR SENSITIVE DATA IN THIS FILE.**
> Never record API keys, tokens, passwords, credentials, connection strings, private certificates, environment variable values containing secrets, or sensitive production or customer data. Use generic descriptions and safe references instead.

Project: Pack Optical / Med Spa

This is the project's long-term log of decisions, findings, client agreements, and significant production changes. It is not a diary or task tracker.

**Rules:** newest entries at the top, below the `---` line below. Entries are immutable; changes are recorded as new entries that reference the original ID. Dates use YYYY-MM-DD. Entry types: DECISION, FINDING, CLIENT AGREEMENT, PRODUCTION, RESOLUTION, CORRECTION. IDs: DEC/FND/AGR/PRD/RES/COR-YYYYMMDD-NNN.

**Entry template**

```
## [YYYY-MM-DD] [TYPE] Short Descriptive Title
ID: 
Status: Confirmed / Proposed / Open / Investigating / Resolved / Superseded
Context: 
Decision or Finding: 
Reasoning: 
Impact: 
Reference: 
Follow-up: 
```

**Related project documents (authoritative sources; do not duplicate):** `BUILD_PLAN.md`, `4_DAY_SPRINT.md`, `demo.html`

---

<!-- New entries go immediately below this line. -->

## [2026-11-25] DECISION Static Astro images via astro:assets; staging noindex by env flag
ID: DEC-20251125-001
Status: Confirmed
Context: Sprint Day 1 image pipeline and staging protection.
Decision or Finding: Demo images extracted to assets-source/, optimised copies in src/assets/ and served as sized WebP through astro:assets. Staging builds set PUBLIC_NOINDEX=1 to emit noindex; production omits it.
Reasoning: One pipeline reused by all pages; no risk of indexing staging.
Impact: Day 4 staging deploy must set the flag; production must not.
Reference: 4_DAY_SPRINT.md Day 1, Day 4
Follow-up: Verify flag state on Day 4.
