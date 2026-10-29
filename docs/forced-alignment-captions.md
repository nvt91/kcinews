# Đề xuất căn phụ đề theo thời gian từng từ (offline)

Chưa cài đặt và chưa đổi pipeline. Water đo phụ đề lệch khoảng 1 giây so với tiếng. Tài liệu này chỉ giải thích nguyên nhân khả dĩ và một cách căn lại miễn phí.

## Pipeline hiện tại

Phụ đề không được commit. `.gitignore` bỏ qua `out/`. `scripts/run-job.mjs` tạo phụ đề lúc dựng video:

- Gọi Vbee từng cảnh, đo độ dài MP3 bằng ffprobe.
- `durationFrames = ceil(giây × 30) + 10`. Mười frame cuối (khoảng 0,33 giây) là đệm; phần phụ đề chỉ trải trên `durationFrames - 10`.
- Tách `voiceText` bằng khoảng trắng, mỗi cue 7 từ, chia đều theo số từ trên độ dài audio. Không có mốc từng từ.
- Ghi `out/props.json` và `out/subtitles-estimated.srt`. `out/qc.json` ghi phụ đề là ước lượng, cần nghe lại.
- `src/KciNewsDaily.tsx` hiện cue theo frame trong cảnh. Chữ cue mờ dần 5 frame (khoảng 0,17 giây). Cả lớp hình mờ dần 10 frame đầu (khoảng 0,33 giây). Audio bắt đầu ở frame 0, ngoài lớp mờ đó.

`package.json` không có Whisper. `EDITING_WORKFLOW.md` yêu cầu mốc từ trên audio thật, và ghi nhận bước này chưa được cài. Hai video 29/10 không có file SRT/timing trong repo. Artifact của run `40809139571` (KR_MID) và `40841785749` (KR_CLOSE) chứa bản phụ đề tỷ lệ từ sinh ra lúc render. Đổi lời thì các file đó lỗi thời. PR này không sinh lại.

## Vì sao có thể lệch khoảng 1 giây

Chưa đo lại MP3. Các cơ chế sau đủ lớn để giải thích mức Water nghe, và có thể cộng dồn:

1. Cue 7 từ hiện cùng lúc. Từ đứng giữa cue không có mốc riêng. Với thoại khoảng 9–15 giây, một cue thường dài khoảng 1–1,5 giây.
2. Chia đều theo số từ. Cụm số đọc chậm hơn từ chức năng, nên lệch tích lũy tới khoảng một giây ở giữa cảnh.
3. ffprobe tính cả khoảng lặng đầu/cuối của MP3. Phụ đề bắt đầu ở frame 0. Nếu Vbee có lặng đầu vài trăm mili giây tới khoảng một giây, chữ đi trước tiếng. Chưa mở file MP3 của hai video này để đo khoảng lặng.
4. Fade hình 0,33 giây và fade chữ 0,17 giây làm chữ trông muộn hơn tiếng, nhưng riêng nó nhỏ hơn một giây. Đệm 10 frame ở cuối cảnh không đẩy cả dãy phụ đề đi một giây.

## Cách căn lại, không tốn credit Vbee

Dùng audio MP3 đã có. Không gọi lại Vbee nếu lời cảnh đó không đổi.

1. Chạy Whisper offline (`whisper.cpp` hoặc bản Python chạy máy cục bộ), model nhỏ hoặc base, `word_timestamps`, ngôn ngữ `vi`. Không gửi audio lên API trả phí.
2. Không lấy chữ Whisper làm lời phát. Giữ nguyên `voiceText` đã duyệt. Chỉ dùng mốc thời gian: khớp chuỗi từ đã duyệt với token nhận dạng (forced alignment). Số, ngày và phủ định giữ đúng bản đã duyệt khi Whisper nghe sai.
3. Ghi cue vào đúng dạng `{from, to, text}` mà `KciNewsDaily` đang đọc, và vào SRT. Mốc là frame 30fps trong cảnh, sau khi đã trừ lặng đầu đo được.
4. Thêm một mode dựng chỉ render lại hình, trỏ vào MP3 cũ. `run-job.mjs` hiện không có mode đó: `video` gọi Vbee mọi cảnh rồi mới chia phụ đề theo số từ.

Repo chưa có model aligner tiếng Việt (Montreal Forced Aligner / wav2vec2). Nếu Whisper lệch trên cụm số, bước 2 vẫn bắt buộc đối chiếu với lời đã duyệt. Không dùng eSpeak làm giọng đọc.

## Công sức

Một script đọc MP3 có sẵn và ghi mảng caption. Không sửa workflow, không thêm dependency trong PR này. Model Whisper tải một lần, chạy CPU. Sau đó một lần render Remotion dùng lại MP3 (không có POST Vbee) để chữ burn-in khớp mốc mới. Cảnh vừa đổi chữ vẫn cần MP3 mới trước khi căn.

## File sẽ phải dựng lại nếu làm bước này

Không sinh trong PR này:

- `out/props.json` (mảng `captions`)
- `out/subtitles-estimated.srt`
- MP4 burn-in của KR_MID và KR_CLOSE
- MP3 Vbee của riêng các cảnh đã đổi chữ, trước khi alignment của những cảnh đó có nghĩa
