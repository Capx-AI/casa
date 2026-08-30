# Opportunity Brief: InboxPilot

*Example artifact for a fictional company, produced to show the shape and standard of Casa output. The signals below are illustrative.*

Playbook: opportunity-scan (Level 0, Strategy). Produces: opportunity_brief, candidate_niches.

## Aggregated signals from at least three channels

**Channel 1: community complaints about email overload.** Sweep of productivity, careers, and role-specific communities (subreddits for consultants, recruiters, and executive assistants; workplace forums; founder communities). Recurring signal shapes: "I came back from two days off to a 40-message thread and had no idea what was decided" [confidence: high that this complaint class is common; counts not tallied]; "I rewrite the same three replies all day" [high]; "I spend the first hour of every day just triaging" [high]. Workaround evidence, the strongest demand signal in this channel: people pasting threads into general-purpose chatbots to get a summary, then complaining about the copy-paste friction and about pasting client email into a consumer chatbot [medium].

**Channel 2: reviews of adjacent tools.** Review sweep across browser-extension store listings and software review sites for AI email assistants and premium email clients. Praise clusters on time saved per thread; one-star clusters on three failures: drafts that do not sound like the sender [high], summaries that miss the one action item that mattered [high], and per-seat pricing that feels heavy for a single-user tool [medium]. Reviews repeatedly ask for "just handle the long threads" as a standalone capability rather than a full inbox replacement [medium].

**Channel 3: search demand.** Keyword-tool pull on the cluster around "summarize email thread," "AI email reply," "catch up on email after vacation," and "email overload." The cluster shows steady, non-seasonal volume with a visible rise since AI assistants went mainstream [medium; exact volumes not verified, directional read only]. Suggest and People-also-ask surfaces skew toward how-to intent ("how to summarize a long email chain"), which signals an unmet job rather than brand search for an incumbent [medium].

Cross-channel note: no direct willingness-to-pay instrument (pricing survey, preorder page) has been run yet. WTP evidence below is inferred from adjacent-tool pricing and review complaints, and is tagged accordingly.

## Candidate niches clustered by job and audience

- **N1. Client-services professionals** (consultants, agency account managers, freelancers). Job: reconstruct a long client thread fast and reply in a voice that will be forwarded to other clients. Supported by channel 1 complaint volume, channel 2 "does not sound like me" reviews, and channel 3 how-to searches (3 channels).
- **N2. Recruiters and coordinators.** Job: extract status and next step from multi-party scheduling threads. Supported by channel 1 role-community complaints and channel 2 reviews asking for action-item extraction (2 channels).
- **N3. Sales reps.** Job: draft prospect replies inside the thread. Supported by channels 1 and 2, but the job is already served inside CRM-attached assistants (2 channels).
- **N4. Managers and executives with high inbound.** Job: morning triage of the whole inbox. Supported by all 3 channels, but the job pulls toward a full email client, not an extension (3 channels).

## Each candidate scored on urgency, frequency, willingness to pay, reachability, and crowding

Scores 1 to 5. Higher is better except crowding, where higher means more crowded.

| Niche | Urgency | Frequency | Willingness to pay | Reachability | Crowding |
|---|---|---|---|---|---|
| N1 Client-services | 4 | 5 (daily) | 4 [medium: inferred from adjacent-tool pricing] | 4 (role communities, LinkedIn) | 3 |
| N2 Recruiters | 4 | 5 (daily) | 3 [low: employer often pays, tool budgets contested] | 4 | 3 |
| N3 Sales reps | 3 | 5 | 3 [medium] | 3 | 5 (CRM assistants own this) |
| N4 Executives | 5 | 5 | 4 [medium] | 2 (expensive to reach, low self-serve) | 4 (premium clients, native provider AI) |

## Ranked niches with a confidence tag per claim

1. **N1 Client-services professionals** [confidence: medium-high]. Only candidate with three-channel support, daily frequency, self-serve reachability, and crowding concentrated in full-inbox tools rather than the thread-level job. The "sounds like me" failure of incumbents is the wedge [high]. Fits the 8 dollars a month self-serve price point [medium, no direct WTP instrument yet].
2. **N2 Recruiters** [confidence: medium]. Strong pain, weaker WTP path; strong second audience once N1 proves the engine.
3. **N4 Executives** [confidence: low-medium]. Highest urgency but poor self-serve reachability and heavy crowding from premium clients and native provider AI.
4. **N3 Sales reps** [confidence: low]. Crowded out; do not pursue.

**Recommendation:** validate N1 first. Next play: problem validation interviews with 10 client-services professionals, plus a smoke-test landing page to convert the search-demand cluster into a measurable WTP signal, closing the one evidence gap named above.
