# KCI MACRO21 — 16/11/2026

Cutoff 2026-11-16T21:40:07+09:00; articleId KCI-20261116-MACRO21; stream MACRO / MACRO21; mode tts_motion; profile KCI_EDIT_20261026_V1.

## Góc tin
CPI năng lượng tăng +0,7% theo tháng, PPI năng lượng nhu cầu cuối cùng giảm -0,1% theo tháng: hai phạm vi đo khác nhau. Không suy diễn giá dầu nhập khẩu Hàn hay USD/KRW hiện tại.

## Nguồn chính
- BLS October 2026 CPI release November 10 (2026-11-10): https://www.bls.gov/news.release/archives/cpi_11102026.htm — October CPI +0.4% month on month seasonally adjusted; core CPI +0.3%; energy CPI +0.7%. October 2025 data missing for most categories; headline 12-month October 2026 rate not published.
- BLS October 2026 PPI release November 13 (2026-11-13): https://www.bls.gov/news.release/archives/ppi_11132026.htm — October final demand PPI +0.3% month on month seasonally adjusted; +6.5% year on year unadjusted. October final demand energy prices -0.1% month on month.

## Chống trùng
Issues 13–16/11 đã kiểm tra: MACRO 13/11 USD/lợi suất; MACRO 15/11 xuất khẩu; US_AM 16/11 chip/PPI/năng lượng; KR_CLOSE 16/11 KOSPI/chip. Bản này chỉ giải thích chênh lệch CPI/PPI năng lượng và kênh nhập khẩu Hàn, không recap giá hay công ty. Không xác minh đầy đủ lịch sử workflow/artifacts và Sheet qua các công cụ hiện tại.

## Hook (điểm biên tập chủ quan, không phải QC video)
1. Tương phản 90/100: Giá năng lượng tại Mỹ đang gửi hai tín hiệu trái chiều. Điều đó có ý nghĩa gì với đồng won và chi phí nhập khẩu của Hàn Quốc?
2. Tác động 87/100: CPI năng lượng Mỹ tăng, nhưng PPI năng lượng lại giảm. Hàn Quốc cần theo dõi gì?
3. Câu hỏi 85/100: Vì sao hai chỉ số năng lượng Mỹ có thể đi ngược chiều mà không mâu thuẫn?
Chọn #1. Điểm biên tập dự kiến 88/100, chưa phải QC.

## Script
### 1. Giá năng lượng: hai tín hiệu trái chiều
Giá năng lượng tại Mỹ đang gửi hai tín hiệu trái chiều. Điều đó có ý nghĩa gì với đồng won và chi phí nhập khẩu của Hàn Quốc?
Nguồn: bls-cpi, bls-ppi

### 2. CPI năng lượng tăng 0,7%
Báo cáo công bố ngày mười tháng mười một cho thấy chỉ số giá tiêu dùng Mỹ tháng mười tăng không phẩy bốn phần trăm so với tháng trước, sau điều chỉnh mùa vụ. Riêng nhóm năng lượng tăng không phẩy bảy phần trăm. Đây là mức tăng theo tháng, không phải theo năm.
Nguồn: bls-cpi

### 3. Năng lượng PPI giảm nhẹ
Nhưng báo cáo giá sản xuất công bố ngày mười ba tháng mười một lại ghi nhận năng lượng trong nhóm nhu cầu cuối cùng giảm không phẩy một phần trăm. Toàn bộ PPI tăng không phẩy ba phần trăm theo tháng. Hai chỉ số đo các khâu và rổ hàng khác nhau, nên không thể xem chúng là mâu thuẫn trực tiếp.
Nguồn: bls-ppi

### 4. Won và chi phí nhập khẩu
Đối với Hàn Quốc, cần theo dõi hai kênh. Một là kỳ vọng lãi suất Mỹ có thể ảnh hưởng lợi suất, dòng vốn và tỷ giá đô la trên won. Hai là giá dầu nhập khẩu tính bằng đô la và tỷ giá cùng quyết định chi phí quy đổi sang won. CPI Mỹ không phải giá dầu nhập khẩu thực tế của Hàn Quốc, và cũng không đủ để dự báo tỷ giá chắc chắn.
Nguồn: bls-cpi, bls-ppi

### 5. Đối chiếu đúng ba biến
Điểm quan trọng là phân biệt chỉ số giá tiêu dùng với giá sản xuất, và so sánh cùng kỳ đo lường. BLS cũng chưa công bố được mức tăng CPI toàn phần mười hai tháng của tháng mười vì thiếu dữ liệu gốc tháng mười năm trước. Vì vậy đừng tự suy ra một con số lạm phát năm.
Nguồn: bls-cpi, bls-ppi

CTA chỉ đọc một lần: Hãy lưu ba biến cần kiểm tra cùng nhau: giá năng lượng, lợi suất Mỹ và tỷ giá đô la trên won. Theo dõi Korea Capital Insight để cập nhật dữ liệu mới.

Caption: 🇰🇷 CPI và PPI năng lượng Mỹ đi ngược chiều. Điều này liên quan gì đến đồng won và chi phí nhập khẩu Hàn Quốc? Cùng tìm hiểu nhé! #KoreaCapitalInsight #ViMo

## QC
Preflight runner, Vbee, MP4, audio, durations, loudness, effect sync, Sheet: NOT_VERIFIED. Chưa đăng. Không gọi paid TTS trước khi preflight thực tế và chống trùng runs.
