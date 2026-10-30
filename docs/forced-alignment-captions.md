# Căn phụ đề theo thời gian từng từ (offline)

Script đã có trong `scripts/align-captions.mjs` và được `scripts/run-job.mjs` gọi khi dựng cảnh. Mặc định tắt. Water đo phụ đề lệch khoảng 1 giây so với tiếng. Phần dưới giữ nguyên nhân khả dĩ và cách bật.

## Pipeline hiện tại

Phụ đề không được commit. `.gitignore` bỏ qua `out/`. `scripts/run-job.mjs` tạo phụ đề lúc dựng video:

- Gọi Vbee từng cảnh, đo độ dài MP3 bằng ffprobe.
- `durationFrames = ceil(giây × 30) + 10`. Mười frame cuối (khoảng 0,33 giây) là đệm; phần phụ đề chỉ trải trên `durationFrames - 10`.
- Mặc định vẫn tách `voiceText` bằng khoảng trắng, mỗi cue 7 từ, chia đều theo số từ trên độ dài audio. Không có mốc từng từ. Cờ `KCI_ALIGN_CAPTIONS=1` đổi bước này sang căn Whisper offline.
- Ghi `out/props.json` và `out/subtitles-estimated.srt`. `out/qc.json` ghi phụ đề là ước lượng, cần nghe lại.
- `src/KciNewsDaily.tsx` hiện cue theo frame trong cảnh. Chữ cue mờ dần 5 frame (khoảng 0,17 giây). Cả lớp hình mờ dần 10 frame đầu (khoảng 0,33 giây). Audio bắt đầu ở frame 0, ngoài lớp mờ đó.

`package.json` không có Whisper. `EDITING_WORKFLOW.md` yêu cầu mốc từ trên audio thật, và ghi nhận bước này chưa được cài. Hai video 29/10 không có file SRT/timing trong repo. Artifact của run `40809139571` (KR_MID) và `40841785749` (KR_CLOSE) chứa bản phụ đề tỷ lệ từ sinh ra lúc render. Đổi lời thì các file đó lỗi thời. PR này không sinh lại.

## Vì sao có thể lệch khoảng 1 giây

Chưa đo lại MP3. Các cơ chế sau đủ lớn để giải thích mức Water nghe, và có thể cộng dồn:

1. Cue 7 từ hiện cùng lúc. Từ đứng giữa cue không có mốc riêng. Với thoại khoảng 9–15 giây, một cue thường dài khoảng 1–1,5 giây.
2. Chia đều theo số từ. Cụm số đọc chậm hơn từ chức năng, nên lệch tích lũy tới khoảng một giây ở giữa cảnh.
3. ffprobe tính cả khoảng lặng đầu/cuối của MP3. Phụ đề bắt đầu ở frame 0. Nếu Vbee có lặng đầu vài trăm mili giây tới khoảng một giây, chữ đi trước tiếng. Chưa mở file MP3 của hai video này để đo khoảng lặng.
4. Fade hình 0,33 giây và fade chữ 0,17 giây làm chữ trông muộn hơn tiếng, nhưng riêng nó nhỏ hơn một giây. Đệm 10 frame ở cuối cảnh không đẩy cả dãy phụ đề đi một giây.

## Cách bật

Script cục bộ vẫn tắt cho đến khi có `KCI_ALIGN_CAPTIONS=1` hoặc `--align-captions`. Job `render` trên Actions thì khác: nếu biến repository `KCI_ALIGN_CAPTIONS` không được đặt, workflow gán `1` để nhánh PR căn phụ đề mà không sửa cấu hình repo. Nếu biến đã có giá trị, kể cả `0`, workflow giữ đúng giá trị đó. Khi merge có thể đặt biến thành `0` hoặc đổi lại biểu thức mặc định trong workflow.

- Biến `KCI_ALIGN_CAPTIONS=1` (hoặc `true` / `yes`), hoặc cờ `--align-captions` trên `node scripts/run-job.mjs`.
- Bước cài whisper.cpp có `continue-on-error`. Cài hoặc tải model lỗi thì `run-job.mjs` quay về cue 7 từ và job dựng vẫn chạy tiếp.
- Binary: `whisper-cli` (whisper.cpp) hoặc `whisper` local. Model file qua `KCI_WHISPER_MODEL`. Workflow khi được bật tải `ggml-small.bin` (khoảng 466 MiB) vào `~/.cache/kci-whisper/`.
- JSON `-oj` của whisper.cpp là vài đoạn cả câu, không phải từng từ. Parser tách đoạn đó thành từ và, khi có `-ojf`, ghép token con. Cụm số đọc (một, trăm, phẩy, nghìn...) được căn vào token có chữ số.
- Thời gian cài và thời gian nhận dạng: chưa đo, vì test cục bộ không tải model và không chạy bước cài. Khi cờ bật, job `render` thêm một lần biên dịch whisper.cpp và một lần tải khoảng 142 MiB trước bước dựng hiện có.

Khi cờ bật, mỗi cảnh có MP3 được đưa qua ffmpeg ra WAV 16 kHz rồi Whisper ngôn ngữ `vi`. Mốc từ được khớp với `voiceText` đã duyệt. Chữ trên hình vẫn là lời kịch bản, không phải chữ Whisper nghe được. Cue tối đa 3 từ, ngắt thêm ở `.?!…`. Nếu không có binary, không có model, JSON lỗi, hoặc khớp dưới 50% số từ, cảnh đó trở lại chia đều 7 từ và `console.warn` ghi lý do.

Job `check` của pull request chỉ chạy `node scripts/test-align-captions.mjs` với WAV im lặng và dữ liệu giả. Không gọi Vbee và không tải model.

## File sẽ phải dựng lại nếu làm bước này

Không sinh trong PR này:

- `out/props.json` (mảng `captions`)
- `out/subtitles-estimated.srt`
- MP4 burn-in của KR_MID và KR_CLOSE
- MP3 Vbee của riêng các cảnh đã đổi chữ, trước khi alignment của những cảnh đó có nghĩa
