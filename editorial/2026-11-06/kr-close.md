# KCI — KR_CLOSE · 06/11/2026 (KRX phiên chính)

- ArticleId: `KCI-20261106-KR-CLOSE`; stream `KR_NEWS` slot `KR_CLOSE`, single digest, original job `jobs/kci-2026-11-06-kr-close.json`.
- Cutoff: 16:15 KST, 06/11/2026; 15:30 KRX main close (exclude NXT later trading); FX 15:30 Seoul reference, not future rate.
- Profile `KCI_EDIT_20261026_V1`, owner only reviews full voiced MP4; never auto publish.
- Distinct from KR_AM 06/11: this video reports the **completed KRX close**, foreign-flow totals and finalized semiconductor/FX numbers, NOT morning circuit-breaker moment as if it were today's close.

## Verified editorial brief

KOSPI dropped 324.11 points or 6.02%, closing the 6 November KRX main session at 5,059.69. The benchmark had been briefly halted from 09:03 for about 20 minutes after a fall exceeding 8%, then recovered off the intraday low. Do not confuse the early -8.52% observation used in KR_AM with the -6.02% closing session; the market did not shut all day. Both Reuters and Korea's NewsPim report the 5,059.69 close. Reject partially refreshed Investing.com historical results that show a provisional conflicting close.

A central new post-market result is net foreign selling of approximately 2.769 trillion won in KOSPI-listed shares, versus institutions buying around 1.6998 trillion and retail around 605.1 billion won, figures attributed to KRX by NewsPim. Despite buyers stepping in, the index finished down sharply. Reuters reports a widespread chip selloff, with Samsung Electronics down approximately 6.4% and SK Hynix around 10.4%. Concern about AI data-center policy after the US midterms is investor expectation, not confirmation that any new restrictive rule is enacted.

KOSDAQ closed 644.27, down 5.03%, and Seoul USD/KRW 15:30 reference stood at 1,356.6 won per USD, up 14.5 won from the previous closing rate according to a NewsPim close bulletin. The Bank of Korea daily market indicators posted 6 November describe the completed **5 November** session (KOSPI from 5,683.8 to 5,383.8, USD/KRW 1,341.5→1,342.1). When quoting that primary BOK source, disclose its publication day vs market observation day. Do not mix BOK prior-day data with 6 November completed quotes.

Video arc: first-three-second hook on difference between early exchange halt and closing loss; explain circuit breaker; final foreign flows; confirmed semiconductor declines; KOSDAQ and FX; close with uncertainty and one non-promotional question. No recommendation to transact. Caption for social: “🇰🇷 KOSPI chốt phiên giảm 6,02%, khối ngoại bán ròng gần 2,8 nghìn tỷ won. Nhóm chip và tỷ giá sẽ diễn biến thế nào tuần tới? Cùng theo dõi nhé! #KoreaCapitalInsight #KOSPI”.

## Sources verified at 17:04 KST Nov 6

1. Reuters: https://www.reuters.com/world/asia-pacific/south-korea-stocks-plunge-8-circuit-breaker-triggered-chip-shares-tumble-2026-11-06/
2. NewsPim 16:01 market close: https://www.newspim.com/news/view/20261106000927
3. NewsPim 16:10 KOSDAQ & Seoul FX: https://ir.newspim.com/news/view/20261106000988
4. Bank of Korea daily financial market indicators published 06 Nov for **05 Nov**: https://www.bok.or.kr/portal/bbs/P0002018/view.do?depth=200366&menuNo=200366&nttId=11066361&oldMenuNo=201150&programType=newsData&relate=Y

## Production / QA contract

- Hook chosen matches `hook.candidates[].text` exactly and begins first scene narration. CTA text lives only in `cta.spoken` (runner appends once).
- Source and event dates, units and session labels must agree across voice, captions, figures and final report. Use sourceLedger for actual links.
- First video output must be H.264/AAC voiced MP4. `mode=preview` in current script is silent and is NOT owner-deliverable.
- Word timing ±2 frames and all 9 editing stages may be NOT_VERIFIED if the code doesn't support them; footage-takes N/A for graphics/TTS. Raw/edit duration, rejected takes, silence removed, loudness and peak are NOT_MEASURED prior to actual output.
- Preserve original articleId for all revisions; H=CHỜ DUYỆT I=CHƯA ĐĂNG until owner approval, no social posting.
