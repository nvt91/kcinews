# KCI — Định dạng kịch bản thân thiện (owner duyệt 17/11/2026)

Áp dụng cho MỌI stream (KR_AM, KR_MID, KR_CLOSE, MACRO21, GLOBAL_US/US_AM). Đây là dạng kịch bản gửi anh duyệt và là giọng văn cho `voiceText`. Quy định này thay thế các hướng dẫn giọng văn cũ hơn nếu có mâu thuẫn.

## Cập nhật owner 23/11/2026 — personal financial newsroom (ưu tiên cao nhất)

Mọi video MỚI, kể cả **GLOBAL_US/US_AM 09h**, dùng [PERSONAL_NEWSROOM_V1.md](PERSONAL_NEWSROOM_V1.md). Tiêu chí: Hook bất thường có nguồn → sự kiện → **vì sao/đường truyền tài chính** → ngành/chính sách/tác động tới Hàn Quốc → tín hiệu có thể quan sát → **câu hỏi MỞ + mời bình luận/theo dõi kênh**. Phong cách là người am hiểu tài chính dẫn tin cá nhân, KHÔNG đọc PR tổ chức. Không bắt buộc "mỗi cảnh đều kết bằng Đây là..." và KHÔNG dùng CTA lựa chọn nhị phân như mặc định cũ. Giảm đọc bảng số; để đồ họa thể hiện các trị số phụ. Caption US_AM giữ riêng 50–100 ký tự; không áp con số ấy cho lời CTA. Mọi nguồn, ngày, giờ, dữ kiện thực và cảnh báo đầu tư phải giữ đúng.

## MỞ RỘNG KỊCH BẢN & CTA ĐA DẠNG — 23/11/2026

Thư viện dùng chung cho mọi video kể cả US_AM: [VARIATION_LIBRARY_V1.md](VARIATION_LIBRARY_V1.md). Biên tập viên chọn mạch dẫn phù hợp nhất với tin thật, không lặp tình huống, cách nối cảnh và câu CTA trong các bản gần đây. Giữ mạch tổng quan sự kiện–nguyên nhân–tác động–tín hiệu, nhưng linh hoạt thứ tự theo loại tin. Câu hỏi cuối dạng MỞ và mang tính quan sát, không ép chọn hai đáp án; lời mời bình luận/theo dõi mang giọng cá nhân, không đọc tên Korea Capital Insight. Khi chuẩn bị bản mới, so sánh với 7 job cùng edition + 12 job mọi stream rồi ghi `variationReview` trong brief; soft-warning không chặn video.

## 1. Khung kịch bản

```
KCI | <Tiêu đề dạng câu hỏi/tác động, ví dụ: Phố Wall giảm mạnh: Thị trường Hàn Quốc sẽ chịu ảnh hưởng ra sao?>

Cảnh 1 — Hook: <tiêu đề cảnh>
Text màn hình: <TỪ KHÓA IN HOA | TỪ KHÓA IN HOA>
Lời dẫn:
“<2–4 câu ngắn>”

Cảnh 2 — <tiêu đề cảnh>
Text màn hình: <CHỈ SỐ +/-x,xx% | CHỈ SỐ +/-x,xx%>
Lời dẫn:
“...”

... (3–6 cảnh nội dung)

Cảnh kết — CTA
Text màn hình: <CÂU HỎI IN HOA — NGẮN>
Lời dẫn:
“<Câu hỏi cho khán giả> <Mời chia sẻ + theo dõi kênh>”
```

Trình tự nội dung: **Hook → Chuyện gì xảy ra → Điểm đáng chú ý nhất → Diễn biến khác (dầu, lợi suất, tỷ giá) → Tác động tới Hàn Quốc / cần theo dõi gì → CTA**.

## 2. Giọng văn lời dẫn

- Thân thiện, như người dẫn bản tin nói chuyện với khán giả. Câu ngắn, mỗi câu một ý.
- Dùng từ nối tự nhiên: “Điều đáng chú ý là…”, “Không chỉ riêng…”, “Ở một diễn biến khác…”, “Vậy…?”, “Trước hết…”, “Ở chiều tích cực…”, “Tuy nhiên…”, “Vì vậy, trong những phiên tới…”.
- Hook có thể dùng câu cảm thán, nhưng phải đúng sự thật, có số liệu ngay câu thứ hai.
- Mỗi cảnh bổ sung một dữ kiện, cơ chế hoặc tín hiệu mới; chỉ giải thích ý nghĩa khi có cơ sở và không kết bằng một câu văn mẫu. Dẫn số liệu vừa đủ, phần còn lại giao cho đồ họa.
- Cảnh Hàn Quốc nêu rõ tên mã/chỉ báo cần theo dõi (Samsung Electronics, SK Hynix, USD/KRW, KOSPI) và cả chiều tích cực lẫn tiêu cực.
- CTA: một câu hỏi **mở** gắn với tín hiệu theo dõi, không buộc chọn hai đáp án; mời bình luận và theo dõi kênh tự nhiên. Không đọc tên thương hiệu trong CTA.
- Không hứa lợi nhuận, không thúc giục mua/bán (validator vẫn chặn các cụm như “chắc chắn tăng”, “mua ngay để”).

### CẤM dùng khi viết kịch bản (kể cả trong câu phủ định)

| Không viết | Viết thay bằng |
|---|---|
| chắc chắn tăng / giảm / thắng | có thể tăng/giảm; chưa thể kết luận sẽ tăng/giảm; không bảo đảm sẽ tăng |
| cam kết lãi / lợi nhuận | (bỏ hẳn) |
| lãi 100% / 200% / 300% | (bỏ hẳn; chỉ nêu số liệu thực tế có nguồn) |
| mua ngay để… / không mua sẽ tiếc | (bỏ hẳn; CTA chỉ mời bình luận/theo dõi/lưu) |

Ví dụ: “Không thể suy ra đồng won chắc chắn giảm” → “Chưa thể kết luận đồng won sẽ giảm”. Preflight hiện cảnh báo vàng “tránh cụm…” nếu còn sót; phải viết lại trước khi mở issue.

## 3. Text màn hình

- 2–4 cụm từ khóa IN HOA, ngăn cách bằng dấu gạch đứng, tối đa 160 ký tự.
- Số liệu theo định dạng Việt Nam: `−1,92%`, `92,44 USD`, `5,13%`.

## 4. Ánh xạ sang job JSON schema v2

| Kịch bản | Trường JSON |
|---|---|
| Dòng tiêu đề “KCI …” | `scriptTitle` (tùy chọn; mặc định dùng `headline`) |
| `Cảnh N — <tiêu đề>` | `scenes[].title` (tùy chọn) |
| `Text màn hình` | `scenes[].screenText` (tùy chọn; mặc định ghép `stats`) |
| `Lời dẫn` | `scenes[].voiceText` (cảnh 1 nên bắt đầu bằng `hook.spoken`) |
| `Cảnh kết — CTA` | `cta.screenHeadline` (hoặc `cta.screenText`) + `cta.spoken` |

Không lặp lại `cta.spoken` trong `voiceText` cảnh cuối; runner tự nối CTA một lần (và tự bỏ qua nếu đã có).

Xuất kịch bản để gửi anh duyệt:

```
node scripts/export-kci-script.mjs jobs/kci-YYYY-MM-DD-<edition>.json
```

Workflow `KCI Job Preflight — no Vbee` in kịch bản này vào Job Summary của mỗi job vừa push.

## 5. Kiểm tra nguồn (từ 17/11/2026: cảnh báo, không chặn)

Thiếu nguồn primary, chỉ có 1 nguồn, hook không khớp candidate, CTA lặp → preflight **vẫn xanh**, chỉ hiện cảnh báo vàng. Vẫn nên ghi đủ nguồn thật; tuyệt đối không bịa số liệu hay nguồn.
