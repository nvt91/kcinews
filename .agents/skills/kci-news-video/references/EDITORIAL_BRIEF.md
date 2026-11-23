# Verified KCI Daily Brief: editorial specification

## After-close evidence fallback — 04 Nov 2026

For KR_CLOSE, distinguish an essential unsupported market claim from a single unavailable direct KRX web interface. After KRX regular close at 15:30 KST, search the date-specific Yonhap Korean closing release and corrections, the updated Yonhap English report, and another independently published Korean financial report attributing numbers to KRX. If the original KRX Data Marketplace is inaccessible/stale but two independently published closing sources agree on date, value, time and venue, narrate only corroborated figures with an explicit attribution that the original daily table could not be fetched, and label source confidence Partially verified. An indirect KRX quote is not a direct primary-data observation.

If an OPTIONAL breadth/flow/FX figure conflicts, omit that individual metric rather than blocking a video supported by other verified close, sector and policy facts. Never mix NXT after-market and KRX regular-session data, or draw an imaginary minute-by-minute chart from high/low/open/close samples. At a KR_CLOSE start around 17:00 KST, recheck Yonhap closing reports published 15:35–16:30 before declaring BLOCKED_EDITORIAL. If the central thesis remains unverified after corroboration, block before paid TTS and report exactly which claim failed. Retain one edition/job and no duplicate trigger.

## New editorial test — 23/11/2026

Read [PERSONAL_NEWSROOM_V1.md](PERSONAL_NEWSROOM_V1.md) for all KR/US/MACRO videos. Beyond factual accuracy, verify that the selected video script states (a) the news, (b) its supported **cause/transmission** and limitations, (c) a testable future indicator, and (d) a personal-channel CTA question OPEN to audience perspectives. For US_AM, identify how U.S. markets/data concretely affect Korean equities/macroeconomy. These are editorial checks, not invented numerical news or an automatic hard regex.

## Purpose and research discipline
Deliver credible Vietnamese Korean equity/macro coverage, not a general global-news dump. Research from live sources on **every run**. Anchor all reported changes to the exact publication date, event date, observation period and local KST data-cutoff (Asia/Seoul). On weekends or holidays report the last completed trading session without calling prices live.

**Preferred source hierarchy**
1. Korean originals: Bank of Korea (BOK/ECOS), KRX official statistics, DART corporate filings, Statistics Korea, Korea Customs Service and applicable ministries.
2. US/global official: Federal Reserve/FOMC, Treasury, BEA, BLS, ECB, NBS China and official releases.
3. Corroboration: Reuters, Yonhap and other attributable reputable financial reporting. Linked secondary sources should not silently replace accessible primary disclosure.
4. Social claims/influencer posts are leads, never self-sufficient confirmation of market or company facts.

**Required source-ledger fields** for every material claim: unique `sourceId`, source name, exact HTTPS URL (not only domain home), event date, publication timestamp (if known), last-checked KST, what assertion it supports, evidence type, and whether verified or pending. One source may support several facts, but no claim may appear without grounded evidence. Separate source statements from KCI analysis.

## Research checklist

- KR index KOSPI/KOSDAQ: official completed-session close, % change, breadth and foreign/retail/institution flows (define KRX versus NXT scope). Never combine these into an invented total.
- Company catalysts: confirm legal entity, Korean ticker, exchange, DART receipt/date, official newsroom, guidance/revision and timing.
- US session: report last **completed** session; distinguish cash close, premarket, futures and after-hours. Account for US daylight saving and KST.
- Macro: BOK/Fed rates and dates, CPI/PPI, employment, GDP, PMI, Korean exports/trade balance; quote actual vs previous/revised/consensus **only when confirmed**.
- Cross-assets: USD/KRW, DXY, US 2y/10y yields, Brent/WTI/gold with observation timestamp, units and provenance; mark intraday high vs closing price.
- China/global: relevance to Korea exports, input costs, semiconductor cycle, financial conditions, and what could invalidate the impact.
- Near-term calendar: confirmed dates/time KST for next 24–72h, and confidence if estimated.
- Event dedup: stable `eventKey` = company/ticker or region + catalyst + announcement date. Don't present last night's story as today's breaking news unless there is a verified material update.

## Triage for editorial value
Score story candidates from 0–5 in: novelty, macro/equity materiality, Korean transmission mechanism, proof quality, and near-term relevance. Video selection: one main angle + up to 3–5 verified supporting facts. Brief selection: max 5–7 genuinely meaningful stories; no need to pad quiet days.

For each item separate:
- **Changed**: verified new data/event vs the previous brief, or explicitly state prior context.
- **Why it matters**: cost/revenue/demand/valuation/liquidity/cash flow/discount rate channel.
- **Korean read-through**: impacted sectors, cautiously named stocks if justified.
- **Confidence**: high for official fact, lower for interpretation.
- **What would change our view**: a falsifiable future datapoint.

## Deliverable: dated brief before a video job
Use `templates/DAILY_BRIEF.md` as narrative format. A model briefing typically includes 3 highlights; a compact indicator table only with verified timestamps; 3–7 developments; and the event calendar, then 3 watch items.

The **video is a selected editorial angle**, not the full written brief read aloud. Every factual statement used in the video must be traceable to the ledger, including headline and CTA setup. Preserve units, session qualifiers, relevant revision history and exact market time.
