# Korea Capital Insight: Hook / Voice Script / CTA playbook

## CHUẨN GIỌNG KÊNH CÁ NHÂN 23/11/2026 — ƯU TIÊN CHO CẢ KR/US/MACRO

Trước mọi video mới, áp dụng [PERSONAL_NEWSROOM_V1.md](PERSONAL_NEWSROOM_V1.md): bắt đầu bằng tin quan trọng có số/dữ kiện đã kiểm chứng, giải thích động lực và **cơ chế truyền dẫn**, rồi điều gì có thể thay đổi kết quả; không chỉ đọc lại % biến động. Hạn chế "Đây là...", "Một phiên giảm mạnh không...", những câu khuôn mẫu. Người dẫn đang nói chuyện tự nhiên với khán giả Việt Nam, không xưng thay doanh nghiệp.

**CTA mới:** ưu tiên một câu hỏi MỞ có trọng tâm + lời mời **bình luận và theo dõi kênh**, không CTA giả định tăng/giảm hoặc ép chọn một trong hai đáp án. Không xướng tên "Korea Capital Insight" trong câu kết, vẫn được dùng làm logo. Ví dụ: "Theo mọi người, tín hiệu nào cần cải thiện để thị trường ổn định trở lại? Hãy chia sẻ góc nhìn tại phần bình luận và theo dõi kênh để cùng cập nhật nhé!" Mỗi lần thay câu hỏi cho phù hợp tin. US_AM cũng bắt buộc. Không thêm chữ CTA vào outro voiceText; runner tự nối cta.spoken.

## BỘ NGÂN HÀNG HOOK, CHUYỂN Ý, CTA PHIÊN BẢN MỚI

Dùng [VARIATION_LIBRARY_V1.md](VARIATION_LIBRARY_V1.md) cho cả KR_AM / KR_MID / KR_CLOSE / MACRO21 / US_AM. Đa dạng về **góc kể** trước, sau đó mới đa dạng câu chữ; CTA có một câu hỏi MỞ gắn sự kiện, nhưng biến tấu cả câu mời bình luận/theo dõi kênh, không lặp "Theo mọi người…" hoặc "Hãy chia sẻ góc nhìn…" hàng ngày. Không thêm số liệu/tin giả và không hô hào đầu tư. Trước Vbee, kiểm tra lịch sử job và thử advisory similarity, cảnh báo không chặn.

## Brand voice
Professional newsroom, clear and energetic **without** hysterical urgency or artificial AI filler. Spoken Vietnamese for investors following Korean equities and macroeconomic developments. Explain what happened, *why*, Korean market relevance, then the next checkpoint. Voice is Vbee Anh Khôi Tin tức (`n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`); pronounce stocks, acronyms, numbers and dates consistently. Follow [VOICE_PROFILE.md](VOICE_PROFILE.md) for the changed-speaker trial and historical-audio rules.

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

## Caption đăng video — yêu cầu chủ kênh, 26/10/2026

Áp dụng cho caption đăng Facebook/Instagram/Reels của KCI và caption nháp ghi vào cột D của KCI News Sheet. Đây là phần chữ đi kèm video, KHÔNG phải brief nghiên cứu, kịch bản lời đọc hoặc phụ đề. Giữ nguyên yêu cầu nguồn của brief và quy trình duyệt video.

- Viết ngắn gọn, mộc mạc, thân thiện, phù hợp người Việt theo dõi kinh tế và chứng khoán Hàn Quốc, kể cả người chưa quen thuật ngữ tài chính. Dùng lời nói tự nhiên, không giảng bài, không tự khen chuyên môn, không cố tạo vẻ sang trọng hay giật gân.
- Mặc định khoảng 30–60 từ, 2–3 câu, chưa tính hashtag và lưu ý đầu tư. Có thể ngắn hơn nếu đã đủ ý; chỉ dài hơn khi cần giữ một điều kiện quan trọng để không gây hiểu sai. Không kéo dài cho đủ số từ.
- Chọn một điều đáng chú ý hoặc một câu hỏi cụ thể mà video thực sự trả lời, thêm một câu giải thích gần gũi; lời mời trao đổi/theo dõi nếu có phải nhẹ và gắn đúng nội dung. Không kể lại toàn bộ 3–5 tin, không sao chép brief 250–400 từ vào caption, không nhồi số liệu hoặc nhiều lệnh tương tác.
- Đa dạng mở đầu và câu kết. Tránh rập khuôn như "Trong bối cảnh thị trường đầy biến động", "Cơ hội vàng", "Đừng bỏ lỡ", "Bí mật ít ai biết"; không ép bình luận từ khóa, không FOMO hoặc hứa lợi nhuận.
- Định dạng phần caption thực tế bằng văn bản thường: không markdown in đậm, bảng hoặc tiêu đề báo cáo; tối đa một emoji nếu hợp nội dung. Hashtag để cuối, tách một dòng.
- Mọi số liệu/sự kiện phải có trong hồ sơ nguồn đã kiểm chứng của đúng video. Giữ những từ cần thiết như "ước tính", ngày dữ liệu lịch sử hoặc "chưa phải lỗ đã chốt" nếu bỏ đi sẽ gây hiểu sai. Không thêm dữ kiện mới chỉ để tạo hook. Hồ sơ nguồn đầy đủ vẫn được giữ riêng trong brief; thêm dẫn nguồn ngắn trong caption khi cần để không biến ước tính của bên thứ ba thành kết luận chính thức.
- Giữ lưu ý ngắn theo quy tắc KCI: "Thông tin tham khảo, không phải khuyến nghị đầu tư cá nhân." Độ ngắn không được xóa ranh giới dữ kiện/nhận định.

### Hashtag đúng chủ đề, có kiểm tra xu hướng

- Giữ mặc định 2–3 hashtag có chọn lọc: một hashtag thương hiệu `#KoreaCapitalInsight`, một hashtag đúng chủ đề/độc giả, và khi có căn cứ thì một hashtag đang được quan tâm phù hợp chính câu chuyện. Đây là lựa chọn biên tập, không phải giới hạn kỹ thuật của nền tảng.
- Trước khi chọn hashtag xu hướng cho từng bài, kiểm tra thông tin mới trên đúng nền tảng và thị trường/ngôn ngữ người xem khi công cụ cho phép. Lưu bằng chứng ngắn trong hồ sơ biên tập: hashtag, nền tảng, phạm vi thời gian/thị trường và URL hoặc dữ liệu quan sát được. Không suy từ một bài đăng đơn lẻ, snippet, tổng lượt dùng tích lũy hay xu hướng trên nền tảng khác rằng hashtag đang thịnh hành với khán giả KCI.
- Nếu không xác minh được xu hướng, vẫn chọn hashtag liên quan nội dung và ghi giới hạn trong hồ sơ nội bộ; không gắn nhãn "đang trend", không bịa thứ hạng/lượt xem và không hứa tăng tương tác. Không để thiếu dữ liệu xu hướng cản một caption tin tức đã đủ nguồn.
- `#ChungKhoanHanQuoc`, `#KinhTeHanQuoc`, `#KOSPI`, `#SKHynix` chỉ là ví dụ hashtag theo chủ đề, KHÔNG phải danh sách xu hướng đã xác minh. Chỉ chọn khi video thực sự nói về chủ đề đó, không dùng tất cả như một bộ cố định.
- Không nhồi `#viral`, `#fyp`, `#xuhuong` hoặc trend giải trí không liên quan chỉ để bắt trend. Không dùng hashtag hàm ý lợi nhuận chắc chắn hay khuyến nghị mua bán.

### Lưu và kiểm duyệt caption

Lưu caption sẵn để sao chép và ghi chú kiểm tra hashtag riêng trong hồ sơ của bản tin. Khi ghi Sheet, đọc và tuân thủ [SHEET_TRACKING.md](SHEET_TRACKING.md): chỉ điền ô D mới/trống hoặc sửa khi được yêu cầu rõ; không ghi đè caption chủ kênh đã sửa. Không sửa hàng loạt caption cũ, tạo lại voice/render hoặc thay lịch chỉ vì đổi phong cách caption. Không tự đăng bài.

Trước giao, đọc lại như đang nói chuyện với một người xem: một ý chính rõ, câu dễ hiểu, không văn mẫu, không thiếu điều kiện số liệu, 2–3 hashtag phù hợp và không tự nhận xu hướng chưa kiểm chứng. Yêu cầu này thay thế cách viết caption dài hoặc cách hiểu "Viral" trong tên cột Sheet là mục tiêu giật gân; không thay đổi tên cột, giọng Anh Khôi, bố cục video hay quyền duyệt.

## Editorial A/B learning
For similar stories, rotate hook mechanisms and CTA types across *different* videos; do not spam the same ask. After publication (only when metrics accessible), compare 3-second retention, average watch duration, completion rate, qualified comments, follow conversion and saves. A high CTR does not excuse factual misrepresentation. Store learnings as notes, not fabricated performance.
