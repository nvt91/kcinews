# KCI MACRO21 — 07/11/2026
Cutoff 2026-11-07T21:04:57+09:00; articleId KCI-20261107-MACRO21; stream MACRO; review v1; tts_motion.

## Angle
Weekend macro explainer: Brent's weekly decline versus persistent Korean energy import exposure. No Saturday market-close quote, no index/company recap. Distinct from GLOBAL_US US_AM US jobs/tech and 06/11 MACRO MSCI FX accessibility.

## Sources
- Reuters 6 Nov: high oil prices curb demand, signs of glut (2026-11-06): https://www.reuters.com/business/energy/high-oil-prices-curb-demand-fresh-signs-glut-appear-2026-11-06/
- Reuters 6 Nov: global markets stagflation risks (2026-11-06): https://www.reuters.com/business/energy/global-markets-stagflation-risks-graphic-pix-2026-11-06/
- Yonhap 6 Oct: Korean ministry November oil import coverage (2026-10-06), secondary and superseded for supply context: https://www.yna.co.kr/view/AKR20261006087900003
- **PRIMARY (added after failed pre-TTS validation, checked 2026-11-08 00:19 KST):** Korean Ministry of Trade, Industry and Resources official 16 Oct 2026 statement on October–November crude import security (over 100% prior-year average) and the petroleum price ceiling effective 17 Oct: https://www.korea.kr/briefing/pressReleaseView.do?newsId=156785525 — historical source, not a 07/11 spot-price quote or same-day supply update. The ministry source cross-checks Korean import exposure and conditional domestic price transmission; Reuters remains the attributed source for the weekly Brent movement.

## Hooks (editorial scores /50)
1. Giá dầu hạ nhiệt, nhưng Hàn Quốc đã thực sự thoát áp lực năng lượng chưa? — 44/50 selected.
2. Dầu Brent giảm mạnh trong tuần, liệu hóa đơn nhập khẩu của Hàn Quốc có giảm ngay? — 42/50.
3. Vì sao dầu rẻ hơn chưa chắc khiến đồng won mạnh lên ngay? — 40/50.

## Spoken script
### hook
Giá dầu hạ nhiệt, nhưng Hàn Quốc đã thực sự thoát áp lực năng lượng chưa? Giá dầu giảm có thể giúp Hàn Quốc, nhưng rủi ro nguồn cung chưa biến mất.

### oil
Theo Reuters ngày sáu tháng mười một, dầu Brent đã giảm khoảng mười lăm phần trăm trong tuần, xuống dưới một trăm đô la một thùng. Đây là biến động trong tuần, không phải báo giá trực tiếp tối nay.

### supply
Một phân tích Reuters cùng ngày ghi nhận dòng dầu từ vùng Vịnh phục hồi, trong khi giá cao khiến nhu cầu yếu đi. Nhưng sản phẩm lọc dầu vẫn chưa trở lại mức bình thường trước xung đột.

### korea
Với Hàn Quốc, nếu giá dầu giảm bền vững, chi phí nhập khẩu năng lượng và áp lực giá cả có thể dịu lại. Điều này có thể giúp cán cân thương mại và giảm bớt áp lực lên đồng won.

### risk
Tuy nhiên, giá dầu quốc tế không chuyển ngay thành giá xăng hay chi phí sản xuất trong nước. Tỷ giá đô la trên won, hợp đồng nhập khẩu và rủi ro vận tải vẫn có thể làm lợi ích đến chậm.

### outro
Tuần tới, hãy quan sát giá Brent, dòng cung từ Trung Đông và tỷ giá đô la trên won. Đây là ba tín hiệu giúp kiểm tra liệu áp lực năng lượng có thực sự hạ nhiệt.

CTA: Nếu muốn theo dõi ba tín hiệu này trong tuần tới, hãy theo dõi Korea Capital Insight. Thông tin chỉ để tham khảo, không phải khuyến nghị đầu tư cá nhân.

## Caption (<50 words)
🛢️ Dầu giảm mạnh trong tuần, nhưng Hàn Quốc đã bớt áp lực năng lượng chưa? Cùng xem vì sao giá dầu, nguồn cung và tỷ giá vẫn cần theo dõi nhé! #KoreaCapitalInsight #KinhTeHanQuoc

## QC pending
Sources verified 2026-11-07; Reuters week-end data, not live Saturday. Narration, duration, beat stills, loudness, timing, MP4 NOT_MEASURED. No approval or publication.

## Incident review and recurrence prevention — 08/11/2026
- Run 42370942236 / owner issue #84 failed on the PRE-TTS validator, **not Vbee**: `at least one primary-source cross-check required`; all three original ledger entries were marked `secondary`.
- Corrective action: add the above verified ministry primary source to `jobs/kci-2026-11-07-macro21.json`, cross-link it specifically to `korea` and `risk` scenes, preserve Reuters attribution, original data cutoff/script/voice, and full old failure history.
- Prevention: before any new paid KCI issue, validate the **exact checked-in job** and confirm a fact-relevant **official primary** source with URL, publication date, checkedAt and scene sourceIds. Use the no-Vbee KCI Job Preflight PASS of that exact commit as a hard gate. Never relabel Reuters/Yonhap as primary; if no relevant primary exists, remain BLOCKED for editorial review instead of charging for TTS.
- Corrected JSON/schema validation alone is **not** proof that new audio, an MP4, QC, owner approval or publication exists. Do not rerun the historic paid workflow on this maintenance action.
