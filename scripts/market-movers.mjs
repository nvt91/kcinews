import { fileURLToPath } from "node:url";
import path from "node:path";

// Daily Korea market movers post for the Telegram channel (owner request 26/11/2026).
// Pure market data from Naver Finance (KRX quotes): indexes, liquid top gainers,
// leading industries and themes. No opinions, no buy/sell calls, no AI writing.
// Usage: node scripts/market-movers.mjs [--dry-run]   (dry-run prints only)
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_POST_CHAT (where to post), TELEGRAM_CHAT_ID (owner, for errors)

const API = "https://m.stock.naver.com/api";
const MIN_VALUE_MILLION_KRW = 10_000; // 100 tỷ won traded: filters out illiquid pumps.

const INDUSTRY_VI = {
  "창업투자": "Đầu tư mạo hiểm", "생명과학도구및서비스": "Dịch vụ khoa học sự sống", "전자장비와기기": "Thiết bị điện tử",
  "생물공학": "Công nghệ sinh học", "통신장비": "Thiết bị viễn thông", "건강관리기술": "Công nghệ y tế",
  "반도체와반도체장비": "Bán dẫn", "기타금융": "Tài chính khác", "건강관리업체및서비스": "Dịch vụ y tế",
  "인터넷과카탈로그소매": "Bán lẻ trực tuyến", "기계": "Máy móc", "핸드셋": "Điện thoại", "생명보험": "Bảo hiểm nhân thọ",
  "소프트웨어": "Phần mềm", "디스플레이장비및부품": "Thiết bị màn hình", "사무용전자제품": "Thiết bị văn phòng",
  "방송과엔터테인먼트": "Truyền hình & giải trí", "판매업체": "Phân phối", "에너지장비및서비스": "Thiết bị năng lượng",
  "증권": "Chứng khoán", "화학": "Hóa chất", "건강관리장비와용품": "Thiết bị y tế", "호텔,레스토랑,레저": "Khách sạn & giải trí",
  "기타": "Khác", "비철금속": "Kim loại màu", "전기장비": "Thiết bị điện", "IT서비스": "Dịch vụ IT", "석유와가스": "Dầu khí",
  "우주항공과국방": "Hàng không vũ trụ & quốc phòng", "교육서비스": "Giáo dục", "복합기업": "Tập đoàn đa ngành",
  "컴퓨터와주변기기": "Máy tính & thiết bị ngoại vi", "전기유틸리티": "Điện lực", "문구류": "Văn phòng phẩm",
  "가정용품": "Đồ gia dụng", "전기제품": "Sản phẩm điện", "레저용장비와제품": "Thiết bị giải trí", "게임엔터테인먼트": "Game",
  "건축제품": "Sản phẩm xây dựng", "섬유,의류,신발,호화품": "Dệt may & hàng xa xỉ", "전문소매": "Bán lẻ chuyên doanh",
  "무역회사와판매업체": "Thương mại", "광고": "Quảng cáo", "건축자재": "Vật liệu xây dựng", "화장품": "Mỹ phẩm", "철강": "Thép",
  "식품과기본식료품소매": "Bán lẻ thực phẩm", "디스플레이패널": "Tấm nền màn hình", "조선": "Đóng tàu", "전자제품": "Điện tử tiêu dùng",
  "양방향미디어와서비스": "Nền tảng số", "도로와철도운송": "Vận tải đường bộ & sắt", "출판": "Xuất bản", "종이와목재": "Giấy & gỗ",
  "다각화된통신서비스": "Viễn thông", "제약": "Dược phẩm", "가스유틸리티": "Khí đốt", "해운사": "Vận tải biển", "건설": "Xây dựng",
  "운송인프라": "Hạ tầng vận tải", "식품": "Thực phẩm", "포장재": "Bao bì", "카드": "Thẻ tín dụng", "상업서비스와공급품": "Dịch vụ thương mại",
  "음료": "Đồ uống", "백화점과일반상점": "Bách hóa", "가구": "Nội thất", "다각화된소비자서비스": "Dịch vụ tiêu dùng",
  "가정용기기와용품": "Thiết bị gia đình", "손해보험": "Bảo hiểm phi nhân thọ", "은행": "Ngân hàng", "복합유틸리티": "Tiện ích tổng hợp",
  "부동산": "Bất động sản", "담배": "Thuốc lá", "자동차": "Ô tô", "자동차부품": "Phụ tùng ô tô", "항공화물운송과물류": "Logistics",
  "무선통신서비스": "Viễn thông di động", "항공사": "Hàng không",
};

const STOCK_VI = {
  "삼성전자": "Samsung Electronics", "SK하이닉스": "SK Hynix", "LG에너지솔루션": "LG Energy Solution", "삼성바이오로직스": "Samsung Biologics",
  "현대차": "Hyundai Motor", "기아": "Kia", "셀트리온": "Celltrion", "NAVER": "Naver", "카카오": "Kakao", "POSCO홀딩스": "POSCO Holdings",
  "KB금융": "KB Financial", "신한지주": "Shinhan Financial", "삼성SDI": "Samsung SDI", "LG화학": "LG Chem", "한화에어로스페이스": "Hanwha Aerospace",
  "HD현대중공업": "HD Hyundai Heavy", "두산에너빌리티": "Doosan Enerbility", "삼성물산": "Samsung C&T", "현대모비스": "Hyundai Mobis",
  "에코프로비엠": "EcoPro BM", "에코프로": "EcoPro", "알테오젠": "Alteogen", "HLB": "HLB", "한미반도체": "Hanmi Semiconductor",
};

const num = (s) => Number(String(s ?? "").replace(/,/g, ""));
const vi = (n, d = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (r) => (r > 0 ? "+" : r < 0 ? "−" : "") + vi(Math.abs(r)) + "%";
const nameOf = (s) => STOCK_VI[s.stockName] ? `${STOCK_VI[s.stockName]} (${s.stockName})` : s.stockName;

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Naver ${res.status} for ${url.replace(API, "")}`);
  return res.json();
}

export function buildPost({ date, kospi, kosdaq, gainers, industries, themes }) {
  // Naver codes: 1 upper limit, 2 up, 3 flat, 4 lower limit, 5 down.
  const ratio = (i) => {
    const r = Math.abs(num(i.fluctuationsRatio));
    return ["4", "5"].includes(String(i.compareToPreviousPrice?.code)) || num(i.fluctuationsRatio) < 0 ? -r : r;
  };
  const idx = (label, i) => `${label} ${vi(num(i.closePrice))} (${pct(ratio(i))})`;
  const lines = [
    `📊 Chứng khoán Hàn Quốc ${date}`,
    `${idx("KOSPI", kospi)} | ${idx("KOSDAQ", kosdaq)}`,
    "",
    "🔥 Cổ phiếu tăng mạnh (giá trị giao dịch > 100 tỷ won)",
    ...(gainers.length ? gainers.map((s, k) =>
      `${k + 1}. ${nameOf(s)} · ${s.market} ${pct(num(s.fluctuationsRatio))}`) : ["(Không có mã đủ thanh khoản)"]),
    "",
    "🏭 Ngành dẫn dắt",
    ...industries.map((g) => `• ${INDUSTRY_VI[g.name] || g.name} ${pct(num(g.changeRate))} (${g.riseCount}/${g.totalCount} mã tăng)`),
  ];
  if (themes.length) {
    lines.push("", "🚀 Chủ đề nổi bật", ...themes.map((g) => `• ${g.name} ${pct(num(g.changeRate))}`));
  }
  lines.push("", "Nguồn: Naver Finance (dữ liệu KRX) · Thông tin tham khảo, không phải khuyến nghị đầu tư.",
    "#ChungKhoanHanQuoc #KOSPI #KOSDAQ");
  return lines.join("\n");
}

export async function collect(today = new Date()) {
  const kst = new Date(today.getTime() + 9 * 3600e3).toISOString().slice(0, 10);
  const [kospi, kosdaq] = await Promise.all([get(`${API}/index/KOSPI/basic`), get(`${API}/index/KOSDAQ/basic`)]);
  const traded = String(kospi.localTradedAt || "").slice(0, 10);
  if (traded !== kst) return { skip: `Hôm nay (${kst}) không có phiên giao dịch (dữ liệu cuối: ${traded}).` };
  const lists = await Promise.all(["KOSPI", "KOSDAQ"].map(async (m) =>
    (await get(`${API}/stocks/up/${m}?page=1&pageSize=100`)).stocks.map((s) => ({ ...s, market: m }))));
  const gainers = lists.flat()
    .filter((s) => s.stockEndType === "stock" && num(s.accumulatedTradingValue) >= MIN_VALUE_MILLION_KRW)
    .sort((a, b) => num(b.fluctuationsRatio) - num(a.fluctuationsRatio)).slice(0, 7);
  const industries = (await get(`${API}/stocks/industry?page=1&pageSize=100`)).groups
    .filter((g) => g.totalCount >= 5 && g.name !== "기타").slice(0, 5);
  const themes = (await get(`${API}/stocks/theme?page=1&pageSize=20`)).groups
    .filter((g) => g.totalCount >= 5).slice(0, 3);
  const [y, m, d] = kst.split("-");
  return { post: buildPost({ date: `${d}/${m}/${y}`, kospi, kosdaq, gainers, industries, themes }) };
}

async function send(token, chat, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(30000),
  });
  const body = await res.json().catch(() => ({}));
  if (!body.ok) throw new Error(`Telegram: ${body.description || res.status}`);
}

async function main() {
  const dry = process.argv.includes("--dry-run");
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const target = process.env.TELEGRAM_POST_CHAT?.trim();
  const owner = process.env.TELEGRAM_CHAT_ID?.trim();
  try {
    const { post, skip } = await collect();
    if (skip) { console.log(skip); return; }
    console.log(post);
    if (dry || !token || !target) { console.log(`\n(chưa gửi: ${dry ? "dry-run" : "thiếu token/chat"})`); return; }
    await send(token, target, post);
    console.log(`\nĐã đăng lên ${target}.`);
  } catch (error) {
    const msg = String(error?.message || error).replace(/bot\d+:[\w-]+/g, "bot[ẩn]");
    console.error(msg);
    if (token && owner && !dry) await send(token, owner, `❌ Bản tin cổ phiếu tăng nóng lỗi: ${msg}`).catch(() => {});
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
