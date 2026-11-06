# KCI KR_AM — 06/11/2026 · bản sáng xuất muộn

- **articleId:** `KCI-20261106-KR-AM`
- **Stream/slot:** `KR_NEWS / KR_AM`; không tính là KR_CLOSE hoặc KR_MID
- **Cutoff nội dung:** 11:35 KST 06/11/2026, được biên tập muộn trong chiều; KHÔNG ghi là giá đóng cửa
- **Job:** [jobs/kci-2026-11-06-kr-am.json](../../jobs/kci-2026-11-06-kr-am.json)
- **Profile:** `KCI_EDIT_20261026_V1` / voiced MP4 review; H=CHỜ DUYỆT, I=CHƯA ĐĂNG
- **Event keys:** `krx-kospi-circuit-breaker-2026-11-06`; `bok-september-current-account-release-2026-11-05`

## Tóm tắt biên tập — nguồn đã mở/đối chiếu

Sáng 06/11, thị trường chứng khoán Hàn Quốc biến động dữ dội sau một đêm bán tháo nhóm công nghệ Mỹ. Theo Yonhap, Korea Exchange đã tạm ngừng giao dịch cổ phiếu KOSPI từ 09:03 KST trong 20 phút sau khi chỉ số giảm hơn 8% so với phiên liền trước. KBS World đưa mốc KOSPI 4.924,61 điểm tại thời điểm kích hoạt, tương đương mức giảm 8,52%. Đây là **mốc đầu phiên**, không phải giá đóng cửa. Việc tạm ngừng giao dịch là cơ chế điều tiết thị trường; không được mô tả là đóng cửa toàn bộ phiên.

Một trọng tâm là rủi ro kỳ vọng đối với ngành AI và bán dẫn. Yonhap liên hệ diễn biến này với làn sóng bán cổ phiếu công nghệ Mỹ và lo ngại các chính sách sau bầu cử giữa kỳ có thể hạn chế tốc độ phát triển trung tâm dữ liệu. Cần nói rõ đây là **lo ngại của nhà đầu tư**, không phải bằng chứng một đạo luật mới đã có hiệu lực hay các dự án AI đồng loạt bị hủy bỏ. Tránh suy diễn chắc chắn về kết quả cổ phiếu Samsung Electronics, SK hynix hoặc xu hướng KOSPI trong phiên kế tiếp.

Đối trọng vĩ mô được kiểm chứng từ Bank of Korea: báo cáo sơ bộ công bố ngày **05/11** cho kỳ **tháng 09/2026** cho biết thặng dư tài khoản vãng lai 61,46 tỷ USD, trong khi tài sản ròng tài khoản tài chính tăng 54,34 tỷ USD. Hai khái niệm khác nhau; số liệu vãng lai theo tháng không được diễn giải là bán/mua USD ngay trong phiên 06/11, cũng không bảo đảm tỷ giá won đi theo một chiều.

Cấu trúc video: cảnh hook nhấn mức giảm đầu phiên; giải thích circuit breaker; phân biệt lo ngại chính sách AI với quy định có hiệu lực; trình bày BOK với đúng kỳ/ngày công bố; kết thúc bằng các tín hiệu cần theo dõi và một CTA bình luận. Người xem cần biết video là **bản tin sáng cập nhật muộn**, cutoff 11:35, và dữ liệu đóng cửa sẽ thuộc edition KR_CLOSE riêng. Không giao dịch, không hướng dẫn mua bán.

## Nguồn

1. [Yonhap — Trading of KOSPI stocks suspended amid tech sell-off, 06/11 09:08 KST](https://en.yna.co.kr/view/AEN20261106002100320).
2. [KBS World — KOSPI circuit breaker, 06/11 09:47 KST](https://world.kbs.co.kr/service/news_view.htm?Seq_Code=205388&lang=e).
3. [Bank of Korea — Balance of Payments September 2026 preliminary, công bố 05/11](https://www.bok.or.kr/eng/bbs/E0000634/view.do?depth=400069&menuNo=400069&nttId=11066295&oldMenuNo=400007&programType=newsDataEng&relate=Y).

## Hook và caption

- Hook đã chọn: “KOSPI rơi hơn tám phần trăm ngay đầu phiên, buộc sàn Hàn Quốc tạm ngừng giao dịch. Vì sao cú sốc này xảy ra?”
- Hai phương án khác trong `hook.candidates` có trong job JSON; selected hook và câu đầu narration khớp nguyên văn.
- CTA có đúng một nguồn `cta.spoken`, **không** lặp trong `outro.voiceText`.
- Caption dự thảo: “🇰🇷 KOSPI có lúc giảm hơn 8% sáng nay, khiến sàn phải tạm dừng giao dịch. Cùng xem nguyên nhân và những tín hiệu cần theo dõi nhé! #KoreaCapitalInsight #KOSPI”

## QC trước render / phạm vi phép đo

- Tài liệu kiểm chứng nguồn và kiểm tra cấu trúc không thay thế việc nghe/nhìn MP4 thực.
- Ngôn ngữ số liệu: 4.924,61 điểm và −8,52% là **đầu phiên**, 61,46 tỷ USD là **tháng 09** công bố 05/11.
- Raw/edited durations, rejected takes, silence cuts, loudness/true peak, word-sync ±2 frames: `NOT_MEASURED` trước khi có output. Camera footage/takes: `N/A`.
- Video có voice phải là `mode=video` với Vbee Anh Khôi; `mode=preview` là bản silent graphics, không bàn giao như video thành phẩm.
- Sau render vẫn `MP4 — CẦN RÀ SOÁT / CHỜ DUYỆT / CHƯA ĐĂNG` cho đến khi có bằng chứng QC và quyết định từ chủ kênh.
