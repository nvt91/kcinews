# Korea Capital Insight: Hook / Voice Script / CTA playbook

## Brand voice
Professional newsroom, clear and energetic **without** hysterical urgency or artificial AI filler. Spoken Vietnamese for investors following Korean equities and macroeconomic developments. Explain what happened, *why*, Korean market relevance, then the next checkpoint. Voice is Vbee Tuấn Anh News; pronounce stocks, acronyms, numbers and dates consistently.

## Hook decision system
For the same set of verified facts draft **at least three distinct candidates**:
- **Reversal / contrast**: "KOSPI có lúc giảm hơn 4%, nhưng đóng cửa tăng 0,30%. Điều gì thay đổi?"
- **Mechanism / relevance**: "Dầu Brent vượt 115 đô la trong phiên. Ngành nào ở Hàn Quốc phải chịu chi phí cao hơn?"
- **Counterintuitive / question**: "Cổ phiếu chip giảm không có nghĩa nhu cầu AI đã giảm. Nhà đầu tư nên kiểm tra dữ liệu nào?"

When a source does not support the premise, reject that hook. The hook needs (a) a verified datum, (b) an information gap the video actually resolves, and (c) a concrete Korean investor reason to keep watching.

**Score each hook** (0–5 each): factual precision (x3), Korean investor relevance (x3), genuine curiosity (x2), oral brevity (x1), and immediate clarity (x1). Reject hooks scoring below 35/50 or factually risky regardless of score. Prefer <=30 Vietnamese words / first ~5–7s. A compelling contradiction beats sensational clickbait.

**Never** hook with "cổ phiếu này chắc chắn tăng", "bí mật quỹ gom", "ai không mua sẽ tiếc", implied guaranteed investment outcomes, or fake imminent danger. Headlines and charts must not exaggerate actual prices or chronology.

## News script beats for a ~60–110s short video
- **0–3s:** factually grounded news tension: surprise, contrast or quantified move.
- **3–8s:** state what is at stake/where the explanation goes.
- **8–55s:** explain one main change with verified figures and source / session qualifiers.
- **55–85s:** explain Korea sector/company impact and conditions for the opposite reading.
- **Last 10–20%:** what to watch plus ONE principal CTA; place after useful information, not at the very beginning.
- Voice length rules override crude timings; stretch motion to actual recording, not speech speed to a visual template.

Each sentence should serve one purpose. Use natural transitions: "Nhưng điểm đáng chú ý là...", "Điều này không đồng nghĩa...", "Với thị trường Hàn Quốc...". Avoid "trong bối cảnh" repeated every paragraph and generic filler. A 90-second news edition often needs ~170–230 spoken Vietnamese words depending on the approved Vbee speaking rate; verify by actual audio, not invented word-per-second conversions.

## CTA selection: one main user action
CTA stands for **Call to Action**, and should create authentic engagement rather than clickbait.

| Objective | Best content | Structure | Example |
|---|---|---|---|
| COMMENT | Contested or scenario-based market interpretation | one balanced question + comment invite | "Theo anh chị, nhịp hồi này bền vững hay mới chỉ mang tính kỹ thuật? Bình luận góc nhìn của mình." |
| FOLLOW | News that develops over several sessions | what we will follow + follow invite | "Korea Capital Insight sẽ theo dõi dòng vốn và giá dầu ở phiên tới. Theo dõi kênh để xem cập nhật mới." |
| SAVE | Evergreen explainers / KPI checklist | specific future usefulness | "Lưu bản tin này để có ba chỉ báo cần kiểm tra trước phiên giao dịch tiếp theo." |

For an episode where **comment** is primary, an optional unobtrusive follow clause is fine. Avoid more than two asks. Do not claim "theo dõi để nhận tin đúng 22h mỗi ngày" unless that posting schedule actually exists. No giveaway/bribe for engagement; never request viewers to post their private holdings, account balances or personal information.

## CTA interface contract
A reviewed v2 job has:
- `cta.type`: `comment` | `follow` | `save`
- `cta.spoken`: speakable 12–65-word closing request, not included in the outro scene's `voiceText`
- `cta.screenHeadline`: on-screen CTA, <=72 characters
- `cta.screenSubline`: supporting text, <=95 characters
- `cta.question`: required for `comment`, balanced/open-ended, no implied financial-advice request

The production runner appends `cta.spoken` **once** to the final narration segment. A dedicated animated overlay appears during closing portion; subtitles include spoken CTA in a single continuous voice track. Changes to CTA wording require new voice or a separately generated/synchronized ending—do NOT reuse outdated voice.

## Editorial A/B learning
For similar stories, rotate hook mechanisms and CTA types across *different* videos; do not spam the same ask. After publication (only when metrics accessible), compare 3-second retention, average watch duration, completion rate, qualified comments, follow conversion and saves. A high CTR does not excuse factual misrepresentation. Store learnings as notes, not fabricated performance.
