# KCI — NEWSROOM VARIATION LIBRARY V1 (23/11/2026)

**Bắt buộc cho các kịch bản MỚI**: KR_AM 08h, GLOBAL_US/US_AM 09h (Thứ 2–Thứ 7), KR_MID 12h nếu đủ tin, KR_CLOSE 17h, MACRO21 21h KST. Đọc cùng `PERSONAL_NEWSROOM_V1.md`, `SCRIPT_FORMAT.md`, `HOOK_CTA.md`. Đây là ngân hàng **phương pháp diễn đạt và biến tấu biên tập**, KHÔNG phải lời dẫn phải chép nguyên và không phải một bộ dữ kiện thị trường. Dấu `<...>` bên dưới là chỗ **phải** thay bằng dữ kiện đã kiểm chứng (ngày/giờ, sàn, sự kiện, đơn vị). Không thể dùng khuôn nếu không có dữ kiện hỗ trợ.

**Mục tiêu:** không lặp "KOSPI tiếp tục…/Điều đáng chú ý…/Trong bối cảnh…/Theo mọi người…/Hãy chia sẻ…" ngày qua ngày; vẫn tạo cảm giác *một người dẫn tin có bản sắc riêng*. Thay đổi **góc tiếp cận, cơ chế dẫn chuyện, nhịp chuyển cảnh, câu hỏi kết và lời mời theo dõi**, chứ không chỉ đảo từ đồng nghĩa.

## A. 12 cấu trúc kể tin — chọn MỘT cấu trúc chủ đạo khi viết job

| ID | Cách dẫn | Logic biên tập | Phù hợp |
|---|---|---|---|
| A01 | Tin nóng và bối cảnh | Sự kiện bất thường → số liệu chốt → vì sao xảy ra → điều cần xác nhận | KR_CLOSE, KR_MID |
| A02 | Diễn biến đảo chiều | Mức cao/thấp trong phiên → chốt phiên → lực mua/bán → điều có thể đổi xu hướng | KR_CLOSE |
| A03 | Hai dòng chảy ngược | Nhóm A tích cực nhưng B suy yếu → phân tích lực đẩy/lực cản → tín hiệu xác nhận | KR_AM, US_AM |
| A04 | Chuỗi truyền dẫn | Sự kiện Mỹ/chính sách → lợi suất/USD/AI/chi phí vốn → nhóm Hàn chịu ảnh hưởng → theo dõi gì | US_AM, MACRO21 |
| A05 | Chính sách giải mã | Quyết định mới → cơ chế thực thi → ai được hưởng/chịu tác động → giới hạn thực tế | KR_MID, MACRO21 |
| A06 | Số liệu vượt kỳ vọng | Actual so với forecast/previous → giải thích khoảng lệch → thị trường phản ứng → dữ liệu kế tiếp | US_AM, MACRO21 |
| A07 | Tâm điểm doanh nghiệp | Kết quả kinh doanh/công bố → biên lợi nhuận/đơn hàng → tác động ngành → dữ kiện theo dõi | KR_AM, US_AM |
| A08 | Độ rộng và dòng vốn | Chỉ số chung → ngành mạnh/yếu → khối ngoại/tổ chức → bài toán thanh khoản | KR_CLOSE |
| A09 | Dữ kiện và lo ngại | Điều đã xác nhận → thị trường đang suy đoán điều gì → thiếu mắt xích nào → mốc làm rõ | US_AM, KR_MID |
| A10 | Dòng thời gian | Sự kiện trước phiên → phản ứng trong phiên → quyết định sau phiên → tác động tiếp theo | KR_CLOSE, MACRO21 |
| A11 | Ba dấu hiệu cần theo dõi | Tin lớn → ba chỉ báo có thể kiểm chứng → yếu tố nào có thể đảo chiều cách hiểu | KR_AM, weekend |
| A12 | Nghịch lý vĩ mô | Hai dữ kiện trái chiều (có nguồn) → vì sao không mâu thuẫn → cơ chế/độ trễ → quyết định tiếp theo | MACRO21 |

Không ép mỗi ngày có đủ 6 cảnh hoặc 3 chỉ số. Bản tổng hợp nhiều tin có thể dùng 2–3 mini-arcs có chuyển cảnh, nhưng phải phân biệt nội dung độc lập. Tên ID chỉ phục vụ theo dõi, không đọc ra tiếng. **Không suy luận nguyên nhân duy nhất khi chỉ có tương quan giá.**

## B. 18 kiểu mở tin (hook), không dùng số liệu minh họa chưa kiểm chứng

**Thị trường Hàn Quốc / KR_AM – KR_CLOSE**

- H01 — Đỉnh/đáy trong phiên: "Có thời điểm <chỉ số> giảm tới <x%>, trước khi <diễn biến cuối phiên>. Điều gì đã diễn ra?"
- H02 — Mở bằng quyết định mới: "Cơ quan quản lý Hàn Quốc vừa <quyết định>. Biện pháp này có thể ảnh hưởng đến dòng tiền ra sao?"
- H03 — Dòng vốn ngược chỉ số: "Trong lúc <chỉ số> <diễn biến>, <khối nhà đầu tư> lại <mua/bán> ròng. Điểm khác biệt nằm ở đâu?"
- H04 — Phân hóa ngành: "Thị trường <đi lên/đi xuống>, nhưng <ngành/nhóm> lại diễn biến ngược chiều."
- H05 — Giá phản ứng sau công bố: "Ngay sau <công bố có thời gian xác minh>, <nhóm cổ phiếu> <biến động>. Điều gì đáng chú ý trong thông tin mới?"
- H06 — Phiên thứ N liên tiếp: "<chỉ báo> tiếp tục <xu hướng có chuỗi được xác minh> sang phiên thứ <n>. Dòng tiền đang phản ứng thế nào?"
- H07 — Tín hiệu trước mở cửa: "Trước giờ mở cửa, <sự kiện chính thức/phiên Mỹ đã kết thúc> đang được theo dõi vì <kênh tác động Hàn Quốc>."
- H08 — Bài toán lợi nhuận: "<doanh nghiệp> vừa công bố <thực tế>. Diễn biến này nói gì về <mảng kinh doanh>?"

**US_AM / Phố Wall → Hàn Quốc**

- H09 — Mỹ tăng, chip giảm: "Phố Wall <diễn biến có nguồn>, nhưng nhóm bán dẫn lại <diễn biến đối lập>. Thị trường Hàn Quốc cần chú ý gì?"
- H10 — SOX → Hàn: "Nhóm bán dẫn Mỹ vừa <mức thay đổi> trong phiên <ngày Mỹ>. Samsung và SK hynix có thể chịu tác động qua kênh nào?"
- H11 — Fed → lợi suất → KRW: "<quyết định/phát biểu Fed> khiến thị trường chú ý đến <lợi suất/USD>. Điều này liên quan gì đến tài sản Hàn Quốc?"
- H12 — Báo cáo lợi nhuận và kỳ vọng: "<công ty Mỹ> công bố <số liệu>. Phản ứng của thị trường nằm ở kết quả hiện tại hay kỳ vọng phía trước?"
- H13 — Giá dầu và nhà nhập khẩu: "Giá dầu vừa <thay đổi xác nhận>. Những ngành Hàn Quốc nào nhạy cảm nhất với thay đổi này?"
- H14 — Dữ liệu lao động/lạm phát: "Báo cáo <chỉ số US> vừa <cao/thấp hơn dự báo>. Vì sao lợi suất và nhóm chip được theo dõi ngay sau đó?"

**MACRO21 / KR_MID**

- H15 — Lãi suất chính sách so với lãi vay: "<BOK/Fed> <quyết định>, nhưng <lãi vay/FX> lại <diễn biến>. Khoảng cách đến từ đâu?"
- H16 — Thực tế khác dự báo: "<số liệu vĩ mô> vừa <cao/thấp> hơn <mốc so sánh có nguồn>. Kỳ vọng thị trường thay đổi thế nào?"
- H17 — Chính sách chính thức vs kế hoạch: "<cơ quan> đã quyết định <biện pháp>, trong khi <giải pháp khác> vẫn đang chuẩn bị. Cần phân biệt điều gì?"
- H18 — Tin giữa phiên: "Ngay giữa phiên hôm nay, <diễn biến MỚI trọng yếu> xuất hiện. Vì sao thông tin này có thể làm thay đổi đánh giá trước đó?"

Không nhất thiết luôn kết hook bằng câu hỏi. Nếu hook câu hỏi, 1–2 câu tiếp theo phải cung cấp thông tin thật, không câu giờ. Tránh dùng liên tục từ "lao dốc", "bùng nổ", "gây sốc" và đừng dùng kỹ thuật kể chuyện đổi bối cảnh mà xuyên tạc dữ liệu.

## C. 24 cách nối ý, tránh một bài dùng cùng một câu đệm lặp lại

| Chức năng | Các cách dẫn gợi ý — chỉ dùng nếu nội dung thật sự tương ứng |
|---|---|
| Chuyển từ hook sang số liệu | "Kết thúc phiên, …" · "Trên bảng điện, …" · "Tại thời điểm công bố, …" · "Xét riêng phiên chính KRX, …" |
| Làm rõ điểm khác thường | "Điểm khác biệt nằm ở …" · "Sự phân hóa thể hiện rõ nhất ở …" · "Dòng vốn lại kể một câu chuyện khác: …" · "Chi tiết đáng theo dõi không chỉ là mức giảm, mà còn …" |
| Dẫn cơ chế tác động | "Tác động có thể đi qua kênh …" · "Mắt xích quan trọng nằm ở …" · "Khi <biến số> thay đổi, chi phí/kỳ vọng …" · "Với doanh nghiệp Hàn Quốc, hệ quả trực tiếp hơn là …" |
| Phân biệt dữ kiện và suy luận | "Dữ liệu hiện xác nhận …; còn <điều khác> vẫn cần kiểm chứng." · "Diễn biến này phù hợp với lo ngại …, nhưng chưa đủ chứng minh …" · "Thị trường đang phản ánh kỳ vọng … hơn là một quyết định đã có hiệu lực." · "Đến thời điểm chốt tin, <việc> vẫn chưa được công bố." |
| Chính sách và giới hạn | "Trên thực tế, biện pháp này cho phép …" · "Khả năng tác động phụ thuộc vào …" · "Quyết định đã ban hành, còn hiệu quả phải chờ …" · "Việc nới quy định không đồng nghĩa <hành động được bảo đảm>." |
| Kết sang phần theo dõi | "Trong các phiên tới, thị trường sẽ có thêm dữ kiện từ …" · "Mốc kiểm chứng kế tiếp là …" · "Để đánh giá liệu áp lực đã hạ nhiệt, cần quan sát …" · "Tín hiệu đáng theo dõi hơn một nhịp hồi đơn lẻ là …" |

Chọn nhiều nhất **2–3 câu nối rõ** cho video ngắn; phần còn lại nối bằng dữ kiện trực tiếp, tránh dùng "Điều đáng chú ý là…" như câu mở mỗi cảnh. Câu nối phải ăn khớp thông tin trước/sau, không lắp ghép cơ học.

## D. 35 câu hỏi CTA MỞ theo 5 edition — tùy biến theo sự kiện thật

**KR_AM — 7 góc hỏi**
1. "Trước giờ mở cửa, mọi người đang chú ý tín hiệu nào để đánh giá tâm lý thị trường hôm nay?"
2. "Từ những thông tin vừa công bố, yếu tố nào sẽ đáng theo dõi nhất trong phiên Hàn Quốc?"
3. "Theo anh chị, dữ liệu nào có thể làm thay đổi kỳ vọng với nhóm cổ phiếu <ngành> trong hôm nay?"
4. "Ở phiên tới, diễn biến nào sẽ giúp đánh giá rõ hơn sức mạnh của dòng tiền?"
5. "Mọi người muốn theo sát thông tin nào từ <doanh nghiệp/ngành> trong vài ngày tới?"
6. "Thông tin mới khiến anh chị quan tâm nhiều hơn đến chỉ báo nào của thị trường Hàn Quốc?"
7. "Nếu phải chọn một số liệu để kiểm chứng trong phiên, mọi người sẽ theo dõi số liệu nào?"

**GLOBAL_US / US_AM — 8 góc hỏi**
8. "Sau phiên Phố Wall vừa qua, mọi người muốn theo dõi tín hiệu nào nhất ở thị trường Hàn Quốc?"
9. "Theo anh chị, thay đổi nào của nhóm bán dẫn Mỹ sẽ đáng chú ý nhất với Samsung và SK hynix?"
10. "Mối liên hệ giữa <Fed/lợi suất/USD> và chứng khoán Hàn Quốc khiến mọi người chú ý đến chỉ báo nào?"
11. "Ở phiên Hàn Quốc sắp tới, tín hiệu nào có thể xác nhận ảnh hưởng từ diễn biến Phố Wall?"
12. "Từ báo cáo <công ty/báo cáo US>, thông tin nào có ý nghĩa nhất với triển vọng ngành chip Hàn Quốc?"
13. "Mọi người muốn kênh đào sâu thêm mắt xích nào giữa giá dầu và các doanh nghiệp Hàn Quốc?"
14. "Trong những dữ kiện của phiên Mỹ, yếu tố nào còn cần thêm xác nhận trước khi đánh giá tác động tới KOSPI?"
15. "Theo anh chị, điều gì có thể khiến thị trường Hàn Quốc phản ứng khác với diễn biến vừa thấy ở Mỹ?"

**KR_MID (chỉ khi có tin mới trọng yếu) — 5 góc hỏi**
16. "Diễn biến mới giữa phiên khiến mọi người muốn theo dõi thêm thông tin nào?"
17. "Ở phần còn lại của phiên, yếu tố nào có thể cho thấy thị trường đã hấp thụ tin mới?"
18. "Sau quyết định vừa công bố, mọi người cần dữ liệu gì để đánh giá hiệu quả thực tế?"
19. "Theo anh chị, ngành nào sẽ cần thêm thông tin nhất để đánh giá tác động của thay đổi này?"
20. "Điểm nào trong thông báo mới còn cần được làm rõ trước khi thị trường có phản ứng bền vững?"

**KR_CLOSE — 8 góc hỏi**
21. "Theo mọi người, tín hiệu nào sẽ cho thấy thị trường đang dần ổn định trở lại?"
22. "Trong phiên tới, điều gì sẽ giúp phân biệt một nhịp hồi ngắn với sự cải thiện về dòng tiền?"
23. "Nhóm cổ phiếu nào cần có thay đổi về dữ liệu cơ bản để tâm lý chung bớt thận trọng?"
24. "Theo anh chị, dấu hiệu nào sẽ cho thấy lực bán nước ngoài đang thực sự hạ nhiệt?"
25. "Biến động hôm nay để lại câu hỏi nào quan trọng nhất cho phiên giao dịch tiếp theo?"
26. "Với chính sách mới, tín hiệu thực thi nào sẽ cho thấy biện pháp đang phát huy tác dụng?"
27. "Mọi người cần theo dõi thêm dữ liệu nào trước khi đánh giá triển vọng của nhóm bán dẫn?"
28. "Ở góc nhìn của anh chị, diễn biến nào đáng tin cậy nhất để xác nhận sức mạnh thị trường?"

**MACRO21 — 7 góc hỏi**
29. "Trong kỳ công bố tới, số liệu nào sẽ giúp đánh giá rõ hơn tác động của chính sách tiền tệ?"
30. "Theo anh chị, thay đổi nào về <lợi suất/USD-KRW/lãi vay> sẽ đáng theo dõi nhất với kinh tế Hàn Quốc?"
31. "Mọi người quan tâm đến kênh tác động nào của quyết định lãi suất đối với doanh nghiệp và hộ gia đình?"
32. "Dữ liệu nào có thể giúp phân biệt tác động ngắn hạn với xu hướng dài hạn của <vấn đề>?"
33. "Sau báo cáo vừa công bố, điều gì cần cải thiện để áp lực chi phí vốn giảm bớt?"
34. "Theo anh chị, chỉ báo nào phản ánh rõ nhất sức khỏe nhu cầu xuất khẩu Hàn Quốc trong thời gian tới?"
35. "Với triển vọng lạm phát hiện nay, dữ liệu nào ở kỳ tiếp theo có thể làm thay đổi kỳ vọng thị trường?"

**Không chép nguyên một câu hỏi nếu chủ đề không khớp.** Một số câu mang dạng "theo anh chị", "mọi người", hoặc không có cụm mở đầu; hãy xoay vòng ngôi xưng và độ dài, nhưng vẫn hỏi trọng tâm. Tuyệt đối tránh biến CTA thành khuyến nghị mua/bán hoặc hỏi khán giả đưa danh mục cá nhân.

## E. 10 nhịp mời bình luận & theo dõi — phối hợp linh hoạt với 1 câu hỏi ở mục D

01. "Hãy chia sẻ góc nhìn tại phần bình luận và theo dõi kênh để cùng cập nhật những diễn biến tiếp theo nhé."
02. "Mọi người để lại nhận xét bên dưới nhé. Mình sẽ tiếp tục cập nhật các thông tin đáng chú ý trên kênh."
03. "Cùng trao đổi thêm ở phần bình luận, và theo dõi kênh để không bỏ qua các cập nhật liên quan nhé."
04. "Anh chị có thể chia sẻ cách nhìn của mình bên dưới và theo dõi kênh để tiếp tục theo sát chủ đề này."
05. "Để lại góc nhìn của mọi người nhé. Những bản tin tiếp theo sẽ tiếp tục theo dõi các tín hiệu quan trọng."
06. "Nếu quan tâm diễn biến này, hãy cùng thảo luận dưới video và theo dõi kênh để xem những cập nhật mới."
07. "Mình rất muốn nghe các góc nhìn khác nhau ở phần bình luận. Theo dõi kênh để cùng theo dõi những số liệu kế tiếp nhé."
08. "Mọi người có thể bình luận tín hiệu mình đang theo dõi. Hẹn gặp lại ở bản tin tiếp theo trên kênh."
09. "Chia sẻ nhận định ở phần bình luận nhé; kênh sẽ tiếp tục theo dõi dữ liệu mới khi được công bố."
10. "Nếu thấy còn góc nhìn nào cần bổ sung, hãy để lại bình luận và theo dõi kênh để cùng cập nhật nhé."

**Chỉ chọn MỘT lời mời**, không ghép cả đoạn dài. Không phải mọi video đều cần "hẹn gặp lại" (chỉ dùng khi phát hành tiếp thực sự phù hợp), không tự hứa giờ đăng hay báo cáo tiếp theo cụ thể khi chưa chắc chắn. Không xướng tên kênh trong voice; nhận diện bằng logo/đồ họa. Câu hỏi CTA (D) + một câu mời (E) phải nghe trôi như một đoạn ngắn.

## F. Quy trình chống lặp trước khi gọi Vbee — KHÔNG làm chặn cứng kỹ thuật

1. **Đọc tối thiểu 7 video mới nhất của cùng edition**, mở rộng tới 12 video gần đây trên toàn bộ stream nếu truy cập được (ưu tiên các bản 72 giờ gần nhất). So với **job JSON thật**: hook.spoken, scenes[0].voiceText, các câu mở giữa cảnh, `cta.question`, `cta.spoken`, góc kể chính, câu mời ở đuôi. Không lấy các candidate chưa được chọn làm căn cứ đã phát sóng.
2. **Không lặp nguyên văn** hook, câu CTA hoặc lời mời của một tập rất gần. Tránh lặp cùng *góc hỏi* từ 2 ngày liên tiếp dù đổi 2–3 từ. Không dùng một cấu trúc kể chuyện quá hai tập liên tiếp cùng stream nếu có cách khác phù hợp.
3. **Vẫn ưu tiên tin thật.** Nếu thị trường có cùng chủ đề nhiều ngày, thay đổi góc kể bằng dữ kiện mới có chứng cứ (chẳng hạn thanh khoản, biến động intraday, thay đổi dự báo, nguồn phát biểu, chính sách, phản ứng thực tế), **không** bịa chi tiết chỉ để tạo sự mới lạ.
4. Chọn 1 trong 12 narrative arcs, tối thiểu 3 hook candidates THẬT SỰ khác về góc, 1 câu mở CTA bám nguồn, và 1 trong 10 lời mời. Có thể dùng câu tự viết nếu tốt hơn thư viện, nhưng tránh cùng một nếp câu cũ.
5. Lưu vào editorial/brief trường `variationReview`: `edition`, `arcId`, `hookPatternId`, `ctaAngleId`, `closingRhythmId`, `comparedJobIds`, `dissimilarityReason` (tại sao kịch bản này mới và đáng nghe), `reviewedAtKST`. Nếu chưa mở được lịch sử, ghi `HISTORY_NOT_ACCESSIBLE`, không nói đã kiểm tra.
6. Chạy `node scripts/check-editorial-variety.mjs jobs/<filename>.json` khi code đã có. Công cụ chỉ **cảnh báo** lặp nguyên văn/gần giống, không thay thế đọc nội dung; tuyệt đối không ngăn render một video đúng tin do cảnh báo phong cách. Hãy sửa trước bước Vbee nếu có thể.

**Điểm chốt:** "Không trùng" nghĩa là người xem nhận được *một câu chuyện có phát hiện/ý nghĩa mới*, không phải chỉ dùng nhiều từ đồng nghĩa. Mọi số liệu, ngày, phiên Mỹ/KRX/NXT, nguồn và luận điểm phải chính xác. `cta.spoken` chỉ có một lần ở cuối, không lặp trong voiceText cảnh cuối. Giữ giọng Vbee Anh Khôi, render MP4 thật trước khi owner duyệt, không auto-post, không tự thay lịch/quota.
