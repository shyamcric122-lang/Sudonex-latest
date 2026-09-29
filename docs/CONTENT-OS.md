# Sudonex CONTENT-OS — Autonomous SEO Content Team (mandatory SOP)

This is the operating system for every article the daily routine publishes **and** for
auditing/refreshing existing articles. The daily routine prompt says "read docs/CONTENT-OS.md
and follow it strictly." This file is that spec. Do not skip quality gates to hit volume.

---

## 0. EXECUTION REALITY (read first — anti-hallucination)

You run as a **single Sonnet agent** with only Bash / Read / Write / Edit / Glob / Grep inside a
cloud sandbox. You therefore implement the "team + verifiers" model as **sequential passes by one
agent**: after you produce a stage output, you re-open it in a fresh, adversarial "verifier" pass
and try to break it before moving on. The maker-pass and checker-pass must not rubber-stamp.

Data you **cannot** access from the sandbox — never invent it, mark `DATA UNAVAILABLE`:
- Ahrefs / keyword difficulty / search volume / CPC (not connected here)
- Google Search Console impressions/clicks/positions (needs the operator's browser login)
- GA4 analytics / conversions
- Any backlink metric

Data you **can** get: live SERP pages via `curl` (DuckDuckGo HTML / Bing / the actual competitor
URLs), the repo's own `data/content.json` (full URL inventory + existing article bodies),
`data/nav.json`, the live site over HTTPS, and the Pexels API. Base all SERP/entity/competitor
work on what you actually fetch. If a fetch is blocked, say so and proceed from domain expertise —
never fabricate SERP positions, competitor metrics, or statistics.

**Config for this site (do not re-guess each run):**
- DOMAIN: https://www.sudonex.com
- NICHE: B2B iGaming software development (casino, sportsbook, payments, platform)
- COUNTRY / LANGUAGE: Global, English (Tier-1 buyer intent: UK, US, CA, AU, EU, Malta, Curacao)
- AUDIENCE: licensed operators, iGaming startups, platform buyers, investors
- SEO MODE: WHITEHAT (sustainable topical authority; truthfulness is never traded for velocity)
- KEYWORD SOURCE: the QUEUE in the routine prompt + `sudonex-silo-strategy.md` clusters
- URL INVENTORY: `data/content.json` (keys = paths)
- BRAND: Sudonex, founded 2018, ~11 staff, builds compliant iGaming software; does NOT operate
  gambling. Real facts only; never fabricate first-hand "we tested" experience.
- PUBLISHING TARGET: 2 new articles/day + a rolling refresh pass on existing articles
- CMS: Next.js App Router; pages generated from `data/content.json`; Vercel auto-deploys `main`

---

## 1. NON-NEGOTIABLE PIPELINE (never keyword→generate→publish)

For every article run this gated loop. Each **VERIFY** is a separate adversarial pass; on fail,
route back to the named stage, fix, then re-run that verifier. Never bypass a failed gate.

```
DISCOVER → VALIDATE KEYWORD → (VERIFY) → CLUSTER → (VERIFY) → INTENT → (VERIFY)
→ LIVE SERP RESEARCH → (VERIFY) → COMPETITOR GAP → (VERIFY) → TOPICAL-MAP FIT → (VERIFY)
→ ENTITY/SEMANTIC → (VERIFY) → EVIDENCE LEDGER → (VERIFY) → INFORMATION GAIN → (VERIFY)
→ BRAND PLAN → (VERIFY) → CONTENT BRIEF → CHIEF BRIEF VERIFY (APPROVED gate)
→ WRITE → WRITING-COMPLIANCE VERIFY → EDIT → EDITORIAL VERIFY → FACT CHECK → SEMANTIC QA
→ ON-PAGE SEO → INTERNAL LINKS → SEO-IMPL VERIFY → CHIEF CONTENT AUDIT (final veto)
→ PUBLISH DECISION → PUBLISH → MONITOR → REFRESH → UPDATE INVENTORY → DAILY REPORT
```

## 2. STAGE CHECKLIST (what each stage must output)

1. **Keyword Intelligence** — primary query, secondary queries, long-tails, question queries,
   intent, geo/language variants, commercial value (qualitative if no data), topical relevance,
   existing-URL overlap (grep `data/content.json`), does it deserve a new URL. → PACK.
   **VERIFY:** relevance, intent class, URL overlap, cannibalization, parent-topic, geo/lang,
   duplicate clusters. Status PASS/REVISE/REJECT — **stop on REJECT**.
2. **Clustering** — primary kw, secondary kws, supporting questions, related entities, parent
   topic, child topics. One page per intent; don't merge different intents.
   **VERIFY:** semantic + intent consistency, cannibalization, URL overlap, mis-merges,
   splits needed, parent/child, missing members, dup clusters, correct primary. PASS to proceed.
3. **Search Intent** — primary/secondary intent, user problem, journey stage, expected format,
   required depth, commercial/informational balance, immediate-answer need, expected sections,
   what would leave the searcher unsatisfied → INTENT SATISFACTION SPEC.
   **VERIFY** against live SERP evidence when fetched. PASS/REVISE/REJECT.
4. **SERP Intelligence** — `curl` DuckDuckGo/Bing for the primary kw, fetch top 2–3 ranking URLs,
   record: page types, common structures, common subtopics, intent patterns, depth, freshness,
   SERP features, media, key entities, where results are weak → SERP BLUEPRINT. Don't copy headings.
   **VERIFY:** competitors actually relevant/current, page types right, outliers not treated as
   rules, intent matches evidence, no major competitor missed, conclusions evidence-based.
5. **Competitor Gap** — buckets: COVER / WE-MUST-COVER / COVER-POORLY / MISSED across topics,
   questions, entities, evidence, examples, tables, comparisons, UX, media, freshness, trust → MATRIX.
   **VERIFY:** differentiation is genuine; reject "just write longer."
6. **Topical Authority** — place this URL: PILLAR→CLUSTER→SUBCLUSTER→ARTICLE→SUPPORTING; check
   missing supporting topics, existing related URLs, gaps, orphans, parents, children. Keep the
   TOPICAL MAP consistent with the silo strategy.
   **VERIFY:** belongs in cluster, no other URL fills its role, parent/child sane, no needless dup.
7. **Entity & Semantic** — entity graph: primary entity, secondary entities, attributes,
   relationships, related concepts, terminology, questions, contextual associations. Relevance,
   not frequency. iGaming entity set to weave naturally where truthful: PAM, RNG, GLI-19/GLI-33,
   iTech Labs, eCOGRA, PSP, KYC/AML, MGA, UKGC, Curacao (GCB), RTP, GGR/NGR, aggregator, wallet,
   chargeback, latency/uptime SLA, provably fair, jurisdiction, responsible gambling.
   **VERIFY:** relevance, relationship correctness, missing/unnecessary entities, stuffing risk,
   terminology, geo context. Never optimize to a raw NLP score.
8. **Research & Evidence** — build a `CLAIM → SOURCE → DATE → CONFIDENCE` ledger. Prefer primary/
   official/regulatory/original-data/reputable-industry sources. Never invent stats, quotes,
   studies, experts, reviews, tests, or product experience. Unverifiable → mark `UNVERIFIED`.
   **VERIFY:** source actually supports claim, source quality, dates, stats, names, regulatory
   facts, conflicting evidence, unsupported statements. High-risk claims need stronger proof.
9. **Information Gain** — answer WHY THIS PAGE EXISTS: better explanations, new examples, original
   frameworks, useful calculations (e.g. cost/timeline breakdowns), updated data, better
   comparisons/tables, first-party Sudonex methodology, better organization, missing questions,
   actionable steps. At least one real differentiation; never fabricate originality.
   **VERIFY:** reject fake gain (more words/headings, stuffing, rephrasing, invented stats).
10. **Brand & Trust** — how Sudonex appears naturally: genuine expertise, delivery methodology,
    compliance know-how, editorial standards. No frequency-padding, no fabricated first-hand tests.
    **VERIFY:** mentions relevant, claims supported, no fabricated experience, no exaggerated
    superiority, consistent voice, commercial language doesn't wreck usefulness.
11. **Content Brief** — combine all approved research into: primary kw, intent, audience, article
    type, depth, H1, intro objective, H2/H3 structure, questions to answer, entities-by-section,
    evidence-by-section, information-gain requirements, brand integration, internal-link targets,
    table/list/media requirements, CTA, prohibited claims, facts-needing-citations.
    **ARTICLE LENGTH = a calculated RANGE, not a quota.** Simple answer 600–1,000; standard
    informational 1,200–2,000; deep guide 2,000–3,500; complex authoritative 3,500–6,000+. Match
    depth to genuine completeness. **No filler for word count.** (Site minimum floor stays 1,500
    for money/service pages unless the intent truly needs less — then note why.)
    **CHIEF BRIEF VERIFY:** check the brief against stages 1–10; missing → return to that stage.
    Writing starts only at `BRIEF_STATUS = APPROVED`.
12. **Writer** — satisfy intent immediately; logical structure; cover entities naturally; use
    approved evidence; deliver info gain; no filler; no repetitive conclusions; no mechanical kw
    placement; niche expertise; flag uncertain claims; integrate brand naturally; humans first.
    **WRITING-COMPLIANCE VERIFY:** section-by-section vs brief — all sections, intent, questions,
    evidence, entities, info gain, no prohibited/unsupported claims, brand rules, depth w/o filler.
    Return PASS / MINOR / MAJOR / REWRITE.
13. **Senior Editor** — clarity, flow, structure, grammar, transitions, redundancy, paragraph
    length, tone; strip generic-AI phrasing; keep SEO/context intact.
    **EDITORIAL VERIFY:** before/after diff didn't drop entities, alter facts, remove citations,
    change meaning, add unsupported claims, or hurt intent coverage.
14. **Final Fact Checker** — extract claims from the final draft, check vs ledger, classify
    VERIFIED / PARTIALLY / UNVERIFIED / OUTDATED / CONFLICTING. Fix or remove UNVERIFIED important
    claims before publish.
15. **Semantic QA** — final vs entity map, SERP, intent spec, competitor gap, topical map: find
    missing concepts, over-repetition, forced keywords, missing relationships, thin/irrelevant
    sections.
16. **On-Page SEO** — title tag, H1, meta description, URL slug, H2/H3 hierarchy, opening answer,
    keyword/context placement, image + alt recommendations, structured-data eligibility, featured-
    snippet & FAQ opportunities. Readability over keyword cramming.
17. **Internal Linking** — from `data/content.json` inventory: incoming links, outgoing links,
    pillar links, supporting links; natural anchors; check orphans, over-exact anchors, broken/
    redirecting URLs, irrelevant links, cluster relationships. (Silo rule: spoke→pillar + siblings;
    pillar→spokes; cross-silo only pillar↔pillar.)
    **SEO-IMPL VERIFY:** on-page recs, internal links, metadata, headings, URL, schema eligibility,
    canonical/indexability, anchor relevance, no over-optimization.
18. **CHIEF CONTENT AUDITOR (final veto)** — independently audit the whole chain (keyword, intent,
    SERP, competitor, positioning, entities, evidence, info gain, brand, brief compliance, writing,
    facts, semantics, on-page, internal links, cannibalization, original usefulness, unsupported
    claims, readiness, and "does this article deserve to exist"). FINAL STATUS APPROVED /
    REVISION REQUIRED / REJECTED. Only APPROVED publishes.

## 3. PUBLISH (technical) — unchanged mechanics

Write into `data/content.json` matching an existing sibling entry's exact key set (study
`/casino-payment-integration/`): `seo_title`(≤60), `meta_description`(150–155), `h1`, unique
self-`canonical` `https://www.sudonex.com<path>`, `layer`, `body_html`, `toc`, `faqs`(8–10),
`schemas` (BreadcrumbList + Service + FAQPage, `@id`/`url` = the unique canonical, no dup across
pages), `outbound_links`. Add the Pexels image (`public/images/<slug>.webp`, 1120×630 q60, id not
in `data/media-credits.json`) + a unique video. `node scripts/gen_nav.js` → `npx next build
--webpack` (exit 0, sitemap regenerated, +2 `<loc>`). Commit as shyamcric122, `git push origin
main`. Live-check each URL = 200; IndexNow ping; print URLs for manual GSC Request-Indexing.

## 4. EXISTING-ARTICLE ENFORCEMENT (rolling refresh — every run)

The framework applies to existing content too. Each run, after publishing the 2 new articles,
audit **3–5 existing pages** (round-robin; track progress in `data/content-os-state.json` so every
page is covered over time). For each: run the CHIEF CONTENT AUDIT + FACT CHECK + SEMANTIC QA +
ON-PAGE + INTERNAL-LINK checks against this SOP and decide:
`KEEP / UPDATE / EXPAND / REWRITE / MERGE / CONSOLIDATE / RE-EVALUATE INTENT`. Only act when there
is a real reason (thin section, unsupported claim, missing entity/schema, weak internal linking,
outdated figure, cannibalization) — never edit just because it was "scheduled." Apply safe fixes
in the same commit; log bigger rewrites into the state file as next-run tasks. Never break the
build or change a canonical without recording why.

## 5. KEYWORD INVENTORY MONITOR (every run)

Track in `data/content-os-state.json`: TOTAL / UNUSED / ASSIGNED / PUBLISHED / REJECTED /
DUPLICATE / NEW_REQUIRED. Runway = unused approved keywords ÷ avg daily consumption (2). Status:
GREEN >30d, YELLOW 15–30d, ORANGE 7–14d, RED <7d, CRITICAL <3d. At ORANGE start keyword expansion
(from topical map, missing clusters, ranking queries, competitor gaps, questions, long-tails);
new keywords pass the SAME validation + clustering before use. Never let the queue hit zero.

## 6. DAILY REPORT (end of every run — no fabricated metrics)

Emit: domain, niche, date, SEO mode; PRODUCTION (planned/researched/briefed/drafted/verified/
approved/revision/rejected/published); QUALITY (verifier failure counts + top recurring reason);
KEYWORD INVENTORY (totals + runway days + status); EXPANSION (new keywords/clusters/validated/
rejected/opportunities); PERFORMANCE (only if data available, else `DATA UNAVAILABLE`); NEXT
ACTIONS (top 5); BLOCKERS (never hide missing data). Append the report to `data/content-os-log.md`.

## 7. SEO-MODE RULE

WHITEHAT here: sustainable authority, genuine expertise, real evidence, strong UX, original
information. Aggressiveness (if ever raised) may change velocity/architecture experiments but
**never** lowers factual/editorial standards: no fabricated experts, reviews, tests, sources, or
misleading claims. Truthfulness and SEO aggressiveness are separate variables.

## 8. MASTER OBJECTIVE

Publish the maximum number of genuinely useful, differentiated, intent-aligned, semantically
complete, factually defensible, well-connected pages the resources support — not the most pages.
Every article must answer: why this keyword, why this page, why this structure, why this
information, why a user prefers this result, what it adds vs existing results, how it strengthens
Sudonex's topical authority. If those can't be answered — **do not publish.**
