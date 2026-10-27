# KCI Global/US — 27/10/2026 · MP4 ĐÃ DỰNG, CHỜ ANH DUYỆT

**Article ID:** KCI-20261027-US-AM · **Stream:** GLOBAL_US / US_AM · **Cutoff:** 2026-10-27T09:05:23+09:00 · **Nguồn gần nhất:** US regular close thứ Hai **26/10/2026 16:00 EDT = thứ Ba 27/10 05:00 KST**. Tin và dữ liệu sau cutoff không được tự đưa vào edition này.

## Cập nhật sau render 27/10/2026 — trạng thái mới nhất

- Sau lượt tự động 09:00 bị dừng ở `BLOCKED_PIPELINE`, chủ kênh yêu cầu **render MP4 ngay, duyệt sau khi có video**. Giờ/slot không thay đổi, không tạo video trùng.
- Đã kích hoạt [GitHub Issue #36](https://github.com/nvt91/kcinews/issues/36); [Actions run 40426006490](https://github.com/nvt91/kcinews/actions/runs/40426006490) kết thúc SUCCESS. Artifact gốc ID `12699822444`, tạo 27/10/2026 khoảng 09:29 KST, hết hạn 03/11/2026 khoảng 09:29 KST.
- Artifact có 7 đoạn MP3 Vbee **Anh Khôi Tin tức** (code `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`), `out/kci-2026-10-27-us-am.mp4` 76,07 giây, 1080×1920 30fps H.264/AAC và source ledger/SRT. Tổng container duration của 7 MP3 **73,632 giây**; không có camera take.
- QC video gốc phát hiện chữ Anthropic quá lớn và tràn mép phải. Bản `KCI_Global_US_2026-10-27_AnhKhoi_Review.mp4` được sửa từ MP4 gốc bằng đồ họa overlay (không gọi lại Vbee): hook có chữ lớn khung 0, hai nhịp cảnh Anthropic không cắt chữ, tăng chất lượng video và cân âm. Bản sửa **đã bàn giao riêng qua ChatGPT**, chưa nằm trong GitHub artifact gốc. File sửa: 76,07 giây, **172.263.401 byte**, H.264 khoảng **17,88 Mbps**, AAC thực tế ~233 kbps, loudness **−14,82 LUFS**, true peak **−1,14 dBTP**, decode toàn bộ PASS, 0 black frame >0,08 giây. 19 khung hình mẫu đã được kiểm tra.
- Các bước chưa được chứng minh: nghe thẩm định toàn bộ giọng/phát âm, Whisper word-level alignment, ≤2 frame effects map; **23 ứng viên khoảng lặng ≥0,25s** từ máy phát hiện (không đồng nghĩa 23 lỗi), **0 khoảng lặng bị cắt bằng biên tập**. Camera take/da/zoom mắt=N/A.
- Trạng thái cuối: **MP4 — CẦN RÀ SOÁT / CHỜ DUYỆT / CHƯA ĐĂNG**; Google Sheet KCI News tab Trang tính1, hàng 15 đã ghi giờ hoàn thành, link run, tình trạng thật và liên kết nguồn. Không tự đăng. Lịch sử BLOCKED trước render bên dưới chỉ là trạng thái tại thời điểm 09:13 KST, không còn đại diện kết quả mới nhất.

## Tóm tắt biên tập

**1. Phố Wall hồi sau hai tuần giảm, SOX hồi mạnh hơn chỉ số chung.** Theo Reuters, phiên chính Mỹ 26/10 khép lại với S&P 500 **7.676,77 (+0,70%)**, Nasdaq Composite **26.169,38 (+0,83%)**, Dow Jones **52.361,58 (+0,28%)**. AP xác nhận các mức đóng cửa. Philadelphia Semiconductor Index (SOX) tăng **2,8%**, nhưng Reuters vẫn ghi nhận chỉ số bán dẫn giảm **12,2% trong tháng** tới thời điểm đó. Đây là một phiên hồi phục có thật, không đủ để khẳng định rủi ro đối với AI đã kết thúc. [Reuters](https://www.reuters.com/business/us-stock-futures-edge-up-oil-falls-heading-into-earnings-barrage-2026-10-26/) · [AP](https://apnews.com/article/wall-street-stocks-dow-nasdaq-693ac6c4e67da0332045e66804780be7).

**2. Meta công bố kế hoạch huy động cổ phần quy mô rất lớn, không phải đã thu đủ tiền.** Công bố gốc ngày 26/10 của Meta nêu hai nhóm: khoảng **35 tỷ USD** trong các đợt chào bán đang triển khai, và chương trình **60 tỷ USD** dự kiến sau khi cổ phiếu Class C bắt đầu giao dịch, sớm nhất quý I/2027; chương trình sau **chưa được thiết lập**. Tổng **95 tỷ USD** là quy mô **kế hoạch có điều kiện**, không phải số vốn hoàn tất. Cổ phiếu Meta đóng cửa giảm **1,9%** theo Reuters. Nên giải thích vừa có nhu cầu AI, vừa tăng yêu cầu chứng minh hiệu quả vốn; tránh gọi đây là dòng tiền đã thực thu. [Meta](https://www.prnewswire.com/news-releases/meta-announces-launch-of-offering-of-depositary-shares-representing-series-a-mandatory-convertible-preferred-stock-and-offering-of-class-a-common-stock-in-connection-with-forward-sale-agreements-302919267.html) · [Reuters](https://www.reuters.com/business/us-stock-futures-edge-up-oil-falls-heading-into-earnings-barrage-2026-10-26/).

**3. Anthropic nộp hồ sơ IPO, thêm phép thử kỳ vọng AI.** Reuters đưa tin hồ sơ của Anthropic phản ánh tăng trưởng doanh thu cao song song chi phí, thua lỗ và rủi ro bảo mật/vận hành. Thông tin khiến nhóm liên quan AI thu hút trở lại, nhưng một **hồ sơ xin niêm yết không đồng nghĩa IPO đã hoàn tất**. Lập luận thị trường có hai vế: nhu cầu sử dụng AI có thể còn mở rộng, trong khi mô hình vốn đầu tư và biên lợi nhuận vẫn phải kiểm chứng. [Reuters IPO](https://www.reuters.com/legal/litigation/anthropic-discloses-month-long-training-pause-ai-security-breaches-ipo-filing-2026-10-26/) · [Reuters thị trường](https://www.reuters.com/business/us-stock-futures-edge-up-oil-falls-heading-into-earnings-barrage-2026-10-26/).

**4. Lịch chính sách và dữ liệu Mỹ chưa ngã ngũ.** Fed có lịch FOMC **27–28/10 giờ Mỹ**; các kỳ vọng giữ nguyên lãi suất hiện là dự báo thị trường, **chưa phải quyết định**. BEA lên lịch **GDP quý III/2026 (ước tính sơ bộ)** và **PCE tháng 9/2026** cho **29/10 Mỹ**. Reuters cũng ghi nhận lịch báo cáo của Microsoft, Alphabet và Amazon trong tuần. Không bịa EPS hoặc kết quả chưa công bố. [Fed](https://www.federalreserve.gov/monetarypolicy.htm) · [BEA GDP](https://www.bea.gov/data/gdp/gross-domestic-product) · [BEA PCE](https://www.bea.gov/data/personal-consumption-expenditures-price-index) · [Reuters](https://www.reuters.com/business/us-stock-futures-edge-up-oil-falls-heading-into-earnings-barrage-2026-10-26/).

**5. Truyền dẫn tới Hàn Quốc: điều kiện chứ không phải dự đoán giá.** Yonhap ghi nhận KOSPI đóng **26/10** tại **5.469,47 (−1,46%)**, trước khi phiên Mỹ sau đó hồi. SOX có thể hỗ trợ tâm lý chip, nhưng báo cáo doanh nghiệp và đơn hàng HBM mới kiểm tra được sức bền. Nếu chi phí AI cao trong khi lợi nhuận chưa đáp ứng, nhóm chip và thiết bị có thể biến động; dầu và lợi suất Mỹ cao kéo dài còn gây áp lực lạm phát, tỷ giá USD/KRW và biên lợi nhuận doanh nghiệp nhập khẩu năng lượng. Nguồn Brent phiên 26/10 có **sai khác đáng kể** giữa một số bản tin; không chốt giá Brent bằng một số duy nhất trong voice/đồ họa lần này. [Yonhap](https://en.yna.co.kr/view/AEN20261026006400320) · [MarketWatch dầu](https://www.marketwatch.com/livecoverage/stock-market-today-dow-s-p-500-nasdaq-federal-reserve-interest-rate-decision-october-meeting/card/global-oil-futures-settle-with-biggest-decline-in-two-weeks-NUjT60i2GpZlstsC2U3G). Đây là cơ chế phân tích, không phải tín hiệu mua/bán.

## Hook (biên tập nội bộ; không phải thống kê phản hồi người xem)

1. **92/100 — Chọn:** Phố Wall bật tăng, còn Meta muốn huy động tới chín mươi lăm tỷ đô la cho AI. Có gì phía sau hai tín hiệu trái chiều?
2. **88/100:** Cổ phiếu bán dẫn Mỹ tăng gần ba phần trăm. Liệu ngành chip Hàn Quốc sẽ được hưởng lợi?
3. **86/100:** Fed sắp quyết định lãi suất, còn Big Tech chuẩn bị báo cáo. Nhịp hồi Phố Wall có bền?

Tiêu chí: đúng dữ kiện, dễ hiểu ngay ba giây đầu, hấp dẫn nhưng không giật tít, có giá trị cho độc giả chứng khoán Hàn Quốc.

## Kịch bản đọc · storyboard

### Nhịp 1: hook — PHỐ WALL HỒI · META 95 TỶ USD?
- **Voice:** Phố Wall bật tăng, còn Meta muốn huy động tới chín mươi lăm tỷ đô la cho AI. Có gì phía sau hai tín hiệu trái chiều?
- **Hình:** spotlight, Hai tín hiệu khác chiều về kỳ vọng AI sau phiên Mỹ 26/10.
- **Nguồn:** reuters-us-2610, meta-primary-2610
- **Đồ họa/cảnh báo:** Meta đề xuất tài trợ bằng vốn cổ phần, không phải vốn đã huy động thành công.

### Nhịp 2: wallstreet — S&P 500 +0,70% · SOX +2,8%
- **Voice:** Phiên Mỹ ngày hai mươi sáu tháng mười, S&P năm trăm tăng không phẩy bảy phần trăm; Nasdaq tăng không phẩy tám ba. Dow Jones tăng không phẩy hai tám phần trăm. Chỉ số bán dẫn Philadelphia tăng hai phẩy tám phần trăm, nhưng vẫn giảm sâu từ đầu tháng.
- **Hình:** comparison, Nasdaq +0,83%; Dow +0,28%. Nhịp hồi chưa xóa rủi ro AI.
- **Nguồn:** reuters-us-2610, ap-us-2610
- **Đồ họa/cảnh báo:** Đóng cửa phiên chính Mỹ 26/10/2026; SOX vẫn -12,2% từ đầu tháng theo Reuters.

### Nhịp 3: meta — META LÊN KẾ HOẠCH HUY ĐỘNG 95 TỶ USD
- **Voice:** Meta công bố kế hoạch huy động tối đa chín mươi lăm tỷ đô la cho AI. Khoảng ba mươi lăm tỷ là các đợt chào bán vừa khởi động; sáu mươi tỷ còn lại mới là dự kiến. Cổ phiếu Meta giảm một phẩy chín phần trăm. Đây chưa phải số tiền đã huy động đủ.
- **Hình:** comparison, 35 tỷ đang chào bán; 60 tỷ mới ở giai đoạn dự kiến.
- **Nguồn:** meta-primary-2610, reuters-us-2610
- **Đồ họa/cảnh báo:** Nguồn Meta 26/10: KẾ HOẠCH TỐI ĐA, chưa hoàn tất; phần ~60 tỷ chưa được thiết lập.

### Nhịp 4: anthropic — AI TĂNG NHANH, CHI PHÍ CŨNG LỚN
- **Voice:** Anthropic nộp hồ sơ IPO tại Mỹ. Doanh thu tăng nhanh nhưng mức lỗ và rủi ro vận hành vẫn lớn. Nhu cầu AI có thể tăng, song hiệu quả vốn đầu tư vẫn cần kiểm chứng.
- **Hình:** company, Hồ sơ IPO không đồng nghĩa đã niêm yết hoặc đã có lãi.
- **Nguồn:** reuters-us-2610, reuters-anthropic-2610
- **Đồ họa/cảnh báo:** Nộp hồ sơ IPO ngày 26/10/2026; KHÔNG phải IPO đã hoàn tất.

### Nhịp 5: fed — FED 27–28/10 · GDP/PCE 29/10
- **Voice:** Fed họp hai mươi bảy và hai mươi tám tháng mười. GDP quý ba và PCE tháng chín của Mỹ dự kiến công bố ngày hai mươi chín. Cùng tuần, Microsoft, Alphabet và Amazon báo cáo. Đây là các sự kiện chưa có kết quả tại thời điểm bản tin.
- **Hình:** generic, Lịch công bố quan trọng cho kỳ vọng lãi suất và vốn AI.
- **Nguồn:** fed-primary-oct2026, bea-gdp-2910, bea-pce-2910, reuters-us-2610
- **Đồ họa/cảnh báo:** Lịch sự kiện trước thời điểm công bố; không hiển thị số liệu GDP/PCE tháng 9 chưa có.

### Nhịp 6: korea — SOX HỒI CÓ ĐỦ ĐỠ KOSPI?
- **Voice:** Với Hàn Quốc, Samsung Electronics và SK hynix có thể hưởng lợi khi nhóm chip Mỹ hồi. Nhưng KOSPI mới đóng cửa phiên hai mươi sáu giảm một phẩy bốn sáu phần trăm. Nếu chi phí AI vượt hiệu quả kinh doanh, hoặc dầu và lợi suất Mỹ neo cao, đồng won cùng cổ phiếu Hàn có thể chịu sức ép.
- **Hình:** generic, Theo dõi giá dầu, thông điệp Fed và hướng dẫn đầu tư AI.
- **Nguồn:** reuters-us-2610, yonhap-kospi-2610, meta-primary-2610, marketwatch-oil-2610
- **Đồ họa/cảnh báo:** Hai phiên chính tại Mỹ/Hàn thuộc cùng ngày địa phương 26/10; không dùng đây làm dự báo giá 27/10.

### Nhịp 7: outro — TIN TỐT CHƯA XÓA HẾT RỦI RO
- **Voice:** Đó là tín hiệu cần quan sát, chưa đủ để kết luận về xu hướng hay quyết định mua bán.
- **Hình:** closing, Kết quả doanh nghiệp + Fed + dữ liệu kinh tế mới là phép thử.
- **Nguồn:** fed-primary-oct2026, bea-gdp-2910, bea-pce-2910, reuters-us-2610
- **Đồ họa/cảnh báo:** Bản tin tham khảo; không phải tư vấn giao dịch cá nhân.

**CTA Vbee nối CHỈ một lần cuối nhịp outro:** Theo anh chị, sức bật của cổ phiếu chip hay chi phí đầu tư AI đáng chú ý hơn? Bình luận góc nhìn và theo dõi Korea Capital Insight.

## Caption đăng bài — 91 ký tự, gồm hashtag

Phố Wall hồi, Meta tính huy động vốn lớn cho AI. Anh chị nghĩ sao? #KoreaCapitalInsight #AI

Hashtag nêu đúng chủ đề, **chưa xác minh là xu hướng trên Facebook/Instagram**; không tự gọi là viral.

## Effects plan & trạng thái lịch sử lúc 09:13 KST trước khi render

- `jobs/kci-2026-10-27-us-am-effects.json` có 25 nhịp keyword/số/CTA, tất cả có từ khóa trong chính bản script này. Dự kiến 2–4 từ/cue, hình nhấn vào số liệu đúng thời điểm nói, vùng an toàn top220/bottom420/right140, Inter Bold, navy #1c2c58 và xanh #365daa. Không dùng ảnh fake sàn chứng khoán, đường giá suy diễn hay phụ đề cả câu.
- **Input:** tts_motion. Chọn take, phát hiện khuôn mặt, chỉnh màu da, before/after footage = **N/A**.
- **Khả thi lúc biên tập:** PR #34 vẫn OPEN và chưa hợp nhất; `scripts/run-job.mjs` trên main vẫn dùng 7-word proportional captions, preview mode không có voice còn video mode render MP4 trước phê duyệt. Theo `KCI_EDIT_20261026_V1`, **BLOCKED_PIPELINE trước paid TTS/issue trigger**. Không dùng route cũ để giả bản preview hợp chuẩn.
- **Trạng thái:** chưa MP3 mới, chưa voiced preview, chưa final, chưa xuất bản. Duration raw/edit, take rejected, khoảng lặng phát hiện/đã cắt, deltaFrames, LUFS/true peak/bitrate = **NOT_MEASURED**. Không ghi 0 giả. Sau khi pipeline có khả năng và kiểm định, phát hành voiced preview+beat stills cho anh duyệt; chỉ sau chủ kênh xác nhận đúng preview mới final, và không tự đăng.
- **Dữ liệu giao dịch:** không sử dụng báo giá intraday Hàn Quốc 27/10; KOSPI là close 26/10. Chỉ sau giờ 09:05 KST 27/10 mới có thể có cập nhật mới.

**Lưu Sheet:** tab Trang tính1, khóa KCI-20261027-US-AM; nguồn từ tài liệu GitHub/Sheet ledger. H=CHỜ DUYỆT, I=CHƯA ĐĂNG, G=BLOCKED, C/E để trống khi chưa có file thật.
